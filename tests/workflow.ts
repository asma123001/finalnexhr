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
  const device = await request("/platform/biometric-devices", {
    method: "POST",
    headers: { authorization: `Bearer ${superAdmin.token}` },
    body: JSON.stringify({
      organizationId: org.organization.id,
      name: `Workflow Device ${stamp}`,
      type: "Fingerprint",
      model: "Test Terminal",
      serial: `WF-${stamp}`,
      ip: "192.168.10.10",
      port: 4370,
      location: "Main Office"
    })
  });
  const orgAdmin = await login(org.admin.email, "WorkflowAdmin123!", "ORG_ADMIN");
  const department = await request("/org/departments", {
    method: "POST",
    headers: { authorization: `Bearer ${orgAdmin.token}` },
    body: JSON.stringify({
      name: `Workflow Department ${stamp}`,
      code: "WFDEPT",
      description: "Created by workflow test"
    })
  });
  let dashboard = await request("/org/dashboard", {
    headers: { authorization: `Bearer ${orgAdmin.token}` }
  });
  if (!dashboard.departments.some((dept: { id: string }) => dept.id === department.id)) {
    throw new Error("Created department was not returned by dashboard");
  }
  const shift = await request("/org/shifts", {
    method: "POST",
    headers: { authorization: `Bearer ${orgAdmin.token}` },
    body: JSON.stringify({
      name: `Workflow Shift ${stamp}`,
      startTime: "09:00",
      endTime: "18:00",
      workingDays: "Mon-Fri",
      breakMinutes: 60,
      graceMinutes: 15
    })
  });
  dashboard = await request("/org/dashboard", {
    headers: { authorization: `Bearer ${orgAdmin.token}` }
  });
  if (!dashboard.shifts.some((savedShift: { id: string }) => savedShift.id === shift.id)) {
    throw new Error("Created shift was not returned by dashboard");
  }
  const renamedDepartment = await request(`/org/departments/${department.id}`, {
    method: "PATCH",
    headers: { authorization: `Bearer ${orgAdmin.token}` },
    body: JSON.stringify({ name: `Workflow Department Updated ${stamp}`, isActive: false })
  });
  dashboard = await request("/org/dashboard", {
    headers: { authorization: `Bearer ${orgAdmin.token}` }
  });
  const savedRenamedDepartment = dashboard.departments.find((dept: { id: string }) => dept.id === renamedDepartment.id);
  if (!savedRenamedDepartment || savedRenamedDepartment.name !== renamedDepartment.name || savedRenamedDepartment.isActive !== false) {
    throw new Error("Updated department was not returned by dashboard");
  }
  await request(`/org/departments/${department.id}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${orgAdmin.token}` }
  });
  dashboard = await request("/org/dashboard", {
    headers: { authorization: `Bearer ${orgAdmin.token}` }
  });
  if (dashboard.departments.some((dept: { id: string }) => dept.id === department.id)) {
    throw new Error("Deleted department was still returned by dashboard");
  }
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
  const biometricSync = await request("/org/biometric/sync", {
    method: "POST",
    headers: { authorization: `Bearer ${orgAdmin.token}` },
    body: JSON.stringify({})
  });
  const portal = await request("/org/employee-portal", { headers: { authorization: `Bearer ${employeeLogin.token}` } });
  console.log(JSON.stringify({
    ok: true,
    organizationId: org.organization.id,
    biometricDeviceId: device.id,
    biometricSyncRecords: biometricSync.records,
    orgAdminEmail: org.admin.email,
    employeeEmail: employee.credentials.email,
    employeePortalName: `${portal.firstName} ${portal.lastName}`
  }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
