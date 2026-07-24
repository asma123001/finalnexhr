# NexHR Testing Report

Date: 2026-07-24

## Architecture Summary

- Backend: Express 4 API in `src/`, TypeScript ESM, JWT authentication, Zod request validation, Prisma ORM.
- Database: PostgreSQL via Prisma schema in `prisma/schema.prisma`; runtime uses `@prisma/adapter-pg` in development and Prisma datasource URL in production.
- Frontend: static HTML/CSS/JS pages served from `public/` and root HTML files; shared browser API helper in `api-client.js` and `public/api-client.js`.
- Main API areas: `/api/auth`, `/api/platform`, `/api/org`, `/api/health`.
- Background worker/scheduler: no dedicated worker or scheduler entrypoint was found in this repository.
- Storage: employee photos and organization logos are stored as image data URLs in PostgreSQL text columns.

## Modules Reviewed

Reviewed from schema, routes, services, and current frontend calls: authentication, platform dashboard, packages, organizations, organization administrators, audit logs, departments, employees, employee photos, organization logo/settings, roles, attendance, biometric devices/sync logs, leave, payroll runs/items, shifts, shift assignments, holidays, loans, exits, HR letters, reports, and employee portal.

Not present as implemented standalone modules: recruitment, performance, training, assets, grievances, disciplinary actions, expenses, API keys/integrations, scheduler, worker.

## Automated Tests Run

- `npm.cmd install`: passed, 0 npm vulnerabilities reported.
- `npm.cmd run build`: passed; Prisma client generated and TypeScript compiled.
- `npx.cmd prisma validate`: passed.
- `npm.cmd run test:security`: passed, 5/5 assertions.
- Backend startup and health check: passed, `/api/health` returned `{"ok":true,"service":"NexHR API"}`.

## Failed Or Blocked Checks

- `npx.cmd prisma migrate status`: failed with `Schema engine error` against the configured remote PostgreSQL database. No migrations were applied.
- `npm.cmd run test:workflow`: failed because the script targets `http://localhost:4000/api` and no external server was running.
- `npx.cmd tsx tests/workflow-local.ts`: reached the API but failed login with `401 Invalid credentials`; the configured DB was not seeded with the expected super-admin credentials.
- Full Playwright/browser E2E and manual click-through matrix were not run; no Playwright dependency or E2E framework exists in this repo.
- Lint command, frontend typecheck, worker startup, scheduler dry run, readiness endpoint: no scripts or entrypoints exist.

## Timings Observed

- `POST /api/auth/login` in security test: about 1.17s.
- Cross-tenant rejection routes in security test: about 0.20s to 0.39s each.
- Health endpoint after built backend startup: responded successfully after a 3 second startup wait.

## Commands

```powershell
npm.cmd install
npm.cmd run build
npx.cmd prisma validate
npx.cmd prisma migrate status
npm.cmd run test:security
npx.cmd tsx tests\workflow-local.ts
node dist/src/server.js
```

## Environment Variables

Required names: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `CORS_ORIGIN`.

Optional seed names: `SEED_SUPER_ADMIN_EMAIL`, `SEED_SUPER_ADMIN_PASSWORD`, `SEED_ORG_ADMIN_EMAIL`, `SEED_ORG_ADMIN_PASSWORD`, `SEED_EMPLOYEE_EMAIL`, `SEED_EMPLOYEE_PASSWORD`.
