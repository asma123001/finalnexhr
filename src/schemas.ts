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
    seatLimit: z.number().int().positive().nullable().optional(),
    storageLimitGb: z.number().int().positive().default(5),
    features: z.array(z.string()).default([])
  })
});

export const updatePackageSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Package name must be at least 2 characters.").optional(),
    priceCents: z.number().int().nonnegative().optional(),
    seatLimit: z.number().int().positive().nullable().optional(),
    storageLimitGb: z.number().int().positive().optional(),
    features: z.array(z.string()).optional(),
    isActive: z.boolean().optional()
  })
});

export const createBiometricDeviceSchema = z.object({
  body: z.object({
    organizationId: z.string().min(1, "Organization is required."),
    name: z.string().min(2, "Device name must be at least 2 characters."),
    type: z.string().min(2, "Device type is required."),
    model: z.string().optional(),
    serial: z.string().min(2, "Device serial number is required."),
    ip: z.string().optional(),
    port: z.coerce.number().int().positive().default(4370),
    location: z.string().optional()
  })
});

export const organizationAdminSchema = z.object({
  body: z.object({
    organizationId: z.string().min(1, "Organization is required."),
    name: z.string().min(2, "Admin name must be at least 2 characters."),
    email: z.string().email("Admin email must be valid."),
    password: z.string().min(8, "Admin password must be at least 8 characters."),
    roleLabel: z.string().min(1, "Admin role is required.")
  })
});

export const updateOrganizationAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Admin name must be at least 2 characters.").optional(),
    email: z.string().email("Admin email must be valid.").optional(),
    password: z.string().min(8, "Admin password must be at least 8 characters.").optional().or(z.literal("")),
    roleLabel: z.string().min(1, "Admin role is required.").optional()
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(8, "Admin password must be at least 8 characters.")
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
    employmentType: z.string().default("Full-time"),
    joinedAt: z.coerce.date().optional(),
    workLocation: z.string().optional(),
    gender: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    nationalId: z.string().optional(),
    address: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    bankName: z.string().optional(),
    bankAccount: z.string().optional(),
    salary: z.coerce.number().nonnegative().optional(),
    salaryCurrency: z.string().default("USD"),
    payFrequency: z.string().default("Monthly")
  })
});

export const employeeUpdateSchema = z.object({
  body: employeeSchema.shape.body.partial().extend({
    password: z.string().min(8, "Employee password must be at least 8 characters.").optional().or(z.literal(""))
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

export const attendancePolicySchema = z.object({
  body: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Policy name is required."),
    status: z.string().optional(),
    priority: z.string().optional(),
    effectiveDate: z.string().optional(),
    rules: z.unknown().optional(),
    assignments: z.unknown().optional(),
    exceptions: z.unknown().optional(),
    history: z.unknown().optional()
  })
});

export const shiftSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Shift name is required."),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
    workingDays: z.string().min(1, "Working days are required."),
    breakMinutes: z.coerce.number().int().nonnegative().optional(),
    graceMinutes: z.coerce.number().int().nonnegative().optional(),
    overtimeAfter: z.string().optional()
  })
});

export const shiftAssignmentSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    shiftId: z.string().min(1),
    targetType: z.string().min(1),
    targetId: z.string().optional(),
    employeeId: z.string().optional(),
    effectiveFrom: z.coerce.date().optional(),
    effectiveTo: z.coerce.date().optional()
  })
});

export const orgSettingsSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    industry: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    website: z.string().optional(),
    address: z.string().optional(),
    currency: z.string().optional(),
    timezone: z.string().optional(),
    dateFormat: z.string().optional(),
    payFrequency: z.string().optional(),
    workWeekStart: z.string().optional()
  })
});

export const holidaySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Holiday name is required."),
    date: z.coerce.date(),
    type: z.string().default("Public")
  })
});

export const roleSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Role name is required."),
    description: z.string().optional(),
    permissions: z.array(z.string()).default([])
  })
});

export const loanSchema = z.object({
  body: z.object({
    employeeId: z.string().min(1, "Employee is required."),
    type: z.string().min(1, "Loan type is required."),
    amount: z.coerce.number().positive("Amount must be greater than zero."),
    installments: z.coerce.number().int().positive().optional(),
    salary: z.coerce.number().nonnegative().optional()
  })
});

export const letterSchema = z.object({
  body: z.object({
    employeeId: z.string().min(1, "Employee is required."),
    type: z.string().min(1, "Letter type is required."),
    notes: z.string().optional()
  })
});

export const imageDataSchema = z.object({
  body: z.object({
    dataUrl: z.string().regex(/^data:image\/(png|jpeg|jpg|webp);base64,/i, "Upload a PNG, JPG, or WEBP image.")
  })
});
