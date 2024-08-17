import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
	if (req.method === "GET") {
		const user = {
			id: 1,
			name: "John Doe",
			email: "john.doe@example.com"
		};

		return NextResponse.json({ user });
	} else {
		return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
	}
};

export { handler as GET };