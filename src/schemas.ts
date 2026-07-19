import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(1, "Password is required."),
    role: z.enum(["SUPER_ADMIN", "ORG_ADMIN", "EMPLOYEE"]).optional()
  })
});

export const createOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Organization name must be at least 2 characters."),
    adminEmail: z.string().email("Admin user ID must be a valid email address."),
    companyEmail: z.string().email("Company email must be a valid email address.").optional(),
    adminName: z.string().min(2, "Admin name must be at least 2 characters.").optional(),
    adminPassword: z.string().min(8, "Admin password must be at least 8 characters.").optional(),
    packageName: z.string().default("Starter"),
    industry: z.string().optional()
  })
});

export const createPackageSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Package name must be at least 2 characters."),
    priceCents: z.number().int().nonnegative().default(0),
    seatLimit: z.number().int().positive().optional(),
    storageLimitGb: z.number().int().positive().default(5),
    features: z.array(z.string()).default([])
  })
});

export const employeeSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email("Employee email must be valid."),
    password: z.string().min(8, "Employee password must be at least 8 characters.").optional(),
    phone: z.string().optional(),
    title: z.string().min(1, "Designation is required."),
    departmentId: z.string().optional(),
    departmentName: z.string().optional(),
    employmentType: z.string().default("Full-time")
  })
});

export const departmentSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Department name must be at least 2 characters."),
    code: z.string().min(1, "Department code is required."),
    description: z.string().optional()
  })
});

export const leaveSchema = z.object({
  body: z.object({
    type: z.string().min(1, "Leave type is required."),
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
