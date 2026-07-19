const baseUrl = process.env.API_URL ?? "http://localhost:4000/api";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { "content-type": "application/json", ...(options.headers ?? {}) }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${options.method ?? "GET"} ${path} failed ${res.status}: ${JSON.stringify(body)}`);
  return body;
}

async function login(email: string, password: string, role: string) {
  return request("/auth/login", { method: "POST", body: JSON.stringify({ email, password, role }) });
}

async function main() {
  const stamp = Date.now();
  const superAdmin = await login(process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@nexhr.io", process.env.SEED_SUPER_ADMIN_PASSWORD ?? "SuperAdmin123!", "SUPER_ADMIN");
  const org = await request("/platform/organizations", {
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
  const orgAdmin = await login(org.admin.email, "WorkflowAdmin123!", "ORG_ADMIN");
  const employee = await request("/org/employees", {
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
  const employeeLogin = await login(employee.credentials.email, "WorkflowEmployee123!", "EMPLOYEE");
  const portal = await request("/org/employee-portal", { headers: { authorization: `Bearer ${employeeLogin.token}` } });
  console.log(JSON.stringify({
    ok: true,
    organizationId: org.organization.id,
    orgAdminEmail: org.admin.email,
    employeeEmail: employee.credentials.email,
    employeePortalName: `${portal.firstName} ${portal.lastName}`
  }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
