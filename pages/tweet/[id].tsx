import { NextPage } from "next";
import React from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

const TweetDetail: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;

	const { data: tweetData, error: tweetError } = useSWR(
		id ? `/api/posts/tweet/${id}` : null
	);

	const handleLike = async () => {
		try {
			const response = await fetch(`/api/posts/tweet/like`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ tweetId: id }),
			});
			const result = await response.json();
			if (result.ok) {
				mutate(
					`/api/posts/tweet/${id}`,
					{
						...tweetData,
						isLikedByUser: result.likeChanged,
						tweet: {
							...tweetData.tweet,
							_count: { likes: result.likeCount },
							isLikedByUser: result.likeChanged,
						},
					},
					false
				);
			}
		} catch (error) {
			console.error("Error handling like:", error);
		}
	};

	if (!tweetData) return <p>Loading...</p>;
	if (tweetError) return <p>Error loading tweet.</p>;

	const tweet = tweetData.tweet;
	const isLikedByUser = tweetData.isLikedByUser;

	// Check if tweet data is available
	if (!tweet) return <p>Tweet not found.</p>;

	const displayName = tweet.user?.name || "Noname";
	const likeCount = tweet._count?.likes ?? 0;

	const generateAvatarColor = (name: string) => {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		const color = `hsl(${hash % 360}, 75%, 60%)`;
		return color;
	};

	const goBack = () => {
		router.back();
	};

	const avatarColor = generateAvatarColor(displayName);
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center">
						<div
							className="rounded-full h-10 w-10 flex items-center justify-center text-white mr-2"
							style={{ backgroundColor: avatarColor }}
						>
							{displayName[0].toUpperCase()}
						</div>
						<div>
							<h3 className="text-lg font-bold">{displayName}</h3>
							<span className="text-sm text-gray-500">
								{new Date(tweet.createdAt).toLocaleDateString()}
							</span>
						</div>
					</div>
					<span className="text-gray-700">{likeCount} Likes</span>
				</div>
				<p className="text-gray-700 mb-4 p-4 border border-gray-300 rounded-lg">
					{tweet.description}
				</p>
				<button
					onClick={handleLike}
					className={`px-4 py-2 text-white rounded-lg ${
						isLikedByUser
							? "bg-red-500 hover:bg-red-400"
							: "bg-pink-400 hover:bg-pink-300"
					}`}
				>
					{isLikedByUser ? "💔 Unlike" : "❤️ Like"}
				</button>
				<button
					onClick={goBack}
					className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
				>
					Go Back
				</button>
			</div>
		</div>
	);
};

export default TweetDetail;
