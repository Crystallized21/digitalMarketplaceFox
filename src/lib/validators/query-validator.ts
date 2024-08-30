import { z } from "zod";

// Define a schema for validating query parameters

export const QueryValidator = z.object({
	category: z.string().optional(),
	sort: z.enum(["asc", "desc"]).optional(),
	limit: z.number().optional(),
})

export type TQueryValidator = z.infer<typeof QueryValidator>