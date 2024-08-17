import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		const user = {
			id: 1,
			name: "John Doe",
			email: "john.doe@example.com"
		};

		res.status(200).json({ user });
	} else {
		res.status(405).json({ message: "Method Not Allowed" });
	}
};

export { handler as GET };