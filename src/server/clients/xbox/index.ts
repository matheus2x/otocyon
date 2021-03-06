import axios from "axios";
import { xboxKey } from "../../../config/env";

import { XboxService, XboxServices } from "./protocols";

const requestXboxAPI = async (xboxService: XboxService, payload?: any) => {
	const xboxAPI = axios.create({
		baseURL: "https://xbl.io/api/v2",
	});

	const xboxServices: XboxServices = {
		getProfile: {
			url: "account",
			method: "GET",
			headers: { "X-Authorization": payload?.profileToken || xboxKey },
		},
		getAchievements: {
			url: "achievements",
			method: "GET",
			headers: { "X-Authorization": payload?.profileToken || xboxKey },
		},
		getPlayerTitleAchievements: {
			url: `achievements/title/${payload.gameID}`,
			method: "GET",
			headers: { "X-Authorization": payload?.profileToken || xboxKey },
		},
	};

	const { data: xboxAPIResponse } = await xboxAPI(xboxServices[xboxService]);

	return xboxAPIResponse;
};

export default requestXboxAPI;
