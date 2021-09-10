import axios from "axios";
import cheerio from "cheerio";

import getProfileValues from "./functions/getProfileValues";
import { ProfileData } from "./protocols";

export const profileSearcher = async (
	profileLink: string
): Promise<ProfileData> => {
	const steamIDFinder = `https://steamid.xyz/${profileLink}`;
	const { data: profileSearchResult } = await axios.get(steamIDFinder);
	const pageSelector = cheerio.load(profileSearchResult);
	const profileValues = getProfileValues(pageSelector);

	return {
		avatarImg: pageSelector("img.avatar").attr().src,
		nickname: profileValues.nickname,
		steamID: profileValues.steamID,
		profileURL: `http://steamcommunity.com/profiles/${profileValues.steamID}`,
	};
};
