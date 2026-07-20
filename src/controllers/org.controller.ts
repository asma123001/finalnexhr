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

export const syncBiometricAttendance = asyncHandler(async (req, res) => {
  const result = await org.syncBiometricAttendance(tenant(req), req.user?.sub);
  await audit(req, "SYNC_BIOMETRIC_ATTENDANCE", "BiometricDevice", undefined, { records: result.records, devices: result.devices.length });
  res.status(201).json(result);
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

export const saveAttendancePolicy = asyncHandler(async (req, res) => {
  const policy = await org.upsertAttendancePolicy(tenant(req), req.body);
  await audit(req, "SAVE_ATTENDANCE_POLICY", "AttendancePolicy", policy.id);
  res.status(req.body.id ? 200 : 201).json(policy);
});

export const deleteAttendancePolicy = asyncHandler(async (req, res) => {
  await org.deleteAttendancePolicy(tenant(req), req.params.id);
  await audit(req, "DELETE_ATTENDANCE_POLICY", "AttendancePolicy", req.params.id);
  res.status(204).send();
});

export const createShift = asyncHandler(async (req, res) => {
  const shift = await org.createShift(tenant(req), req.body);
  await audit(req, "CREATE_SHIFT", "Shift", shift.id);
  res.status(201).json(shift);
});

export const saveShiftAssignment = asyncHandler(async (req, res) => {
  const assignment = await org.upsertShiftAssignment(tenant(req), req.body);
  await audit(req, "SAVE_SHIFT_ASSIGNMENT", "ShiftAssignment", assignment.id);
  res.status(req.body.id ? 200 : 201).json(assignment);
});

export const deleteShiftAssignment = asyncHandler(async (req, res) => {
  await org.deleteShiftAssignment(tenant(req), req.params.id);
  await audit(req, "DELETE_SHIFT_ASSIGNMENT", "ShiftAssignment", req.params.id);
  res.status(204).send();
});

export const saveSettings = asyncHandler(async (req, res) => {
  const result = await org.upsertOrganizationSettings(tenant(req), req.body);
  await audit(req, "SAVE_ORGANIZATION_SETTINGS", "Organization", result.organization.id);
  res.json(result);
});

export const createHoliday = asyncHandler(async (req, res) => {
  const holiday = await org.createHoliday(tenant(req), req.body);
  await audit(req, "CREATE_HOLIDAY", "Holiday", holiday.id);
  res.status(201).json(holiday);
});

export const deleteHoliday = asyncHandler(async (req, res) => {
  await org.deleteHoliday(tenant(req), req.params.id);
  await audit(req, "DELETE_HOLIDAY", "Holiday", req.params.id);
  res.status(204).send();
});

export const saveRole = asyncHandler(async (req, res) => {
  const role = await org.upsertRole(tenant(req), req.body);
  await audit(req, "SAVE_ROLE", "Role", role.id);
  res.status(req.body.id ? 200 : 201).json(role);
});

export const deleteRole = asyncHandler(async (req, res) => {
  await org.deleteRole(tenant(req), req.params.id);
  await audit(req, "DELETE_ROLE", "Role", req.params.id);
  res.status(204).send();
});

export const createLoan = asyncHandler(async (req, res) => {
  const loan = await org.createLoanRequest(tenant(req), req.body);
  await audit(req, "CREATE_LOAN_REQUEST", "LoanRequest", loan.id);
  res.status(201).json(loan);
});

export const updateLoan = asyncHandler(async (req, res) => {
  const loan = await org.updateLoanRequest(tenant(req), req.params.id, req.body);
  await audit(req, "UPDATE_LOAN_REQUEST", "LoanRequest", loan.id);
  res.json(loan);
});

export const updateExit = asyncHandler(async (req, res) => {
  const exit = await org.updateExitRequest(tenant(req), req.params.id, req.body);
  await audit(req, "UPDATE_EXIT_REQUEST", "ExitRequest", exit.id);
  res.json(exit);
});

export const generateLetter = asyncHandler(async (req, res) => {
  const letter = await org.generateHrLetter(tenant(req), req.user?.sub, req.body);
  await audit(req, "GENERATE_HR_LETTER", "HrLetter", letter.id);
  res.status(201).json(letter);
});

export const employeePortal = asyncHandler(async (req, res) => {
  if (!req.user?.employeeId) throw new AppError(403, "Employee account required");
  res.json(await org.employeePortal(req.user.employeeId));
});
