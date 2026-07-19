import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/http.js";
import { UserRole } from "../utils/auth.js";
import { signToken, verifyPassword } from "../utils/auth.js";

export async function login(email: string, password: string, role?: UserRole) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, include: { organization: true } });
  if (!user || user.status !== "ACTIVE") throw new AppError(401, "Invalid credentials");
  if (role && user.role !== role) throw new AppError(403, "Account is not assigned to that role");
  if (user.organization?.status === "SUSPENDED") throw new AppError(403, "Organization is suspended");
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new AppError(401, "Invalid credentials");
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const token = signToken({
    sub: user.id,
    role: user.role,
    organizationId: user.organizationId,
    employeeId: user.employeeId,
    permissions: user.permissions
  });
  return { token, user: sanitizeUser(user) };
}

export function sanitizeUser(user: { passwordHash?: string; [key: string]: unknown }) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}
