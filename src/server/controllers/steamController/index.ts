import { Request, Response, Next } from "restify";

import { profileSearcher } from "./services";
import { http } from "../../utils";

export const base = async (req: Request, res: Response, next: Next) => {
	res.json({ msg: "Steam Controller Created" });
	return next();
};

export const show = async (req: Request, res: Response, next: Next) => {
	const requiredFields = ["steamURL"];
	const missingField = requiredFields.find((field) => !req.params[field]);
	if (missingField) {
		res.json(http.badRequest({ "Missing Field": missingField }));
		return next();
	}

	const { steamURL } = req.params;
	const profileData = await profileSearcher(steamURL);

	res.json(http.okResponse(profileData));
	return next();
};
