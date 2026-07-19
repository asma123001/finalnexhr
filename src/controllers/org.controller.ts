import { Request } from "express";
import { audit } from "../middleware/audit.js";
import * as org from "../services/org.service.js";
import { asyncHandler, AppError } from "../utils/http.js";

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

function tenant(req: Request) {
  if (!req.tenantId) throw new AppError(403, "Tenant context required");
  return req.tenantId;
}

export const dashboard = asyncHandler(async (req, res) => res.json(await org.tenantDashboard(tenant(req))));

export const createDepartment = asyncHandler(async (req, res) => {
  const department = await org.createDepartment(tenant(req), req.body);
  await audit(req, "CREATE_DEPARTMENT", "Department", department.id);
  res.status(201).json(department);
});

export const createEmployee = asyncHandler(async (req, res) => {
  const employee = await org.createEmployee(tenant(req), req.body);
  await audit(req, "CREATE_EMPLOYEE", "Employee", employee.employee.id, { email: employee.employee.email });
  res.status(201).json(employee);
});

export const manualAttendance = asyncHandler(async (req, res) => {
  const attendance = await org.createManualAttendance(tenant(req), req.user?.sub, req.body);
  await audit(req, "CREATE_MANUAL_ATTENDANCE", "Attendance", attendance.id);
  res.status(201).json(attendance);
});

export const applyLeave = asyncHandler(async (req, res) => {
  const employeeId = req.user?.employeeId ?? req.body.employeeId;
  if (!employeeId) throw new AppError(422, "employeeId is required");
  const leave = await org.createLeaveRequest(tenant(req), employeeId, req.body);
  await audit(req, "CREATE_LEAVE_REQUEST", "LeaveRequest", leave.id);
  res.status(201).json(leave);
});

export const decideLeave = asyncHandler(async (req, res) => {
  const leave = await org.decideLeave(tenant(req), req.params.id, req.body.status as LeaveStatus, req.user?.sub);
  await audit(req, "DECIDE_LEAVE_REQUEST", "LeaveRequest", leave.id, { status: leave.status });
  res.json(leave);
});

export const runPayroll = asyncHandler(async (req, res) => {
  const payroll = await org.runPayroll(tenant(req), req.body.period ?? new Date().toISOString().slice(0, 7));
  await audit(req, "RUN_PAYROLL", "PayrollRun", payroll.id);
  res.status(201).json(payroll);
});

export const employeePortal = asyncHandler(async (req, res) => {
  if (!req.user?.employeeId) throw new AppError(403, "Employee account required");
  res.json(await org.employeePortal(req.user.employeeId));
});
