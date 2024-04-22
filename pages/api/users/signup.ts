import * as bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";

async function checkExistingUser(email: string) {
	return await client.user.findUnique({ where: { email } });
}

async function createUser(name: string, email: string, password: string) {
	const hashedPassword = await bcrypt.hash(password, 10);
	return await client.user.create({
		data: { name, email, password: hashedPassword },
	});
}

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const { name, email, password } = req.body;
	if (
		typeof name !== "string" ||
		typeof email !== "string" ||
		typeof password !== "string"
	) {
		return res.status(400).json({ ok: false, error: "Invalid input." });
	}

	try {
		const existingUser = await checkExistingUser(email);
		if (existingUser) {
			return res.status(409).json({
				ok: false,
				error: "This email address is already in use.",
			});
		}

		await createUser(name, email, password);
		res.json({ ok: true });
	} catch (error) {
		console.error(error); // For server-side debugging
		res.status(500).json({ ok: false, error: "Failed to create account." });
	}
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
