import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/auth.js";

const prisma = new PrismaClient();

async function main() {
  const starter = await prisma.package.upsert({
    where: { name: "Starter" },
    update: {},
    create: { name: "Starter", priceCents: 2900, seatLimit: 50, storageLimitGb: 5, features: ["Core HR", "Attendance", "Basic reports"] }
  });
  await prisma.package.upsert({
    where: { name: "Growth" },
    update: {},
    create: { name: "Growth", priceCents: 7900, seatLimit: 500, storageLimitGb: 10, features: ["Core HR", "Attendance", "Payroll", "Reports"] }
  });
  await prisma.package.upsert({
    where: { name: "Enterprise" },
    update: {},
    create: { name: "Enterprise", priceCents: 0, seatLimit: null, storageLimitGb: 50, features: ["SSO", "Audit logs", "Dedicated support"] }
  });

  await prisma.user.upsert({
    where: { email: process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@nexhr.io" },
    update: {},
    create: {
      name: "Alex Kade",
      email: process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@nexhr.io",
      passwordHash: await hashPassword(process.env.SEED_SUPER_ADMIN_PASSWORD ?? "SuperAdmin123!"),
      role: "SUPER_ADMIN",
      permissions: ["*"]
    }
  });

  const org = await prisma.organization.upsert({
    where: { slug: "ironwood-manufacturing" },
    update: {},
    create: {
      name: "Ironwood Manufacturing",
      slug: "ironwood-manufacturing",
      industry: "Manufacturing",
      email: process.env.SEED_ORG_ADMIN_EMAIL ?? "admin@ironwoodmfg.com",
      status: "ACTIVE",
      packageId: starter.id,
      settings: { create: { timezone: "America/New_York", currency: "USD", modules: ["Employees", "Departments", "Attendance", "Leave", "Payroll", "Reports", "Employee Portal"] } },
      leaveTypes: { create: [{ name: "Annual Leave", annualAllowance: 12 }, { name: "Sick Leave", annualAllowance: 6 }, { name: "Casual Leave", annualAllowance: 4 }] }
    }
  });

  const engineering = await prisma.department.upsert({
    where: { organizationId_code: { organizationId: org.id, code: "ENG" } },
    update: {},
    create: { organizationId: org.id, name: "Engineering", code: "ENG", description: "Product engineering and platform infrastructure" }
  });

  await prisma.role.upsert({
    where: { organizationId_name: { organizationId: org.id, name: "Organization Admin" } },
    update: {},
    create: { organizationId: org.id, name: "Organization Admin", description: "Full organization access", permissions: ["*"] }
  });
  await prisma.role.upsert({
    where: { organizationId_name: { organizationId: org.id, name: "Employee" } },
    update: {},
    create: { organizationId: org.id, name: "Employee", description: "Self-service portal", permissions: ["Employee Portal"] }
  });

  await prisma.user.upsert({
    where: { email: process.env.SEED_ORG_ADMIN_EMAIL ?? "admin@ironwoodmfg.com" },
    update: {},
    create: {
      organizationId: org.id,
      name: "Admin User",
      email: process.env.SEED_ORG_ADMIN_EMAIL ?? "admin@ironwoodmfg.com",
      passwordHash: await hashPassword(process.env.SEED_ORG_ADMIN_PASSWORD ?? "OrgAdmin123!"),
      role: "ORG_ADMIN",
      permissions: ["*"]
    }
  });

  const employee = await prisma.employee.upsert({
    where: { organizationId_email: { organizationId: org.id, email: process.env.SEED_EMPLOYEE_EMAIL ?? "nadia.farouk@nexhr.io" } },
    update: {},
    create: {
      organizationId: org.id,
      departmentId: engineering.id,
      employeeCode: "EMP-0001",
      firstName: "Nadia",
      lastName: "Farouk",
      email: process.env.SEED_EMPLOYEE_EMAIL ?? "nadia.farouk@nexhr.io",
      title: "Product Designer",
      portalProfile: { create: { preferences: {} } }
    }
  });

  await prisma.user.upsert({
    where: { email: employee.email },
    update: {},
    create: {
      organizationId: org.id,
      employeeId: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      passwordHash: await hashPassword(process.env.SEED_EMPLOYEE_PASSWORD ?? "Employee123!"),
      role: "EMPLOYEE",
      permissions: ["Employee Portal"]
    }
  });

  await prisma.shift.createMany({
    data: [
      { organizationId: org.id, name: "Morning Shift", startTime: "08:00", endTime: "17:00", workingDays: "Mon-Fri" },
      { organizationId: org.id, name: "Evening Shift", startTime: "14:00", endTime: "23:00", workingDays: "Mon-Fri" }
    ],
    skipDuplicates: true
  });

  console.log("Seed complete");
}

main().finally(async () => prisma.$disconnect());
