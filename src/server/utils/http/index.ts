import { HttpResponse } from "./protocol";

export const okResponse = (body: any): HttpResponse => {
	return {
		code: 200,
		body,
	};
};

export const badRequest = (body: any): HttpResponse => {
	return {
		code: 400,
		body,
	};
};
