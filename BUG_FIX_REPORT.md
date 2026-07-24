# NexHR Bug Fix Report

Date: 2026-07-24

## Issues Found And Fixed

1. Cross-organization employee IDs could be submitted to manual attendance, leave, loan, and shift assignment APIs.
   - Root cause: service methods trusted request-provided `employeeId` without verifying `organizationId`.
   - Fix: added tenant ownership checks before writes.

2. Cross-organization department IDs could be assigned to employees or department hierarchy fields.
   - Root cause: `departmentId`, `parentId`, and `headId` were not consistently checked against the authenticated tenant.
   - Fix: added department and employee ownership guards.

3. Org Admin leave creation could not receive `employeeId` after validation.
   - Root cause: `leaveSchema` did not include `employeeId`, and Zod stripped it before the controller.
   - Fix: added optional `employeeId` to the leave schema.

4. Invalid leave date ranges were accepted at the service layer.
   - Root cause: no `toDate >= fromDate` check.
   - Fix: reject leave requests where the end date is before the start date.

5. Shift assignment updates could target an assignment ID outside the tenant.
   - Root cause: update path checked the new shift, but not the existing assignment's tenant.
   - Fix: verify the assignment belongs to a shift in the authenticated organization before update.

## Files Changed In This Pass

- `src/services/org.service.ts`
- `src/schemas.ts`
- `tests/security-local.ts`
- `package.json`
- `package-lock.json`
- `TESTING_REPORT.md`
- `BUG_FIX_REPORT.md`
- `PERFORMANCE_REPORT.md`
- `MANUAL_TEST_CHECKLIST.md`

The working tree already contained uncommitted changes in frontend files, Prisma schema, and a migration before this pass. Those were not reverted.

## Database Changes

No new migration was created in this pass. Existing uncommitted migration `prisma/migrations/20260722182000_action_dedupe/` was present before this pass and was not applied because migration status failed with a Prisma schema engine error.

## Automated Tests Added

- `tests/security-local.ts`: creates isolated QA tenants and verifies five cross-tenant write attempts are rejected through real HTTP routes.
- `package.json`: added `test:security` and `test:workflow:local` scripts.

## Remaining Risks

- Full role matrix beyond Super Admin, Org Admin, and Employee is not represented in the schema.
- Configured DB seed state prevented the existing workflow test from passing.
- Remote migration status needs investigation before applying migrations.
- Static frontend pages need browser automation coverage for buttons, modals, filters, uploads, and responsive behavior.
