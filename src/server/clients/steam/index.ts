import axios from "axios";
import { SteamService, SteamServices } from "./protocols";

const requestSteamAPI = async (steamService: SteamService, payload?: any) => {
	const steamAPI = axios.create({ baseURL: "http://api.steampowered.com" });

	const steamServices: SteamServices = {
		getPlayerAchievements: {
			url: "ISteamUserStats/GetPlayerAchievements/v1",
			method: "GET",
			params: payload,
		},
		getSchemaForGame: {
			url: "ISteamUserStats/GetSchemaForGame/v2",
			method: "GET",
			params: payload,
		},
		getOwnedGames: {
			url: "IPlayerService/GetOwnedGames/v1",
			method: "GET",
			params: payload,
		},
	};

	const { data: steamAPIResponse } = await steamAPI(
		steamServices[steamService]
	);

	return steamAPIResponse;
};

export default requestSteamAPI;
