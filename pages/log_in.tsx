import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import Button from "@components/button";
import InputField from "@components/input";

interface LoginValues {
	email: string;
	password: string;
	errors?: string;
}

interface LoginResponse {
	ok: boolean;
	error?: string;
}

const Login: NextPage = () => {
	const router = useRouter();
	const [loginMutation, { loading, data: loginData }] =
		useMutation<LoginResponse>("/api/users/login");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginValues>({
		mode: "onBlur",
		criteriaMode: "all",
	});

	const onValid = ({ email, password }: LoginValues) => {
		if (loading) return;
		loginMutation({ email, password });
	};

	useEffect(() => {
		if (loginData?.ok) {
			router.push("/");
		}
	}, [loginData, router]);
	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-white">
			<div className="w-full max-w-lg px-4 py-10">
				<div className="flex justify-center">
					<svg
						className="w-1/3 lg:w-1/2"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 300 300.251"
					>
						<path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
					</svg>
				</div>
				<div className="text-left pt-10 font-sans">
					<h1 className="text-gray-800 text-3xl font-medium">
						Welcome to X - Twitter
					</h1>
				</div>
				<form
					onSubmit={handleSubmit(onValid)}
					action="#"
					className="p-0"
				>
					<InputField
						type="text"
						placeholder="Email"
						name="email"
						register={register}
						validation={{
							required: "Write your email please.",
							pattern: {
								value: /^\S+@\S+\.\S+$/,
								message: "Invalid email format",
							},
						}}
						error={errors.email?.message}
					/>
					<InputField
						type="password"
						placeholder="Password"
						name="password"
						register={register}
						validation={{
							required: "Password has to be more than 5 chars.",
							minLength: {
								value: 5,
								message:
									"Password must be at least 5 characters",
							},
						}}
						error={errors.password?.message}
					/>
					<br />
					<Button text="Log in" loading={loading} />
				</form>
				<a href="/sign_up" data-test="Link">
					<span className="block p-5 text-center text-gray-800 text-sm">
						Don't have an account yet?{" "}
						<span className="text-blue-700 font-medium">
							Sign Up
						</span>
					</span>
				</a>
			</div>
		</div>
	);
};

export default Login;
