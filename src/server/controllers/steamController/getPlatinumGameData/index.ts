import { Request, Response, Next } from "restify";
import { forEach, addIndex } from "ramda";

import { env } from "../../../../config";
import { validatePayload } from "../../../utils/functions";
import payloadSchema from "./payloadSchema";
import minuteToHours from "./minuteToHours";
import requestSteamAPI from "../../../clients/steam";

import {
	AchievementStatus,
	AchievementInfo,
	AchievementSchema,
	PlatinumGame,
} from "./protocols";

const getPlatinumGameData = async (req: Request, res: Response, next: Next) => {
	const requestFields = await validatePayload(req.params, payloadSchema);
	if (!requestFields.valid) {
		res.json(400, { BadRequest: requestFields.errorMsg });
		return next();
	}

	const { steamProfileID, steamGameID } = requestFields;

	const playerAchievementsPayload = {
		key: env.steamKey,
		appid: steamGameID,
		steamid: steamProfileID,
	};

	const playerAchievements = await requestSteamAPI(
		"getPlayerAchievements",
		playerAchievementsPayload
	);

	const platinumGameData: PlatinumGame = {
		playerID: steamProfileID,
		gameID: steamGameID,
		gameName: playerAchievements.playerstats.gameName,
		gameThumb: `https://steamcdn-a.akamaihd.net/steam/apps/${steamGameID}/capsule_616x353.jpg`,
	};

	const alreadyAchieved = 1;
	const achievAlreadyDone = (achiev: AchievementStatus) =>
		achiev.achieved === alreadyAchieved;

	const allDoneGameAchievements =
		playerAchievements.playerstats.achievements.every(achievAlreadyDone);

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

	const schemaForGame = await requestSteamAPI(
		"getSchemaForGame",
		schemaForGamePayload
	);

	const achievsInfo: Array<AchievementInfo> = [];

	const getAchievsInfo = (_: any, i: number): void => {
		const findAchievsByName = (achiev: AchievementSchema) =>
			achiev.name === playerAchievements.playerstats.achievements[i].apiname;

		const { icon } =
			schemaForGame.game.availableGameStats.achievements.find(
				findAchievsByName
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
		response: {
			games: [ownedGame],
		},
	} = await requestSteamAPI("getOwnedGames", getOwnedGamesPayload);

	const totalTimePlayed = minuteToHours(ownedGame.playtime_forever);
	platinumGameData.totalTimePlayed = totalTimePlayed;

	const lastFiveAchievs = achievsInfo
		.sort((a, b) => (a.unlockTime < b.unlockTime ? 1 : -1))
		.slice(0, 5);

	platinumGameData.lastFiveAchievs = lastFiveAchievs;

	res.json(200, { platinumGameData });
	return next();
};

export default getPlatinumGameData;
