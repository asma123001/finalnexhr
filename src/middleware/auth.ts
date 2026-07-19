import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/http.js";
import { verifyToken, JwtUser, UserRole } from "../utils/auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
      tenantId?: string | null;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new AppError(401, "Missing bearer token");
  req.user = verifyToken(header.slice(7));
  req.tenantId = req.user.organizationId;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) throw new AppError(403, "Insufficient role");
    next();
  };
}

export function requireTenant(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== "SUPER_ADMIN" && !req.tenantId) throw new AppError(403, "Tenant context required");
  next();
}
