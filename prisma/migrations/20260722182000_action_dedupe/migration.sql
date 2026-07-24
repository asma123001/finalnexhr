-- Remove duplicate rows that can be created by repeated clicks, keeping the newest record.
WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "organizationId", name ORDER BY "createdAt" DESC, id DESC) AS rn
  FROM "Department"
)
UPDATE "Employee" SET "departmentId" = NULL WHERE "departmentId" IN (SELECT id FROM duplicates WHERE rn > 1);

WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "organizationId", name ORDER BY "createdAt" DESC, id DESC) AS rn
  FROM "Department"
)
UPDATE "Department" SET "parentId" = NULL WHERE "parentId" IN (SELECT id FROM duplicates WHERE rn > 1);

WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "organizationId", name ORDER BY "createdAt" DESC, id DESC) AS rn
  FROM "Department"
)
DELETE FROM "Department" WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "organizationId", name ORDER BY "createdAt" DESC, id DESC) AS rn
  FROM "Shift"
)
DELETE FROM "Shift" WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "organizationId", name ORDER BY "createdAt" DESC, id DESC) AS rn
  FROM "AttendancePolicy"
)
DELETE FROM "AttendancePolicy" WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "organizationId", name, date ORDER BY "createdAt" DESC, id DESC) AS rn
  FROM "Holiday"
)
DELETE FROM "Holiday" WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "organizationId", period ORDER BY "createdAt" DESC, id DESC) AS rn
  FROM "PayrollRun"
)
DELETE FROM "PayrollItem" WHERE "payrollRunId" IN (SELECT id FROM duplicates WHERE rn > 1);

WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "organizationId", period ORDER BY "createdAt" DESC, id DESC) AS rn
  FROM "PayrollRun"
)
DELETE FROM "PayrollRun" WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

CREATE UNIQUE INDEX "Department_organizationId_name_key" ON "Department"("organizationId", name);
CREATE UNIQUE INDEX "Shift_organizationId_name_key" ON "Shift"("organizationId", name);
CREATE INDEX "ShiftAssignment_shiftId_targetType_targetId_idx" ON "ShiftAssignment"("shiftId", "targetType", "targetId");
CREATE INDEX "ShiftAssignment_shiftId_employeeId_idx" ON "ShiftAssignment"("shiftId", "employeeId");
CREATE UNIQUE INDEX "AttendancePolicy_organizationId_name_key" ON "AttendancePolicy"("organizationId", name);
CREATE UNIQUE INDEX "Holiday_organizationId_name_date_key" ON "Holiday"("organizationId", name, date);
CREATE UNIQUE INDEX "PayrollRun_organizationId_period_key" ON "PayrollRun"("organizationId", period);
