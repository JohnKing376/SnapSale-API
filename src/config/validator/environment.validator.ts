import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production', 'staging')
    .default('development'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_USERNAME: Joi.string().required(),
  BUSINESS_MAIL: Joi.string().required(),
  BUSINESS_NAME: Joi.string().required(),
  OTP_TOKEN_TTL: Joi.number().required(),
  QUEUE_HOST: Joi.string().required(),
  QUEUE_PORT: Joi.number().required(),
});
