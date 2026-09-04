import z from "zod"

export const createStoreSchema = z.object({
    name : z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters long"),
    email : z.string().email("Invalid email address"),
    address : z.string().min(1, "Address is required").max(400, "Address must be at most 400 characters long"),
    owner : z.string().cuid("Owner must be a valid CUID"),
})