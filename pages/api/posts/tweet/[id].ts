import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { ResponseType } from "@libs/server/withHandler";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "GET") {
		const { id } = req.query;

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
			res.status(500).json({ ok: false, error: "Unable to fetch tweet" });
		}
	} else {
		res.status(405).json({ ok: false, error: "Method not allowed" });
	}
}

export default handler;
