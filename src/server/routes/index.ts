import { Server } from "restify";

import steamRoutes from "./steam.routes";

const routes = (server: Server) => {
	steamRoutes(server);
};

export default routes;
