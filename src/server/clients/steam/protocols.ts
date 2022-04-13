import { AxiosRequestConfig } from "axios";

export type SteamService =
	| "getPlayerAchievements"
	| "getSchemaForGame"
	| "getOwnedGames";

export type SteamServices = {
	[key in SteamService]: AxiosRequestConfig;
};
