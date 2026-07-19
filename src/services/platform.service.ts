import { prisma } from "../config/prisma.js";
import { hashPassword } from "../utils/auth.js";
import { AppError } from "../utils/http.js";

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `org-${Date.now()}`;

export async function dashboard() {
  const [organizations, users, packages, auditLogs] = await Promise.all([
    prisma.organization.findMany({ include: { package: true }, orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true, organization: { select: { name: true } }, lastLoginAt: true }, orderBy: { createdAt: "desc" } }),
    prisma.package.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.auditLog.findMany({ take: 20, orderBy: { createdAt: "desc" }, include: { actor: { select: { name: true, role: true } }, organization: { select: { name: true } } } })
  ]);
  return { organizations, users, packages, auditLogs };
}

export async function createPackage(input: { name: string; priceCents: number; seatLimit?: number; storageLimitGb: number; features: string[] }) {
  return prisma.package.create({ data: input });
}

export async function createOrganization(input: { name: string; adminEmail: string; companyEmail?: string; adminName?: string; adminPassword?: string; packageName: string; industry?: string }) {
  const adminEmail = input.adminEmail.toLowerCase();
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail }, select: { id: true } });
  if (existingAdmin) {
    throw new AppError(409, "Admin user ID is already used. Use a different admin email.");
  }

  const pkg = await prisma.package.upsert({
    where: { name: input.packageName },
    update: {},
    create: { name: input.packageName, features: ["Core HR", "Attendance"], storageLimitGb: 5 }
  });
  const baseSlug = slugify(input.name);
  const slug = await uniqueSlug(baseSlug);
  const passwordHash = await hashPassword(input.adminPassword ?? "OrgAdmin123!");

  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: input.name,
        slug,
        industry: input.industry ?? "General",
        email: (input.companyEmail || input.adminEmail).toLowerCase(),
        status: "ACTIVE",
        packageId: pkg.id,
        settings: { create: { modules: ["Employees", "Departments", "Attendance", "Leave", "Payroll", "Reports", "Employee Portal", "Organization Settings"] } },
        leaveTypes: { create: [{ name: "Annual Leave", annualAllowance: 12 }, { name: "Sick Leave", annualAllowance: 6 }, { name: "Casual Leave", annualAllowance: 4 }] }
      }
    });
    const admin = await tx.user.create({
      data: {
        organizationId: organization.id,
        name: input.adminName ?? "Organization Admin",
        email: adminEmail,
        passwordHash,
        role: "ORG_ADMIN",
        permissions: ["*"]
      }
    });
    return { organization, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } };
  });
}

export async function updateOrganizationStatus(id: string, status: "ACTIVE" | "SUSPENDED" | "PENDING") {
  return prisma.organization.update({ where: { id }, data: { status } });
}

async function uniqueSlug(base: string) {
  let slug = base;
  let i = 2;
  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

export async function listAuditLogs(where: object = {}) {
  return prisma.auditLog.findMany({ where, include: { actor: true, organization: true }, orderBy: { createdAt: "desc" }, take: 100 });
}
