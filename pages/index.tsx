import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

const Home: NextPage = () => {
	const router = useRouter();
	const { data, error } = useSWR("/api/users/confirm");

	const { data: tweetsResponse, error: tweetsError } =
		useSWR("/api/posts/tweet");
	const [newTweet, setNewTweet] = useState("");

	const generateAvatarColor = (name: string) => {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		const color = `hsl(${hash % 360}, 75%, 60%)`;
		return color;
	};

	const renderAvatar = (name: string) => {
		const displayName = name || "Noname";
		const avatarColor = generateAvatarColor(displayName);
		return (
			<div className="flex items-center space-x-2">
				<div
					className="rounded-full h-10 w-10 flex items-center justify-center text-white"
					style={{ backgroundColor: avatarColor }}
				>
					{displayName[0].toUpperCase()}
				</div>
				<span>{displayName}</span>
			</div>
		);
	};

	const logout = async () => {
		try {
			const response = await fetch("/api/users/logout", {
				method: "POST",
			});
			const result = await response.json();
			if (result.ok) {
				router.replace("/log_in");
			}
		} catch (error) {
			console.error("로그아웃 실패:", error);
		}
	};

	const postTweet = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/posts/tweet", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: newTweet }),
			});
			const result = await response.json();
			if (result.ok) {
				mutate("/api/posts/tweet");
				setNewTweet("");
			} else {
				console.error("트윗 작성 실패:", result.error);
			}
		} catch (error) {
			console.error("트윗 작성 중 에러 발생:", error);
		}
	};

	console.log("data:", data, "error:", error);

	useEffect(() => {
		if (error) {
			router.replace("/sign_up");
		}
	}, [router, error]);
	if (!data) {
		return <div />;
	}

	if (!data && !error) {
		return <div>Loading...</div>;
	}
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div className="absolute top-5 right-5">
				<button
					onClick={logout}
					className="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-300 focus:outline-none"
				>
					로그아웃
				</button>
			</div>
			<div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
				<form onSubmit={postTweet} className="mb-4">
					<div className="mb-4">
						{data && renderAvatar(data.user.name || "Noname")}
					</div>
					<textarea
						value={newTweet}
						onChange={(e) => setNewTweet(e.target.value)}
						placeholder="Write your tweet here..."
						className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					<button
						type="submit"
						className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
					>
						Send Tweet
					</button>
				</form>

				<div>
					{tweetsResponse &&
					tweetsResponse.tweets &&
					tweetsResponse.tweets.length > 0 ? (
						tweetsResponse.tweets.map((tweet: any) => (
							<div
								key={tweet.id}
								className="p-4 mb-4 border border-gray-300 rounded-lg"
								onClick={() =>
									router.push(`/tweet/${tweet.id}`)
								}
							>
								<div className="flex items-center justify-between">
									<div>{renderAvatar(tweet.user.name)}</div>
									<span className="text-sm text-gray-500">
										{new Date(
											tweet.createdAt
										).toLocaleDateString()}
									</span>
								</div>
								<p className="text-gray-700 mt-2">
									{tweet.description}
								</p>
							</div>
						))
					) : (
						<p className="text-center text-gray-500">
							No Tweets found.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
