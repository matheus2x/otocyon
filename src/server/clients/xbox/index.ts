import axios from "axios";
import { xboxKey } from "../../../config/env";

const requestXboxAPI = async (xboxService: any, payload?: any) => {
	const xboxAPI = axios.create({
		baseURL: "https://xbl.io/api/v2",
		headers: { "X-Authorization": xboxKey },
	});

	console.log(xboxService, payload, xboxAPI);
};

export default requestXboxAPI;
