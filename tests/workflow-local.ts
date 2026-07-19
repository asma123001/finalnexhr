import { app } from "../src/app.js";

async function request(baseUrl: string, path: string, options: RequestInit = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { "content-type": "application/json", ...(options.headers ?? {}) }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${options.method ?? "GET"} ${path} failed ${res.status}: ${JSON.stringify(body)}`);
  return body;
}

async function main() {
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Server did not bind to a TCP port");
  const baseUrl = `http://127.0.0.1:${address.port}/api`;

  try {
    const stamp = Date.now();
    const superAdmin = await request(baseUrl, "/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@nexhr.io",
        password: process.env.SEED_SUPER_ADMIN_PASSWORD ?? "SuperAdmin123!",
        role: "SUPER_ADMIN"
      })
    });
    const org = await request(baseUrl, "/platform/organizations", {
      method: "POST",
      headers: { authorization: `Bearer ${superAdmin.token}` },
      body: JSON.stringify({
        name: `Workflow Org ${stamp}`,
        adminEmail: `workflow.admin.${stamp}@nexhr.test`,
        adminName: "Workflow Admin",
        adminPassword: "WorkflowAdmin123!",
        packageName: "Starter"
      })
    });
    const orgAdmin = await request(baseUrl, "/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: org.admin.email, password: "WorkflowAdmin123!", role: "ORG_ADMIN" })
    });
    const employee = await request(baseUrl, "/org/employees", {
      method: "POST",
      headers: { authorization: `Bearer ${orgAdmin.token}` },
      body: JSON.stringify({
        firstName: "Workflow",
        lastName: "Employee",
        email: `workflow.employee.${stamp}@nexhr.test`,
        password: "WorkflowEmployee123!",
        title: "HR Analyst",
        departmentName: "People Ops"
      })
    });
    const employeeLogin = await request(baseUrl, "/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: employee.credentials.email, password: "WorkflowEmployee123!", role: "EMPLOYEE" })
    });
    const portal = await request(baseUrl, "/org/employee-portal", {
      headers: { authorization: `Bearer ${employeeLogin.token}` }
    });
    console.log(JSON.stringify({
      ok: true,
      organizationId: org.organization.id,
      orgAdminEmail: org.admin.email,
      employeeEmail: employee.credentials.email,
      employeePortalName: `${portal.firstName} ${portal.lastName}`
    }, null, 2));
  } finally {
    await new Promise<void>((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
