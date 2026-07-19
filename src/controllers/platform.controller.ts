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

export const createPackage = asyncHandler(async (req, res) => {
  const pkg = await platform.createPackage(req.body);
  await audit(req, "CREATE_PACKAGE", "Package", pkg.id);
  res.status(201).json(pkg);
});

export const auditLogs = asyncHandler(async (_req, res) => res.json(await platform.listAuditLogs()));
