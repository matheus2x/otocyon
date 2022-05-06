import { Server } from "restify";

import xboxController from "../controllers/xboxController";

const xboxRoutes = (server: Server) => {
	server.get("/xbox", xboxController.base);
	server.get("/xbox/profile", xboxController.profile);
};

export default xboxRoutes;
