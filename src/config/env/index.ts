import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

import server from "../../server";

const dotenvFile = path.resolve(__dirname, "..", "..", "..", ".env");
const checkDotenvExists = fs.existsSync(dotenvFile);

if (!checkDotenvExists) {
	console.log("[Server]: .env file not found!");

	const dotenvExampleFile = `${dotenvFile}.example`;
	fs.copyFileSync(dotenvExampleFile, dotenvFile);
	console.log(
		"[Server]: Generated new .env file. Please change their credentials then run `npm run start`."
	);

	server.close(() => {
		console.log("[Server]: Server Closed");
		process.exit();
	});
}

dotenv.config({ path: dotenvFile });

export const nodePort = process.env.NODE_PORT || 3333;
