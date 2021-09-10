import { Server } from "restify";

import * as steamController from "../controllers/steamController";

const steamRoutes = (server: Server) => {
	server.get("/steam", steamController.index);
};

export default steamRoutes;
