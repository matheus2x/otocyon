import { Request, Response, Next } from "restify";
import { map } from "ramda";

import requestXboxAPI from "../../../clients/xbox";

const profile = async (req: Request, res: Response, next: Next) => {
	const { xblToken: profileToken = false } = req.query;
	const { profileUsers } = await requestXboxAPI("getProfile", { profileToken });

	if (profileUsers.length < 1) {
		res.json(500, { Error: "Internal Server Error!" });
		return next();
	}

	interface ProfileSetting {
		id: string;
		value: string;
	}
	const xboxID = profileUsers[0].id;

	const matchTags = ["GameDisplayPicRaw", "Gamertag"];

	const mapTags = (value: string) => {
		return profileUsers[0].settings.find(
			(item: ProfileSetting) => item.id === value
		);
	};

	const [{ value: avatarImg }, { value: nickname }] = map(mapTags, matchTags);

	const profileData = {
		avatarImg,
		nickname,
		xboxID,
		profileURL: `https://account.xbox.com/pt-br/profile?gamertag=${nickname}`,
	};

	res.json(200, profileData);
	return next();
};

export default profile;
