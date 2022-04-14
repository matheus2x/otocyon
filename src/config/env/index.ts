import * as dotenv from "dotenv";
import path from "path";

const dotenvFile = path.resolve(__dirname, "..", "..", "..", ".env");

dotenv.config({ path: dotenvFile });

export const nodePort = process.env.NODE_PORT || 3333;
export const steamKey = process.env?.STEAM_KEY;
