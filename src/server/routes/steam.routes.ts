import { Server } from "restify";

import * as steamController from "../controllers/steamController";

const steamRoutes = (server: Server) => {
	server.get("/steam/profile", steamController.show);
};

export default steamRoutes;
