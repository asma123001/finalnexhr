import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createBiometricDeviceSchema, createOrgSchema, createPackageSchema } from "../schemas.js";
import * as controller from "../controllers/platform.controller.js";

export const platformRoutes = Router();
platformRoutes.use(authenticate, requireRole("SUPER_ADMIN"));
platformRoutes.get("/dashboard", controller.dashboard);
platformRoutes.get("/audit-logs", controller.auditLogs);
platformRoutes.post("/organizations", validate(createOrgSchema), controller.createOrganization);
platformRoutes.patch("/organizations/:id/status", controller.updateOrganizationStatus);
platformRoutes.post("/packages", validate(createPackageSchema), controller.createPackage);
platformRoutes.post("/biometric-devices", validate(createBiometricDeviceSchema), controller.createBiometricDevice);
platformRoutes.patch("/biometric-devices/:id", controller.updateBiometricDevice);
