import { Request, Response, Next } from "restify";

export const index = async (req: Request, res: Response, next: Next) => {
	res.json({ msg: "Steam Controller Created" });
	return next();
};
