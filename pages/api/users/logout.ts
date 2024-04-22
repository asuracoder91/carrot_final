import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	// 세션 삭제
	req.session.destroy();

	res.json({ ok: true });
}

export default withApiSession(handler);
