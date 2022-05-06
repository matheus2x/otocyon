import { AxiosRequestConfig } from "axios";

export type XboxService =
	| "getProfile"
	| "getAchievements"
	| "getPlayerTitleAchievements";

export type XboxServices = {
	[key in XboxService]: AxiosRequestConfig;
};
