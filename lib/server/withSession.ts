import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
	interface IronSessionData {
		user?: {
			id: number;
		};
	}
}

const cookieOptions = {
	cookieName: "carrotsession",
	password: "change-me-in-production_hhijjkklkjhgjhg8765",
};

export function withApiSession(fn: any) {
	return withIronSessionApiRoute(fn, cookieOptions);
}
