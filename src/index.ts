import server from "./server";
import { env } from "./config";

server.listen(env.nodePort, () => {
	console.log(`[Server]: Server Online - Listening on ${env.nodePort}`);
});
