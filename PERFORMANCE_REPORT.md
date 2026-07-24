# NexHR Performance Report

Date: 2026-07-24

## Improvements Present In Current Working Tree

The current working tree already includes frontend/API performance changes that were present before this pass:

- Shared API client deduplicates identical in-flight mutations.
- Mutation requests receive an `x-idempotency-key` header.
- API errors are converted to useful user-facing messages.
- Dashboard-heavy duplicate records are constrained by the existing uncommitted dedupe migration and service upserts in several modules.

## Improvements Made In This Pass

- Added fast ownership rejection before creating expensive or unsafe cross-tenant records.
- Reused existing departments by organization/name when resolving `departmentName`, avoiding accidental duplicate/colliding department creation.
- Added security regression coverage so tenant-isolation performance and correctness can be checked repeatedly.

## Observed Route Timings

Measured during `npm.cmd run test:security`:

- Login: about 1.17s.
- Manual attendance cross-tenant rejection: about 0.20s.
- Leave cross-tenant rejection: about 0.21s.
- Loan cross-tenant rejection: about 0.21s.
- Employee department cross-tenant rejection: about 0.23s.
- Shift assignment cross-tenant rejection: about 0.39s.

No before/after timings are available for the same exact code paths because the security test was added after the fix. The important behavioral improvement is that unsafe requests now fail before records are created.

## Performance Risks Still Present

- `/api/org/dashboard` fetches many modules at once and can become slow for large tenants.
- Payroll generation loads all active employees and recreates all payroll items for a period.
- Image uploads store base64 data URLs in database text columns; this can increase row size and response payloads.
- No server-side pagination endpoints exist for large employee, leave, attendance, payroll, or audit datasets.
- No query timing instrumentation is enabled beyond Prisma warn/error logs.

## Recommended Next Work

- Split dashboard into module-specific endpoints.
- Add pagination/filter parameters to large list APIs.
- Add Prisma query timing logs in non-production QA.
- Move large uploaded images to object storage and store scoped URLs/keys in PostgreSQL.
- Add Playwright timing assertions for critical buttons and tabs.
