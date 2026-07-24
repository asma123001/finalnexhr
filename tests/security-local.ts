import assert from "node:assert/strict";
import { app } from "../src/app.js";
import { prisma } from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/auth.js";

async function request(baseUrl: string, path: string, options: RequestInit = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { "content-type": "application/json", ...(options.headers ?? {}) }
  });
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

async function createTenant(stamp: number, suffix: string) {
  const pkg = await prisma.package.upsert({
    where: { name: `QA Security ${stamp}` },
    update: {},
    create: { name: `QA Security ${stamp}`, features: ["Core HR"], storageLimitGb: 5 }
  });
  const organization = await prisma.organization.create({
    data: {
      name: `QA Security Org ${suffix} ${stamp}`,
      slug: `qa-security-${suffix.toLowerCase()}-${stamp}`,
      status: "ACTIVE",
      packageId: pkg.id,
      settings: { create: { modules: ["Employees", "Departments", "Attendance", "Leave", "Payroll"] } },
      leaveTypes: { create: [{ name: "Annual Leave", annualAllowance: 12 }] }
    }
  });
  const admin = await prisma.user.create({
    data: {
      organizationId: organization.id,
      name: `QA Admin ${suffix}`,
      email: `qa.security.admin.${suffix.toLowerCase()}.${stamp}@nexhr.test`,
      passwordHash: await hashPassword("QaSecurity123!"),
      role: "ORG_ADMIN",
      permissions: ["*"]
    }
  });
  const department = await prisma.department.create({
    data: {
      organizationId: organization.id,
      name: `QA Department ${suffix}`,
      code: `QA${suffix}`
    }
  });
  const employee = await prisma.employee.create({
    data: {
      organizationId: organization.id,
      departmentId: department.id,
      employeeCode: `QA-${suffix}-${stamp}`,
      firstName: "QA",
      lastName: `Employee ${suffix}`,
      email: `qa.security.employee.${suffix.toLowerCase()}.${stamp}@nexhr.test`,
      title: "Analyst",
      portalProfile: { create: { preferences: {} } }
    }
  });
  const shift = await prisma.shift.create({
    data: {
      organizationId: organization.id,
      name: `QA Shift ${suffix}`,
      startTime: "09:00",
      endTime: "18:00",
      workingDays: "Mon-Fri"
    }
  });
  return { organization, admin, department, employee, shift };
}

async function main() {
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Server did not bind to a TCP port");
  const baseUrl = `http://127.0.0.1:${address.port}/api`;

  try {
    const stamp = Date.now();
    const orgA = await createTenant(stamp, "A");
    const orgB = await createTenant(stamp, "B");
    const login = await request(baseUrl, "/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: orgA.admin.email, password: "QaSecurity123!", role: "ORG_ADMIN" })
    });
    assert.equal(login.res.status, 200);
    const auth = { authorization: `Bearer ${login.body.token}` };

    const attendance = await request(baseUrl, "/org/attendance/manual", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ employeeId: orgB.employee.id, status: "PRESENT" })
    });
    assert.equal(attendance.res.status, 404, "manual attendance must reject another organization's employee");

    const leave = await request(baseUrl, "/org/leave", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ employeeId: orgB.employee.id, type: "Annual Leave", fromDate: "2026-08-01", toDate: "2026-08-02" })
    });
    assert.equal(leave.res.status, 404, "leave creation must reject another organization's employee");

    const loan = await request(baseUrl, "/org/loans", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ employeeId: orgB.employee.id, type: "Emergency", amount: 100 })
    });
    assert.equal(loan.res.status, 404, "loan creation must reject another organization's employee");

    const departmentLink = await request(baseUrl, `/org/employees/${orgA.employee.id}`, {
      method: "PATCH",
      headers: auth,
      body: JSON.stringify({ departmentId: orgB.department.id })
    });
    assert.equal(departmentLink.res.status, 404, "employee update must reject another organization's department");

    const shiftAssignment = await request(baseUrl, "/org/shift-assignments", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ shiftId: orgA.shift.id, targetType: "Employee", employeeId: orgB.employee.id })
    });
    assert.equal(shiftAssignment.res.status, 404, "shift assignment must reject another organization's employee");

    console.log(JSON.stringify({ ok: true, tested: 5 }, null, 2));
  } finally {
    await new Promise<void>((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
