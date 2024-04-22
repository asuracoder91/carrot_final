import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const {
		body: { tweetId },
		session: { user },
	} = req;

	if (!user) {
		return res.status(401).json({ ok: false, error: "Unauthorized" });
	}

	let likeChanged = false;

	const existingLike = await client.like.findFirst({
		where: {
			userId: user.id,
			tweetId: parseInt(tweetId),
		},
	});

	if (existingLike) {
		await client.like.delete({
			where: { id: existingLike.id },
		});
		likeChanged = false;
	} else {
		await client.like.create({
			data: {
				user: { connect: { id: user.id } },
				tweet: { connect: { id: parseInt(tweetId) } },
			},
		});
		likeChanged = true;
	}

	const likeCount = await client.like.count({
		where: { tweetId: parseInt(tweetId) },
	});

	return res.json({ ok: true, likeCount, likeChanged });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
