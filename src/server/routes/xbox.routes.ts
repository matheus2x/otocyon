import { Server } from "restify";

import xboxController from "../controllers/xboxController";

const xboxRoutes = (server: Server) => {
	server.get("/xbox", xboxController.base);
};

export default xboxRoutes;
