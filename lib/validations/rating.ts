import { z } from "zod"

export const submitRatingSchema = z.object({
    userId: z.string().cuid("Invalid user"),
    storeId: z.string().cuid("Invalid store"),
    rating: z
        .number()
        .int("Rating must be a whole number")
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5"),
})
