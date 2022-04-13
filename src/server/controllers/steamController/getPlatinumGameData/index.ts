import { Request, Response, Next } from "restify";
import { find, forEach, addIndex } from "ramda";

import { AchievementStatus, AchievementInfo, PlatinumGame } from "./protocols";
import { env } from "../../../../config";
import requestSteamAPI from "../../../clients/steam";

const getPlatinumGameData = async (req: Request, res: Response, next: Next) => {
	const requiredFields = ["steamProfileID", "steamGameID"];
	const findMissingField = (field: string) => !req.params?.[field];
	const is_missingFields = find(findMissingField, requiredFields); //requiredFields.find(findMissingField);
	if (is_missingFields) {
		res.json(400, { BadRequest: "Missing some field" });
		return next();
	}

	const { steamProfileID, steamGameID } = req.params;

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
	const allDoneGameAchievements =
		playerAchievements.playerstats.achievements.every(
			(achiev: AchievementStatus) => achiev.achieved === alreadyAchieved
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
	const schemaForGame = await requestSteamAPI(
		"getSchemaForGame",
		schemaForGamePayload
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
		response: {
			games: [ownedGame],
		},
	} = await requestSteamAPI("getOwnedGames", getOwnedGamesPayload);

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
