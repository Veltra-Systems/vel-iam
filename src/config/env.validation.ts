import Joi from 'joi'

export const envValidation = Joi.object({
  ENVIRONMENT: Joi.string().valid('local', 'production').required(),
  PORT: Joi.number().port().required(),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
})
