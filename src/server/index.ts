import restify from "restify";
import routes from "./routes";

const server = restify.createServer();

server.use(restify.plugins.queryParser({ mapParams: true, allowDots: true }));
server.use(restify.plugins.bodyParser({ mapParams: false }));
server.use(restify.plugins.fullResponse());

routes(server);

export default server;
