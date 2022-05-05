import { Request, Response, Next } from "restify";

const base = async (req: Request, res: Response, next: Next) => {
	res.json(200, { Message: "Xbox Controller Here!" });
	return next();
};

export default base;
