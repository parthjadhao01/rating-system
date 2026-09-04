import { z } from "zod"

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
    password : z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["ADMIN", "NORMAL_USER", "STORE_OWNER"], "Role must be either ADMIN ,NORMAL_USER or STORE_OWNER")
})