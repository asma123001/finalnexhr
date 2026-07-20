import { Router } from "express";
import { authenticate, requireRole, requireTenant } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { attendanceSchema, departmentSchema, employeeSchema, leaveSchema } from "../schemas.js";
import * as controller from "../controllers/org.controller.js";

export const orgRoutes = Router();
orgRoutes.use(authenticate, requireTenant);
orgRoutes.get("/dashboard", requireRole("ORG_ADMIN"), controller.dashboard);
orgRoutes.post("/departments", requireRole("ORG_ADMIN"), validate(departmentSchema), controller.createDepartment);
orgRoutes.post("/employees", requireRole("ORG_ADMIN"), validate(employeeSchema), controller.createEmployee);
orgRoutes.post("/biometric/sync", requireRole("ORG_ADMIN"), controller.syncBiometricAttendance);
orgRoutes.post("/attendance/manual", requireRole("ORG_ADMIN"), validate(attendanceSchema), controller.manualAttendance);
orgRoutes.post("/leave", validate(leaveSchema), controller.applyLeave);
orgRoutes.patch("/leave/:id/decision", requireRole("ORG_ADMIN"), controller.decideLeave);
orgRoutes.post("/payroll/run", requireRole("ORG_ADMIN"), controller.runPayroll);
orgRoutes.get("/employee-portal", requireRole("EMPLOYEE"), controller.employeePortal);
