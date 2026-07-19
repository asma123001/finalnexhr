import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
    role: z.enum(["SUPER_ADMIN", "ORG_ADMIN", "EMPLOYEE"]).optional()
  })
});

export const createOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    adminEmail: z.string().email(),
    adminName: z.string().min(2).optional(),
    adminPassword: z.string().min(8).optional(),
    packageName: z.string().default("Starter"),
    industry: z.string().optional()
  })
});

export const createPackageSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    priceCents: z.number().int().nonnegative().default(0),
    seatLimit: z.number().int().positive().optional(),
    storageLimitGb: z.number().int().positive().default(5),
    features: z.array(z.string()).default([])
  })
});

export const employeeSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8).optional(),
    phone: z.string().optional(),
    title: z.string().min(1),
    departmentId: z.string().optional(),
    departmentName: z.string().optional(),
    employmentType: z.string().default("Full-time")
  })
});

export const departmentSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    code: z.string().min(1),
    description: z.string().optional()
  })
});

export const leaveSchema = z.object({
  body: z.object({
    type: z.string().min(1),
    fromDate: z.coerce.date(),
    toDate: z.coerce.date(),
    reason: z.string().optional()
  })
});

export const attendanceSchema = z.object({
  body: z.object({
    employeeId: z.string().optional(),
    date: z.coerce.date().optional(),
    checkIn: z.coerce.date().optional(),
    checkOut: z.coerce.date().optional(),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE", "WORK_FROM_HOME", "WEEKEND"]).default("PRESENT"),
    notes: z.string().optional()
  })
});
