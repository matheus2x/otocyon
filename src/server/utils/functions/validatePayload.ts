import { ObjectSchema, ValidationError } from "joi";

export const validatePayload = async (
	payload: any,
	payloadSchema: ObjectSchema
) => {
	try {
		const validatedPayload = await payloadSchema.validateAsync(payload);
		validatedPayload.valid = true;

		return validatedPayload;
	} catch (error) {
		console.log(error);

		const defaultMsg = "Wrong Field Detected";
		const errorResponse = {
			msg: defaultMsg,
		};

		if (error instanceof ValidationError) {
			errorResponse.msg = error.details.map((error) => error.message).join("");
		}

		return { valid: false, errorMsg: errorResponse.msg };
	}
};
