import {router} from "@/trpc/trpc";
import {authRouter} from "@/trpc/auth-router";

export const appRouter = router({
    auth: authRouter
})

export type AppRouter = typeof appRouter