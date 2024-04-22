import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid"; // UUID 생성 라이브러리
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

interface LoginRequest {
	email: string;
	password: string;
}

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) => {
	const { email, password } = req.body as LoginRequest;

	if (typeof email !== "string" || typeof password !== "string") {
		return res.status(400).json({ ok: false, error: "Invalid input." });
	}

	try {
		const user = await client.user.findUnique({ where: { email } });
		if (!user) {
			return res
				.status(404)
				.json({ ok: false, error: "User not found." });
		}

		const passwordOk = await bcrypt.compare(password, user.password);
		if (!passwordOk) {
			return res
				.status(401)
				.json({ ok: false, error: "Incorrect password." });
		}

		req.session.user = { id: user.id };
		await req.session.save();
		res.json({ ok: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, error: "Can't log in account." });
	}
};

export default withApiSession(
	withHandler({ methods: ["POST"], handler, isPrivate: false })
);
