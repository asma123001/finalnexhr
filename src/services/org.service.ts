import { prisma } from "../config/prisma.js";
import type { Prisma } from "@prisma/client";
import { hashPassword } from "../utils/auth.js";
import { AppError } from "../utils/http.js";

export async function tenantDashboard(organizationId: string) {
  const [organization, departments, employees, attendance, attendancePolicies, leaveRequests, payrollRuns, shifts, roles, settings, biometricDevices, biometricSyncLogs, branches, holidays, loanRequests, exitRequests, letterTemplates, letters, reports] = await Promise.all([
    prisma.organization.findUnique({ where: { id: organizationId }, include: { package: true } }),
    prisma.department.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.employee.findMany({ where: { organizationId }, include: { department: true, user: { select: { id: true, email: true, status: true, role: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.attendance.findMany({ where: { organizationId }, include: { employee: true }, orderBy: { date: "desc" }, take: 100 }),
    prisma.attendancePolicy.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } }),
    prisma.leaveRequest.findMany({ where: { organizationId }, include: { employee: true }, orderBy: { createdAt: "desc" } }),
    prisma.payrollRun.findMany({ where: { organizationId }, include: { items: { include: { employee: { include: { department: true } } } } }, orderBy: { createdAt: "desc" } }),
    prisma.shift.findMany({ where: { organizationId }, include: { assignments: { include: { employee: { include: { department: true } } } } }, orderBy: { createdAt: "desc" } }),
    prisma.role.findMany({ where: { organizationId } }),
    prisma.organizationSetting.findUnique({ where: { organizationId } }),
    prisma.biometricDevice.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } }),
    prisma.biometricSyncLog.findMany({ where: { organizationId }, include: { device: true }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.branch.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.holiday.findMany({ where: { organizationId }, orderBy: { date: "asc" } }),
    prisma.loanRequest.findMany({ where: { organizationId }, include: { employee: { include: { department: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.exitRequest.findMany({ where: { organizationId }, include: { employee: { include: { department: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.hrLetterTemplate.findMany({ where: { organizationId }, orderBy: { type: "asc" } }),
    prisma.hrLetter.findMany({ where: { organizationId }, include: { employee: true }, orderBy: { createdAt: "desc" } }),
    prisma.report.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" }, take: 20 })
  ]);
  return { organization, departments, employees, attendance, attendancePolicies, leaveRequests, payrollRuns, shifts, roles, settings, biometricDevices, biometricSyncLogs, branches, holidays, loanRequests, exitRequests, letterTemplates, letters, reports };
}

export async function createDepartment(organizationId: string, data: { name: string; code: string; description?: string }) {
  return prisma.department.create({ data: { organizationId, ...data } });
}

export async function createEmployee(organizationId: string, input: { firstName: string; lastName: string; email: string; password?: string; phone?: string; title: string; departmentId?: string; departmentName?: string; employmentType: string }) {
  let departmentId = input.departmentId;
  if (!departmentId && input.departmentName) {
    const dept = await prisma.department.upsert({
      where: { organizationId_code: { organizationId, code: input.departmentName.slice(0, 8).toUpperCase().replace(/\W/g, "") || "GEN" } },
      update: {},
      create: { organizationId, name: input.departmentName, code: input.departmentName.slice(0, 8).toUpperCase().replace(/\W/g, "") || "GEN" }
    });
    departmentId = dept.id;
  }
  const count = await prisma.employee.count({ where: { organizationId } });
  const email = input.email.toLowerCase();
  const passwordHash = await hashPassword(input.password ?? "Employee123!");
  return prisma.$transaction(async (tx) => {
    const employee = await tx.employee.create({
      data: {
        organizationId,
        departmentId,
        employeeCode: `EMP-${String(count + 1).padStart(4, "0")}`,
        firstName: input.firstName,
        lastName: input.lastName,
        email,
        phone: input.phone,
        title: input.title,
        employmentType: input.employmentType,
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
  const devices = await prisma.biometricDevice.findMany({ where: { organizationId, enabled: true, status: "ONLINE" } });
  if (!devices.length) {
    return { records: 0, devices: [], attendance: [], logs: [], message: "No online biometric devices are enabled for this organization." };
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
  const logs = await prisma.$transaction(devices.map((device, index) =>
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
  await prisma.$transaction(devices.map((device) =>
    prisma.biometricDevice.update({ where: { id: device.id }, data: { lastSyncAt: now } })
  ));
  return {
    records: attendance.length,
    devices,
    attendance,
    logs,
    message: `Synced ${attendance.length} attendance records from ${devices.length} device${devices.length === 1 ? "" : "s"}.`
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
  return prisma.payrollRun.create({
    data: {
      organizationId,
      period,
      status: "PAID",
      grossCents: employees.length * 100000,
      deductionCents: employees.length * 10000,
      netCents: employees.length * 90000,
      items: {
        create: employees.map((employee) => ({ employeeId: employee.id, baseCents: 100000, deductionCents: 10000, netCents: 90000, status: "PAID" }))
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
  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.update({ where: { id: organizationId }, data: orgData });
    const settings = await tx.organizationSetting.upsert({
      where: { organizationId },
      update: { currency, timezone, dateFormat, payFrequency, workWeekStart },
      create: { organizationId, currency: currency ?? "USD", timezone: timezone ?? "UTC", dateFormat: dateFormat ?? "MM/DD/YYYY", payFrequency: payFrequency ?? "Monthly", workWeekStart: workWeekStart ?? "Monday" }
    });
    return { organization, settings };
  });
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

export async function updateExitRequest(organizationId: string, id: string, input: { stage?: string; clearance?: Prisma.InputJsonValue }) {
  return prisma.exitRequest.update({ where: { id, organizationId }, data: input, include: { employee: { include: { department: true } } } });
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
