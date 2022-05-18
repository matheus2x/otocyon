import server from "./server";
import { env } from "./config";

server.pre((req, res, next) => {
	console.log(req.method, req.url);
	next();
});

server.listen(env.nodePort, () => {
	console.log(`[Server]: Server Online - Listening on ${env.nodePort}`);
});
