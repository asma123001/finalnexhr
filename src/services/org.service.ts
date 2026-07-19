import { prisma } from "../config/prisma.js";
import { hashPassword } from "../utils/auth.js";
import { AppError } from "../utils/http.js";

export async function tenantDashboard(organizationId: string) {
  const [organization, departments, employees, attendance, leaveRequests, payrollRuns, shifts, roles, settings] = await Promise.all([
    prisma.organization.findUnique({ where: { id: organizationId }, include: { package: true } }),
    prisma.department.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.employee.findMany({ where: { organizationId }, include: { department: true, user: { select: { id: true, email: true, status: true, role: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.attendance.findMany({ where: { organizationId }, include: { employee: true }, orderBy: { date: "desc" }, take: 100 }),
    prisma.leaveRequest.findMany({ where: { organizationId }, include: { employee: true }, orderBy: { createdAt: "desc" } }),
    prisma.payrollRun.findMany({ where: { organizationId }, include: { items: true }, orderBy: { createdAt: "desc" } }),
    prisma.shift.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } }),
    prisma.role.findMany({ where: { organizationId } }),
    prisma.organizationSetting.findUnique({ where: { organizationId } })
  ]);
  return { organization, departments, employees, attendance, leaveRequests, payrollRuns, shifts, roles, settings };
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
  return prisma.attendance.upsert({
    where: { organizationId_employeeId_date: { organizationId, employeeId: input.employeeId, date: input.date ?? new Date() } },
    update: { checkIn: input.checkIn, checkOut: input.checkOut, status: input.status, notes: input.notes, isManual: true, createdById },
    create: { organizationId, employeeId: input.employeeId, date: input.date ?? new Date(), checkIn: input.checkIn, checkOut: input.checkOut, status: input.status, notes: input.notes, isManual: true, createdById }
  });
}

export async function createLeaveRequest(organizationId: string, employeeId: string, input: { type: string; fromDate: Date; toDate: Date; reason?: string }) {
  const days = Math.max(1, Math.ceil((input.toDate.getTime() - input.fromDate.getTime()) / 86400000) + 1);
  const leaveType = await prisma.leaveType.findFirst({ where: { organizationId, name: input.type } });
  return prisma.leaveRequest.create({ data: { organizationId, employeeId, type: input.type, leaveTypeId: leaveType?.id, fromDate: input.fromDate, toDate: input.toDate, days, reason: input.reason } });
}

export async function decideLeave(organizationId: string, id: string, status: LeaveStatus, decidedById?: string) {
  return prisma.leaveRequest.update({ where: { id, organizationId }, data: { status, decidedById, decidedAt: new Date() } });
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
    include: { items: true }
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
