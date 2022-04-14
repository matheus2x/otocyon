import Joi from "joi";

const payloadSchema = Joi.object({
	steamProfileID: Joi.string().required(),
	steamGameID: Joi.string().required(),
});

export default payloadSchema;
