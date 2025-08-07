import * as Joi from 'joi';

export const validationSchema = Joi.object({
  MONGO_URI: Joi.string().required().label('MONGO_URI is required'),
  JWT_SECRET: Joi.string().required().label('JWT SECRET is required'),
});