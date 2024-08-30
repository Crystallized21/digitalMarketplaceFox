import {fetchRequestHandler} from "@trpc/server/adapters/fetch";
import {appRouter} from "@/trpc";

// this is a handler that can be used with Vercel, Netlify, AWS Lambda, etc.

const handler = (req: Request) => {
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,

        // @ts-expect-error context already passed from express middleware
        createContext: () => ({}),
    })
}

export {handler as GET, handler as POST}