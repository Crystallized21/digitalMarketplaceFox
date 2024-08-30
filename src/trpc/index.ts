import { publicProcedure, router } from "./trpc";
import {authRouter} from "./auth-router";
import { z } from "zod";
import { QueryValidator } from "../lib/validators/query-validator";
import { getPayloadClient } from "../get-payload";
import { paymentRouter } from "./payment-router";

// Define the app router

export const appRouter = router({
    auth: authRouter,
    payment: paymentRouter,

    // Define a public procedure to get infinite products

    getInfiniteProducts: publicProcedure.input(z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator
    })).query(async ({ input }) => {
        const {query, cursor} = input
        const {sort, limit, ...queryOpts} = query

        const payload = await getPayloadClient()

        const parsedQueryOpts: Record<string, { equals: string }> = {}

        Object.entries(queryOpts).forEach(([key, value]) => {
            parsedQueryOpts[key] = {
                equals: value
            }
        })

        const page = cursor || 1

        // Fetch the products from the payload

        const {docs: items, hasNextPage, nextPage} = await payload.find({
            collection: "products",
            where: {
                approvedForSale: {
                    equals: "approved"
                },
                ...parsedQueryOpts
            },
            sort,
            depth: 1,
            limit,
            page,
        })

        return {
            items,
            nextPage: hasNextPage ? nextPage : null
        }
    })
})

export type AppRouter = typeof appRouter