import { initTRPC, TRPCError } from "@trpc/server";
import {ExpressContext} from "@/server";
import { PayloadRequest } from "payload/types";
import { User } from "@/payload-types";

// Create a new TRPC instance

const t = initTRPC.context<ExpressContext>().create()
const middleware = t.middleware

// Middleware to check if the user is authenticated

const isAuth = middleware(async ({ctx, next}) => {
	const req = ctx.req as PayloadRequest

	const {user} = req as {user: User | null}

	if (!user || !user.id) {
		throw new TRPCError({code: "UNAUTHORIZED"})
	}

	return next ({
		ctx: {
			user,
		}
	})
})

// Export the router and procedures

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)