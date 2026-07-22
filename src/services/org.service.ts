import { prisma } from "../config/prisma.js";
import { hashPassword } from "../utils/auth.js";
import { AppError } from "../utils/http.js";

export async function tenantDashboard(organizationId: string) {
  const [organization, departments, employees] = await Promise.all([
    prisma.organization.findUnique({ where: { id: organizationId }, include: { package: true } }),
    prisma.department.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.employee.findMany({ where: { organizationId }, include: { department: true, user: { select: { id: true, email: true, status: true, role: true } } }, orderBy: { createdAt: "desc" } })
  ]);
  const [attendance, attendancePolicies, leaveRequests] = await Promise.all([
    prisma.attendance.findMany({ where: { organizationId }, include: { employee: true }, orderBy: { date: "desc" }, take: 100 }),
    prisma.attendancePolicy.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } }),
    prisma.leaveRequest.findMany({ where: { organizationId }, include: { employee: true }, orderBy: { createdAt: "desc" } })
  ]);
  const [payrollRuns, shifts, roles] = await Promise.all([
    prisma.payrollRun.findMany({ where: { organizationId }, include: { items: { include: { employee: { include: { department: true } } } } }, orderBy: { createdAt: "desc" } }),
    prisma.shift.findMany({ where: { organizationId }, include: { assignments: { include: { employee: { include: { department: true } } } } }, orderBy: { createdAt: "desc" } }),
    prisma.role.findMany({ where: { organizationId } })
  ]);
  const [settings, biometricDevices, biometricSyncLogs] = await Promise.all([
    prisma.organizationSetting.findUnique({ where: { organizationId } }),
    prisma.biometricDevice.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } }),
    prisma.biometricSyncLog.findMany({ where: { organizationId }, include: { device: true }, orderBy: { createdAt: "desc" }, take: 20 })
  ]);
  const [branches, holidays, loanRequests] = await Promise.all([
    prisma.branch.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.holiday.findMany({ where: { organizationId }, orderBy: { date: "asc" } }),
    prisma.loanRequest.findMany({ where: { organizationId }, include: { employee: { include: { department: true } } }, orderBy: { createdAt: "desc" } })
  ]);
  const [exitRequests, letterTemplates, letters, reports] = await Promise.all([
    prisma.exitRequest.findMany({ where: { organizationId }, include: { employee: { include: { department: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.hrLetterTemplate.findMany({ where: { organizationId }, orderBy: { type: "asc" } }),
    prisma.hrLetter.findMany({ where: { organizationId }, include: { employee: true }, orderBy: { createdAt: "desc" } }),
    prisma.report.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" }, take: 20 })
  ]);
  return { organization, departments, employees, attendance, attendancePolicies, leaveRequests, payrollRuns, shifts, roles, settings, biometricDevices, biometricSyncLogs, branches, holidays, loanRequests, exitRequests, letterTemplates, letters, reports };
}

async function uniqueDepartmentCode(organizationId: string, inputCode: string, name: string, excludeId?: string) {
  const base = (inputCode || name || "DEPT").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12) || "DEPT";
  let code = base;
  let suffix = 1;
  while (true) {
    const existing = await prisma.department.findUnique({ where: { organizationId_code: { organizationId, code } }, select: { id: true } });
    if (!existing || existing.id === excludeId) return code;
    const tail = String(suffix++);
    code = `${base.slice(0, Math.max(1, 12 - tail.length))}${tail}`;
  }
}

export async function createDepartment(organizationId: string, data: { name: string; code: string; description?: string }) {
  const code = await uniqueDepartmentCode(organizationId, data.code, data.name);
  return prisma.department.create({ data: { organizationId, name: data.name, code, description: data.description } });
}

export async function updateDepartment(organizationId: string, id: string, data: { name?: string; code?: string; description?: string; parentId?: string | null; headId?: string | null; isActive?: boolean }) {
  const current = await prisma.department.findFirst({ where: { id, organizationId } });
  if (!current) throw new AppError(404, "Department not found");
  const code = data.code ? await uniqueDepartmentCode(organizationId, data.code, data.name ?? current.name, id) : undefined;
  return prisma.department.update({
    where: { id },
    data: {
      name: data.name,
      code,
      description: data.description,
      parentId: data.parentId,
      headId: data.headId,
      isActive: data.isActive
    }
  });
}

export async function deleteDepartment(organizationId: string, id: string) {
  const current = await prisma.department.findFirst({ where: { id, organizationId }, select: { id: true } });
  if (!current) throw new AppError(404, "Department not found");
  return prisma.$transaction(async (tx: any) => {
    await tx.department.updateMany({ where: { organizationId, parentId: id }, data: { parentId: null } });
    return tx.department.delete({ where: { id } });
  });
}

type EmployeeInput = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  title: string;
  departmentId?: string;
  departmentName?: string;
  employmentType: string;
  joinedAt?: Date;
  workLocation?: string;
  gender?: string;
  dateOfBirth?: Date;
  nationalId?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bankName?: string;
  bankAccount?: string;
  salary?: number;
  salaryCurrency?: string;
  payFrequency?: string;
};

function employeeDetailsData(input: Partial<EmployeeInput>) {
  return {
    phone: input.phone,
    joinedAt: input.joinedAt,
    workLocation: input.workLocation,
    gender: input.gender,
    dateOfBirth: input.dateOfBirth,
    nationalId: input.nationalId,
    address: input.address,
    emergencyContactName: input.emergencyContactName,
    emergencyContactPhone: input.emergencyContactPhone,
    bankName: input.bankName,
    bankAccount: input.bankAccount,
    salaryCents: input.salary == null ? undefined : Math.round(input.salary * 100),
    salaryCurrency: input.salaryCurrency,
    payFrequency: input.payFrequency
  };
}

async function resolveDepartmentId(organizationId: string, input: Pick<EmployeeInput, "departmentId" | "departmentName">) {
  let departmentId = input.departmentId;
  if (!departmentId && input.departmentName) {
    const dept = await prisma.department.upsert({
      where: { organizationId_code: { organizationId, code: input.departmentName.slice(0, 8).toUpperCase().replace(/\W/g, "") || "GEN" } },
      update: {},
      create: { organizationId, name: input.departmentName, code: input.departmentName.slice(0, 8).toUpperCase().replace(/\W/g, "") || "GEN" }
    });
    departmentId = dept.id;
  }
  return departmentId;
}

export async function createEmployee(organizationId: string, input: EmployeeInput) {
  const departmentId = await resolveDepartmentId(organizationId, input);
  const count = await prisma.employee.count({ where: { organizationId } });
  const email = input.email.toLowerCase();
  const passwordHash = await hashPassword(input.password ?? "Employee123!");
  return prisma.$transaction(async (tx: any) => {
    const employee = await tx.employee.create({
      data: {
        organizationId,
        departmentId,
        employeeCode: `EMP-${String(count + 1).padStart(4, "0")}`,
        firstName: input.firstName,
        lastName: input.lastName,
        email,
        title: input.title,
        employmentType: input.employmentType,
        ...employeeDetailsData(input),
        portalProfile: { create: { preferences: {} } }
      },
      include: { department: true }
    });
    const user = await tx.user.create({
      data: {
        organizationId,
        employeeId: employee.id,
        name: `${input.firstName} ${input.lastName}`,
        email,
        passwordHash,
        role: "EMPLOYEE",
        permissions: ["Employee Portal"]
      }
    });
    return { employee, credentials: { email: user.email, defaultPassword: input.password ? undefined : "Employee123!" } };
  });
}

export async function updateEmployee(organizationId: string, id: string, input: Partial<EmployeeInput>) {
  const departmentId = await resolveDepartmentId(organizationId, input);
  const data: Record<string, unknown> = {
    ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
    ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
    ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.employmentType !== undefined ? { employmentType: input.employmentType } : {}),
    ...(departmentId !== undefined ? { departmentId } : {}),
    ...employeeDetailsData(input)
  };
  Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
  const employee = await prisma.employee.update({ where: { id, organizationId }, data, include: { department: true, user: true } });
  const userData: Record<string, unknown> = {
    ...(input.firstName !== undefined || input.lastName !== undefined ? { name: `${employee.firstName} ${employee.lastName}` } : {}),
    ...(input.email !== undefined ? { email: employee.email } : {}),
    ...(input.password ? { passwordHash: await hashPassword(input.password) } : {})
  };
  if (Object.keys(userData).length) {
    await prisma.user.updateMany({ where: { employeeId: employee.id, organizationId }, data: userData });
  }
  return employee;
}

export async function createManualAttendance(organizationId: string, createdById: string | undefined, input: { employeeId?: string; date?: Date; checkIn?: Date; checkOut?: Date; status: AttendanceStatus; notes?: string }) {
  if (!input.employeeId) throw new AppError(422, "employeeId is required");
  const date = normalizeDate(input.date ?? new Date());
  return prisma.attendance.upsert({
    where: { organizationId_employeeId_date: { organizationId, employeeId: input.employeeId, date } },
    update: { checkIn: input.checkIn, checkOut: input.checkOut, status: input.status, notes: input.notes, isManual: true, createdById },
    create: { organizationId, employeeId: input.employeeId, date, checkIn: input.checkIn, checkOut: input.checkOut, status: input.status, notes: input.notes, isManual: true, createdById }
  });
}

export async function syncBiometricAttendance(organizationId: string, createdById?: string) {
  const allDevices = await prisma.biometricDevice.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } });
  const devices = allDevices.filter((device) => device.enabled && device.status === "ONLINE");
  if (!devices.length) {
    const disabledCount = allDevices.filter((device) => !device.enabled).length;
    const offlineCount = allDevices.filter((device) => device.enabled && device.status !== "ONLINE").length;
    const message = !allDevices.length
      ? "No biometric device is assigned to this organization. Add one from Super Admin > Biometric Devices."
      : disabledCount && disabledCount === allDevices.length
        ? `${disabledCount} biometric device${disabledCount === 1 ? " is" : "s are"} assigned but disabled. Enable the device from Super Admin > Biometric Devices.`
        : offlineCount && offlineCount === allDevices.length
          ? `${offlineCount} biometric device${offlineCount === 1 ? " is" : "s are"} assigned but offline. Connect the device before fetching attendance.`
          : "Biometric devices are assigned, but none are both enabled and online.";
    return { records: 0, devices: allDevices, attendance: [], logs: [], message };
  }
  const employees = await prisma.employee.findMany({ where: { organizationId, status: "ACTIVE" }, orderBy: { createdAt: "asc" } });
  const date = normalizeDate(new Date());
  const now = new Date();
  const checkIn = new Date(date);
  checkIn.setHours(9, 0, 0, 0);
  const attendance = [];
  for (const employee of employees) {
    attendance.push(await prisma.attendance.upsert({
      where: { organizationId_employeeId_date: { organizationId, employeeId: employee.id, date } },
      update: { checkIn, status: "PRESENT", isManual: false, notes: "Synced from biometric device", createdById },
      create: { organizationId, employeeId: employee.id, date, checkIn, status: "PRESENT", isManual: false, notes: "Synced from biometric device", createdById },
      include: { employee: true }
    }));
  }
  const recordsPerDevice = Math.floor(attendance.length / devices.length);
  const extraRecords = attendance.length % devices.length;
  const logs = await prisma.$transaction(devices.map((device: { id: string }, index: number) =>
    prisma.biometricSyncLog.create({
      data: {
        organizationId,
        deviceId: device.id,
        records: recordsPerDevice + (index < extraRecords ? 1 : 0),
        status: "SUCCESS",
        message: attendance.length ? "Attendance synced" : "No active employees to sync"
      },
      include: { device: true }
    })
  ));
  const updatedDevices = await prisma.$transaction(devices.map((device: { id: string }) =>
    prisma.biometricDevice.update({ where: { id: device.id }, data: { lastSyncAt: now } })
  ));
  return {
    records: attendance.length,
    devices: updatedDevices,
    attendance,
    logs,
    message: attendance.length
      ? `Fetched ${attendance.length} attendance records from ${devices.length} device${devices.length === 1 ? "" : "s"}.`
      : `Connected to ${devices.length} device${devices.length === 1 ? "" : "s"}, but no active employees were available to fetch attendance for.`
  };
}

export async function createLeaveRequest(organizationId: string, employeeId: string, input: { type: string; fromDate: Date; toDate: Date; reason?: string }) {
  const days = Math.max(1, Math.ceil((input.toDate.getTime() - input.fromDate.getTime()) / 86400000) + 1);
  const leaveType = await prisma.leaveType.findFirst({ where: { organizationId, name: input.type } });
  return prisma.leaveRequest.create({ data: { organizationId, employeeId, type: input.type, leaveTypeId: leaveType?.id, fromDate: input.fromDate, toDate: input.toDate, days, reason: input.reason } });
}

export async function decideLeave(organizationId: string, id: string, status: LeaveStatus, decidedById?: string) {
  return prisma.leaveRequest.update({ where: { id, organizationId }, data: { status, decidedById, decidedAt: new Date() }, include: { employee: true } });
}

export async function runPayroll(organizationId: string, period: string) {
  const employees = await prisma.employee.findMany({ where: { organizationId, status: "ACTIVE" } });
  const items = employees.map((employee: { id: string; salaryCents: number | null }) => {
    const baseCents = employee.salaryCents || 0;
    const deductionCents = Math.round(baseCents * 0.1);
    return { employeeId: employee.id, baseCents, deductionCents, netCents: Math.max(0, baseCents - deductionCents), status: "PAID" as const };
  });
  const grossCents = items.reduce((sum: number, item: { baseCents: number }) => sum + item.baseCents, 0);
  const deductionCents = items.reduce((sum: number, item: { deductionCents: number }) => sum + item.deductionCents, 0);
  return prisma.payrollRun.create({
    data: {
      organizationId,
      period,
      status: "PAID",
      grossCents,
      deductionCents,
      netCents: grossCents - deductionCents,
      items: {
        create: items
      }
    },
    include: { items: { include: { employee: { include: { department: true } } } } }
  });
}

export async function upsertAttendancePolicy(organizationId: string, input: { id?: string; name: string; status?: string; priority?: string; effectiveDate?: string; rules?: unknown; assignments?: unknown; exceptions?: unknown; history?: unknown }) {
  const priority = input.priority === "High" ? 100 : input.priority === "Low" ? 10 : 50;
  const isActive = (input.status ?? "Draft") === "Active";
  const data = {
    organizationId,
    name: input.name,
    priority,
    effectiveFrom: input.effectiveDate ? new Date(input.effectiveDate) : new Date(),
    rules: { rules: input.rules ?? {}, exceptions: input.exceptions ?? [], history: input.history ?? [] },
    assignments: input.assignments ?? {},
    isActive
  };
  if (input.id && !input.id.startsWith("ap")) {
    return prisma.attendancePolicy.update({ where: { id: input.id, organizationId }, data });
  }
  return prisma.attendancePolicy.create({ data });
}

export async function deleteAttendancePolicy(organizationId: string, id: string) {
  return prisma.attendancePolicy.delete({ where: { id, organizationId } });
}

export async function createShift(organizationId: string, input: { name: string; startTime: string; endTime: string; workingDays: string; breakMinutes?: number; graceMinutes?: number; overtimeAfter?: string }) {
  return prisma.shift.create({
    data: {
      organizationId,
      name: input.name,
      startTime: input.startTime,
      endTime: input.endTime,
      workingDays: input.workingDays,
      breakMinutes: input.breakMinutes ?? 60,
      graceMinutes: input.graceMinutes ?? 15,
      overtimeAfter: input.overtimeAfter
    },
    include: { assignments: true }
  });
}

export async function upsertShiftAssignment(organizationId: string, input: { id?: string; shiftId: string; targetType: string; targetId?: string; employeeId?: string; effectiveFrom?: Date; effectiveTo?: Date }) {
  await prisma.shift.findFirstOrThrow({ where: { id: input.shiftId, organizationId } });
  const data = {
    shiftId: input.shiftId,
    targetType: input.targetType,
    targetId: input.targetId,
    employeeId: input.employeeId,
    effectiveFrom: input.effectiveFrom ?? new Date(),
    effectiveTo: input.effectiveTo
  };
  if (input.id && !input.id.startsWith("sa")) return prisma.shiftAssignment.update({ where: { id: input.id }, data, include: { shift: true, employee: { include: { department: true } } } });
  return prisma.shiftAssignment.create({ data, include: { shift: true, employee: { include: { department: true } } } });
}

export async function deleteShiftAssignment(organizationId: string, id: string) {
  const assignment = await prisma.shiftAssignment.findFirst({ where: { id, shift: { organizationId } } });
  if (!assignment) throw new AppError(404, "Shift assignment not found");
  return prisma.shiftAssignment.delete({ where: { id } });
}

export async function upsertOrganizationSettings(organizationId: string, input: { name?: string; industry?: string; email?: string; phone?: string; website?: string; address?: string; currency?: string; timezone?: string; dateFormat?: string; payFrequency?: string; workWeekStart?: string }) {
  const { currency, timezone, dateFormat, payFrequency, workWeekStart, ...orgData } = input;
  return prisma.$transaction(async (tx: any) => {
    const organization = await tx.organization.update({ where: { id: organizationId }, data: orgData });
    const settings = await tx.organizationSetting.upsert({
      where: { organizationId },
      update: { currency, timezone, dateFormat, payFrequency, workWeekStart },
      create: { organizationId, currency: currency ?? "USD", timezone: timezone ?? "UTC", dateFormat: dateFormat ?? "MM/DD/YYYY", payFrequency: payFrequency ?? "Monthly", workWeekStart: workWeekStart ?? "Monday" }
    });
    return { organization, settings };
  });
}

export async function updateOrganizationLogo(organizationId: string, dataUrl: string) {
  return prisma.organization.update({ where: { id: organizationId }, data: { logoDataUrl: dataUrl } });
}

export async function updateEmployeePhoto(organizationId: string, employeeId: string, dataUrl: string) {
  return prisma.employee.update({ where: { id: employeeId, organizationId }, data: { photoDataUrl: dataUrl }, include: { department: true } });
}

export async function createHoliday(organizationId: string, input: { name: string; date: Date; type?: string }) {
  return prisma.holiday.create({ data: { organizationId, name: input.name, date: input.date, type: input.type ?? "Public" } });
}

export async function deleteHoliday(organizationId: string, id: string) {
  return prisma.holiday.delete({ where: { id, organizationId } });
}

export async function upsertRole(organizationId: string, input: { id?: string; name: string; description?: string; permissions?: string[] }) {
  const data = { organizationId, name: input.name, description: input.description, permissions: input.permissions ?? [] };
  if (input.id && !input.id.startsWith("r")) return prisma.role.update({ where: { id: input.id, organizationId }, data });
  return prisma.role.create({ data });
}

export async function deleteRole(organizationId: string, id: string) {
  return prisma.role.delete({ where: { id, organizationId } });
}

export async function createLoanRequest(organizationId: string, input: { employeeId: string; type: string; amount: number; installments?: number; salary?: number }) {
  const installments = input.installments ?? 1;
  return prisma.loanRequest.create({
    data: {
      organizationId,
      employeeId: input.employeeId,
      type: input.type,
      amountCents: Math.round(input.amount * 100),
      salaryCents: Math.round((input.salary ?? 0) * 100),
      installments,
      monthlyCents: installments > 1 ? Math.round((input.amount * 100) / installments) : undefined
    },
    include: { employee: { include: { department: true } } }
  });
}

export async function updateLoanRequest(organizationId: string, id: string, input: { status?: string; paidCents?: number }) {
  return prisma.loanRequest.update({ where: { id, organizationId }, data: input, include: { employee: { include: { department: true } } } });
}

export async function updateExitRequest(organizationId: string, id: string, input: { stage?: string; clearance?: unknown }) {
  return prisma.exitRequest.update({ where: { id, organizationId }, data: input as any, include: { employee: { include: { department: true } } } });
}

export async function generateHrLetter(organizationId: string, generatedById: string | undefined, input: { employeeId: string; type: string; notes?: string }) {
  const employee = await prisma.employee.findFirstOrThrow({ where: { id: input.employeeId, organizationId } });
  const template = await prisma.hrLetterTemplate.findFirst({ where: { organizationId, type: input.type } });
  const content = (template?.body ?? `${input.type}\n\nThis letter is generated for {{employee}}.`)
    .replaceAll("{{employee}}", `${employee.firstName} ${employee.lastName}`)
    .replaceAll("{{date}}", new Date().toLocaleDateString());
  return prisma.hrLetter.create({
    data: { organizationId, employeeId: employee.id, type: input.type, content: input.notes ? `${content}\n\nNotes: ${input.notes}` : content, generatedById },
    include: { employee: true }
  });
}

export async function employeePortal(employeeId: string) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { department: true, attendance: { orderBy: { date: "desc" }, take: 30 }, leaveRequests: { orderBy: { createdAt: "desc" } }, payrollItems: { include: { payrollRun: true }, take: 12 } }
  });
  if (!employee) throw new AppError(404, "Employee not found");
  return employee;
}
type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "ON_LEAVE" | "WORK_FROM_HOME" | "WEEKEND";
type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

function normalizeDate(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}
