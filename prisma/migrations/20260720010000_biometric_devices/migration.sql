-- CreateTable
CREATE TABLE "BiometricDevice" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "model" TEXT,
    "serial" TEXT NOT NULL,
    "ip" TEXT,
    "port" INTEGER NOT NULL DEFAULT 4370,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ONLINE',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BiometricDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiometricSyncLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "records" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiometricSyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BiometricDevice_organizationId_serial_key" ON "BiometricDevice"("organizationId", "serial");

-- CreateIndex
CREATE INDEX "BiometricDevice_organizationId_enabled_idx" ON "BiometricDevice"("organizationId", "enabled");

-- CreateIndex
CREATE INDEX "BiometricSyncLog_organizationId_createdAt_idx" ON "BiometricSyncLog"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "BiometricSyncLog_deviceId_createdAt_idx" ON "BiometricSyncLog"("deviceId", "createdAt");

-- AddForeignKey
ALTER TABLE "BiometricDevice" ADD CONSTRAINT "BiometricDevice_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiometricSyncLog" ADD CONSTRAINT "BiometricSyncLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiometricSyncLog" ADD CONSTRAINT "BiometricSyncLog_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "BiometricDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
