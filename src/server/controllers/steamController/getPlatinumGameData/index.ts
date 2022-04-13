import { Request, Response, Next } from "restify";
import { find, forEach, addIndex } from "ramda";
import axios from "axios";

import { env } from "../../../../config";

const getPlatinumGameData = async (req: Request, res: Response, next: Next) => {
	const requiredFields = ["steamProfileID", "steamGameID"];
	const findMissingField = (field: string) => !req.params?.[field];
	const is_missingFields = find(findMissingField, requiredFields); //requiredFields.find(findMissingField);
	if (is_missingFields) {
		res.json(400, { BadRequest: "Missing some field" });
		return next();
	}

	const { steamProfileID, steamGameID } = req.params;

	const steamAPI = axios.create({ baseURL: "http://api.steampowered.com" });
	const steamAPIMethods = {
		getPlayerAchievements: "ISteamUserStats/GetPlayerAchievements/v1",
		getSchemaForGame: "ISteamUserStats/GetSchemaForGame/v2",
		getOwnedGames: "IPlayerService/GetOwnedGames/v1",
	};

	const playerAchievementsPayload = {
		key: env.steamKey,
		appid: steamGameID,
		steamid: steamProfileID,
	};
	const { data: playerAchievements } = await steamAPI.get(
		steamAPIMethods.getPlayerAchievements,
		{ params: playerAchievementsPayload }
	);

	interface AchievementInfo {
		name: string;
		unlockTime: number;
		icon: string;
	}

	interface PlatinumGame {
		playerID: string;
		gameID: string | number;
		gameName: string;
		gameThumb: string;
		achievsLength?: number;
		totalTimePlayed?: string | number;
		lastFiveAchievs?: Array<AchievementInfo>;
	}

	const platinumGameData: PlatinumGame = {
		playerID: steamProfileID,
		gameID: steamGameID,
		gameName: playerAchievements.playerstats.gameName,
		gameThumb: `https://steamcdn-a.akamaihd.net/steam/apps/${steamGameID}/capsule_616x353.jpg`,
	};

	interface Achievement {
		apiname?: string;
		achieved: number;
		unlockTime: number;
	}

	const alreadyAchieved = 1;
	const allDoneGameAchievements =
		playerAchievements.playerstats.achievements.every(
			(achiev: Achievement) => achiev.achieved === alreadyAchieved
		);

	if (!allDoneGameAchievements) {
		res.json(404, {
			NotFound: `Player with ID "${steamProfileID}" doesn't have 100% of "${platinumGameData.gameName}"`,
		});

		return next();
	}

	const schemaForGamePayload = {
		key: env.steamKey,
		appid: steamGameID,
	};
	const { data: schemaForGame } = await steamAPI.get(
		steamAPIMethods.getSchemaForGame,
		{ params: schemaForGamePayload }
	);

	const achievsInfo: Array<AchievementInfo> = [];

	const getAchievsInfo = (_: any, i: number): void => {
		const { icon } = schemaForGame.game.availableGameStats.achievements.find(
			(game: Omit<AchievementInfo, "unlockTime">) =>
				game.name === playerAchievements.playerstats.achievements[i].apiname
		);

		achievsInfo.push({
			name: playerAchievements.playerstats.achievements[i].apiname,
			unlockTime: playerAchievements.playerstats.achievements[i].unlocktime,
			icon,
		});
	};

	const forEachIndexed = addIndex(forEach);
	forEachIndexed(getAchievsInfo, playerAchievements.playerstats.achievements);

	platinumGameData.achievsLength = achievsInfo.length;

	const getOwnedGamesPayload = {
		key: env.steamKey,
		steamid: steamProfileID,
		format: "json",
		"appids_filter[0]": steamGameID,
	};
	const {
		data: {
			response: {
				games: [ownedGame],
			},
		},
	} = await steamAPI.get(steamAPIMethods.getOwnedGames, {
		params: getOwnedGamesPayload,
	});

	const totalTimePlayed = Math.round(
		((ownedGame.playtime_forever / 60) * 100) / 100
	).toFixed(2);

	const lastFiveAchievs = achievsInfo
		.sort((a, b) => (a.unlockTime < b.unlockTime ? 1 : -1))
		.slice(0, 5);

	platinumGameData.totalTimePlayed = totalTimePlayed;
	platinumGameData.lastFiveAchievs = lastFiveAchievs;

	res.json(200, { platinumGameData });
	return next();
};

export default getPlatinumGameData;
