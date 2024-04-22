import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const {
		method,
		query: { id },
		body,
		session: { user },
	} = req;
	// GET 요청 처리: 특정 트윗 조회
	if (method === "GET" && id) {
		try {
			const tweet = await client.tweet.findUnique({
				where: { id: parseInt(id as string, 10) },
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			});

			if (!tweet) {
				res.status(404).json({ ok: false, error: "Tweet not found" });
				return;
			}

			res.json({ ok: true, tweet });
		} catch (error) {
			res.status(500).json({
				ok: false,
				error: "Unable to fetch tweet",
			});
		}
	}

	if (method === "GET") {
		// GET 요청 처리: 모든 트윗을 조회
		try {
			const tweets = await client.tweet.findMany({
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			});
			res.json({ ok: true, tweets });
		} catch (error) {
			res.status(500).json({
				ok: false,
				error: "Unable to fetch tweets",
			});
		}
	} else if (method === "POST") {
		// POST 요청 처리
		if (!user) {
			res.status(401).json({ ok: false, error: "Unauthorized" });
			return;
		}

		const { text } = body;
		try {
			const newTweet = await client.tweet.create({
				data: {
					description: text,
					user: {
						connect: {
							id: user.id,
						},
					},
				},
			});
			res.json({ ok: true, newTweet });
		} catch (error) {
			res.status(500).json({
				ok: false,
				error: "Unable to create tweet",
			});
		}
	} else {
		res.status(405).json({ ok: false, error: "Method not allowed" });
	}
}

export default withApiSession(
	withHandler({ methods: ["GET", "POST"], handler })
);
