import { audit } from "../middleware/audit.js";
import * as platform from "../services/platform.service.js";
import { asyncHandler } from "../utils/http.js";

export const dashboard = asyncHandler(async (_req, res) => res.json(await platform.dashboard()));

export const createOrganization = asyncHandler(async (req, res) => {
  const result = await platform.createOrganization(req.body);
  await audit(req, "CREATE_ORGANIZATION", "Organization", result.organization.id, { adminEmail: result.admin.email });
  res.status(201).json(result);
});

export const updateOrganizationStatus = asyncHandler(async (req, res) => {
  const organization = await platform.updateOrganizationStatus(req.params.id, req.body.status);
  await audit(req, "UPDATE_ORGANIZATION_STATUS", "Organization", organization.id, { status: organization.status });
  res.json(organization);
});

export const createOrganizationAdmin = asyncHandler(async (req, res) => {
  const admin = await platform.createOrganizationAdmin(req.body);
  await audit(req, "CREATE_ORGANIZATION_ADMIN", "User", admin.id, { organizationId: admin.organizationId, email: admin.email });
  res.status(201).json(admin);
});

export const updateOrganizationAdmin = asyncHandler(async (req, res) => {
  const admin = await platform.updateOrganizationAdmin(req.params.id, req.body);
  await audit(req, "UPDATE_ORGANIZATION_ADMIN", "User", admin.id, { organizationId: admin.organizationId, email: admin.email });
  res.json(admin);
});

export const resetOrganizationAdminPassword = asyncHandler(async (req, res) => {
  const admin = await platform.resetOrganizationAdminPassword(req.params.id, req.body.password);
  await audit(req, "RESET_ORGANIZATION_ADMIN_PASSWORD", "User", admin.id, { organizationId: admin.organizationId });
  res.json(admin);
});

export const updateOrganizationAdminStatus = asyncHandler(async (req, res) => {
  const admin = await platform.updateOrganizationAdminStatus(req.params.id, req.body.status);
  await audit(req, "UPDATE_ORGANIZATION_ADMIN_STATUS", "User", admin.id, { organizationId: admin.organizationId, status: admin.status });
  res.json(admin);
});

export const removeOrganizationAdmin = asyncHandler(async (req, res) => {
  const admin = await platform.removeOrganizationAdmin(req.params.id);
  await audit(req, "REMOVE_ORGANIZATION_ADMIN", "User", admin.id, { organizationId: admin.organizationId });
  res.status(204).send();
});

export const createPackage = asyncHandler(async (req, res) => {
  const pkg = await platform.createPackage(req.body);
  await audit(req, "CREATE_PACKAGE", "Package", pkg.id);
  res.status(201).json(pkg);
});

export const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await platform.updatePackage(req.params.id, req.body);
  await audit(req, "UPDATE_PACKAGE", "Package", pkg.id);
  res.json(pkg);
});

export const deletePackage = asyncHandler(async (req, res) => {
  await platform.deletePackage(req.params.id);
  await audit(req, "DELETE_PACKAGE", "Package", req.params.id);
  res.status(204).send();
});

export const createBiometricDevice = asyncHandler(async (req, res) => {
  const device = await platform.createBiometricDevice(req.body);
  await audit(req, "CREATE_BIOMETRIC_DEVICE", "BiometricDevice", device.id, { organizationId: device.organizationId, serial: device.serial });
  res.status(201).json(device);
});

export const updateBiometricDevice = asyncHandler(async (req, res) => {
  const device = await platform.updateBiometricDevice(req.params.id, req.body);
  await audit(req, "UPDATE_BIOMETRIC_DEVICE", "BiometricDevice", device.id, { enabled: device.enabled, status: device.status });
  res.json(device);
});

export const auditLogs = asyncHandler(async (_req, res) => res.json(await platform.listAuditLogs()));
