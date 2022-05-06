import { AxiosRequestConfig } from "axios";

export type XboxService = "account";

export type XboxServices = {
	[key in XboxService]: AxiosRequestConfig;
};
