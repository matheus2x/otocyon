import { Server } from "restify";

import steamController from "../controllers/steamController";

const steamRoutes = (server: Server) => {
	server.get("/steam", steamController.base);
	server.get("/steam/getProfileData", steamController.getProfileData);
	server.get("/steam/getPlatinumGameData", steamController.getPlatinumGameData);
};

export default steamRoutes;
