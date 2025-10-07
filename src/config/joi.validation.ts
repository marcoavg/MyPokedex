import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGO_DB: Joi.string().uri().required(),
  PORT: Joi.number().default(3000),
  DEFAULT_LIMIT: Joi.number().min(1).default(10)
});