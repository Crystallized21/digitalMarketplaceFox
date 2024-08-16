import {NextRequest} from "next/server";
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {User} from "@/payload-types";

export const getServerSideUser = async (
    cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
    const token = cookies.get("payload-token")?.value;

    const meRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
        headers: {
            Authorization: `JWT ${token}`
        }
    });

    if (!meRes.ok) {
        if (meRes.status === 404) {
            throw new Error("Failed to fetch user: Not Found");
        } else if (meRes.status === 508) {
            throw new Error("Failed to fetch user: Loop Detected");
        } else {
            throw new Error(`Failed to fetch user: ${meRes.statusText}`);
        }
    }

    const contentType = meRes.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response");
    }

    const {user} = (await meRes.json()) as {user: User | null};

    return {user};
};