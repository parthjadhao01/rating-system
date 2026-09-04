import { z } from "zod"

// At least one uppercase letter and one special character, per the
// assignment's password policy.
const PASSWORD_UPPERCASE_RE = /[A-Z]/
const PASSWORD_SPECIAL_CHAR_RE = /[^A-Za-z0-9]/

// Single source of truth for user validation — imported by the API route
// (lib/validations/user.ts -> app/api/user/route.ts) and by the Add User
// drawer (components/table/usertable/add-user-drawer.tsx), so client and
// server can never drift apart on the rules.
export const createUserSchema = z.object({
    name: z
        .string()
        .min(20, "Name must be at least 20 characters long")
        .max(60, "Name must be at most 60 characters long"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required").max(400, "Address must be at most 400 characters long"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(16, "Password must be at most 16 characters long")
        .regex(PASSWORD_UPPERCASE_RE, "Password must include at least one uppercase letter")
        .regex(PASSWORD_SPECIAL_CHAR_RE, "Password must include at least one special character"),
    role: z.enum(["ADMIN", "NORMAL_USER", "STORE_OWNER"], "Role must be either ADMIN ,NORMAL_USER or STORE_OWNER")
})
