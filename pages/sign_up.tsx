import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import Button from "@components/button";
import InputField from "@components/input";

interface SignUpForm {
	name: string;
	email: string;
	password: string;
}

interface SignUpResponse {
	ok: boolean;
	error?: string;
}

const SignUp: NextPage = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpForm>({ mode: "onBlur", criteriaMode: "all" });
	const [signup, { data, loading }] =
		useMutation<SignUpResponse>("/api/users/signup");
	const onValid = ({ name, email, password }: SignUpForm) => {
		if (loading) return;
		signup({ name, email, password });
	};
	useEffect(() => {
		if (data?.ok) {
			router.push("/log_in");
		}
		if (data && !data.ok) {
			alert("Account already exists! Write another account.");
		}
	}, [data, router]);

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
						Create your account
					</h1>
				</div>
				<form
					onSubmit={handleSubmit(onValid)}
					action="#"
					className="p-0"
				>
					<InputField
						type="text"
						placeholder="Name" // 이름 입력 필드
						name="name"
						register={register}
						validation={{ required: "Enter your name." }}
						error={errors.name?.message}
					/>
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
					<Button
						text="Sign up with E-mail account"
						loading={loading}
					/>
				</form>
				<a href="/log_in" data-test="Link">
					<span className="block p-5 text-center text-gray-800 text-sm">
						Have an account already?{" "}
						<span className="text-blue-700 font-medium">
							Log in
						</span>
					</span>
				</a>
			</div>
		</div>
	);
};

export default SignUp;
