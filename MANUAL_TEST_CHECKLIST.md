# NexHR Manual Test Checklist

Use isolated QA organizations and users. Do not delete or overwrite production data.

## Setup

- [ ] Confirm `.env` contains non-production QA database values.
- [ ] Run `npm.cmd install`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `npx.cmd prisma validate`.
- [ ] Investigate and pass `npx.cmd prisma migrate status`.
- [ ] Seed or create isolated Super Admin, Org Admin, and Employee accounts.
- [ ] Start backend with `node dist/src/server.js` or `npm.cmd run dev`.

## Authentication And Roles

- [ ] Super Admin login succeeds.
- [ ] Org Admin login succeeds.
- [ ] Employee login succeeds.
- [ ] Invalid password fails with safe error.
- [ ] Wrong role selection fails.
- [ ] Suspended user fails.
- [ ] Suspended organization fails.
- [ ] Logout clears session and protected pages reject refresh.

## Super Admin

- [ ] Dashboard loads without console errors.
- [ ] Create, edit, disable, and delete unassigned packages.
- [ ] Create organization.
- [ ] Create organization administrator.
- [ ] Suspend/reactivate organization.
- [ ] Suspend/reactivate organization administrator.
- [ ] Reset organization administrator password.
- [ ] Create and update biometric devices.
- [ ] Audit logs show relevant actions.

## Organization Admin

- [ ] Dashboard loads only this organization's data.
- [ ] Create, edit, deactivate, and delete departments.
- [ ] Create employee with department and login credentials.
- [ ] Update employee profile, payroll details, and status.
- [ ] Upload employee photo; refresh and confirm it remains correct.
- [ ] Upload organization logo; logout/login and confirm it remains correct.
- [ ] Create attendance policy.
- [ ] Create shift and assign employee.
- [ ] Record manual attendance.
- [ ] Sync biometric attendance with valid and missing devices.
- [ ] Create leave request for employee and approve/reject it.
- [ ] Run payroll and verify totals.
- [ ] Create holidays.
- [ ] Create roles and delete unused roles.
- [ ] Create loan and approve/reject/update payment.
- [ ] Generate HR letter.
- [ ] Update exit stage and clearance.

## Employee Portal

- [ ] Employee dashboard loads only that employee's data.
- [ ] Leave request submits once and shows success only after API success.
- [ ] Refresh keeps the authenticated employee session.

## UI Responsiveness

- [ ] Every submit button disables immediately on click.
- [ ] Saving/loading text or spinner appears within 100ms.
- [ ] Double-clicking submit does not create duplicates.
- [ ] Modals reset selected records after close.
- [ ] Tables update after CRUD without full browser refresh.
- [ ] Search/filter inputs do not trigger excessive requests.
- [ ] Browser back/forward keeps expected page state.
- [ ] Desktop and mobile sizes show no overlapping controls.

## Security

- [ ] Org A cannot access Org B employee, department, shift, loan, leave, attendance, logo, or photo records by direct API ID.
- [ ] Frontend never sends trusted organization IDs for tenant-scoped Org Admin writes.
- [ ] Uploads reject unsupported file types.
- [ ] API errors do not expose secrets, SQL, stack traces, or connection strings.
