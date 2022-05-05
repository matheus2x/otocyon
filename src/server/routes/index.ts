import { Server } from "restify";

import steamRoutes from "./steam.routes";
import xboxRoutes from "./xbox.routes";

const routes = (server: Server) => {
	steamRoutes(server);
	xboxRoutes(server);
};

export default routes;
