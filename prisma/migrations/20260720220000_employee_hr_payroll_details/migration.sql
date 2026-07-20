ALTER TABLE "Employee"
  ADD COLUMN "workLocation" TEXT,
  ADD COLUMN "gender" TEXT,
  ADD COLUMN "dateOfBirth" TIMESTAMP(3),
  ADD COLUMN "nationalId" TEXT,
  ADD COLUMN "address" TEXT,
  ADD COLUMN "emergencyContactName" TEXT,
  ADD COLUMN "emergencyContactPhone" TEXT,
  ADD COLUMN "bankName" TEXT,
  ADD COLUMN "bankAccount" TEXT,
  ADD COLUMN "salaryCents" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "salaryCurrency" TEXT NOT NULL DEFAULT 'USD',
  ADD COLUMN "payFrequency" TEXT NOT NULL DEFAULT 'Monthly';
