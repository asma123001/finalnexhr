import { Request } from "express";
import { prisma } from "../config/prisma.js";

export async function audit(req: Request, action: string, entity: string, entityId?: string, metadata: unknown = {}) {
  await prisma.auditLog.create({
    data: {
      organizationId: req.user?.role === "SUPER_ADMIN" ? (req.body.organizationId ?? req.params.organizationId ?? null) : req.tenantId,
      actorId: req.user?.sub,
      action,
      entity,
      entityId,
      metadata: metadata as object,
      ip: req.ip
    }
  });
}
