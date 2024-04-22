import { NextApiRequest, NextApiResponse } from "next";
import { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const {
		session: { user },
	} = req;
	if (!user?.id) {
		return res.status(401).end();
	}
	const dbUser = await client.user.findUnique({
		where: {
			id: user.id,
		},
	});
	if (!dbUser) {
		return res.status(404).end();
	}
	const { password, ...userWithoutPassword } = dbUser;
	return res.send({ ok: true, user: userWithoutPassword });
}

export default withApiSession(handler);
