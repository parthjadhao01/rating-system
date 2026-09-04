import { z } from "zod"

const PASSWORD_UPPERCASE_RE = /[A-Z]/
const PASSWORD_SPECIAL_CHAR_RE = /[^A-Za-z0-9]/

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(16, "Password must be at most 16 characters long")
    .regex(PASSWORD_UPPERCASE_RE, "Password must include at least one uppercase letter")
    .regex(PASSWORD_SPECIAL_CHAR_RE, "Password must include at least one special character")

export const createUserSchema = z.object({
    name: z
        .string()
        .min(20, "Name must be at least 20 characters long")
        .max(60, "Name must be at most 60 characters long"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required").max(400, "Address must be at most 400 characters long"),
    password: passwordSchema,
    role: z.enum(["ADMIN", "NORMAL_USER", "STORE_OWNER"], "Role must be either ADMIN ,NORMAL_USER or STORE_OWNER")
})

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: passwordSchema,
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
