export interface AchievementStatus {
	apiname?: string;
	achieved: number;
	unlockTime: number;
}

export interface AchievementInfo {
	name: string;
	unlockTime: number;
	icon: string;
}

export type AchievementSchema = Omit<AchievementInfo, "unlockTime">;

export interface PlatinumGame {
	playerID: string;
	gameID: string | number;
	gameName: string;
	gameThumb: string;
	achievsLength?: number;
	totalTimePlayed?: string | number;
	lastFiveAchievs?: Array<AchievementInfo>;
}
