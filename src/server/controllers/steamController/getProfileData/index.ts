import { Request, Response, Next } from "restify";
import { find } from "ramda";

import searchProfile from "./searchProfile";

const getProfileData = async (req: Request, res: Response, next: Next) => {
	const requiredFields = ["steamURL"];
	const findMissingField = (field: string) => !req.params?.[field];
	const is_missingFields = find(findMissingField, requiredFields); //requiredFields.find(findMissingField);
	if (is_missingFields) {
		res.json(400, { BadRequest: "Field 'steamURL' is required!" });
		return next();
	}

	const { steamURL } = req.params;
	const profileData = await searchProfile(steamURL);

	res.json(200, { ...profileData });
	return next();
};

export default getProfileData;
