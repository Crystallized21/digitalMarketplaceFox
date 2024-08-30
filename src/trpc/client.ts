import {createTRPCReact} from "@trpc/react-query";
import {AppRouter} from "@/trpc/index";

// Create a TRPC client
export const trpc = createTRPCReact<AppRouter>({})