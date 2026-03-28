import Joi from 'joi'

export const envValidation = Joi.object({
  ENVIRONMENT: Joi.string().valid('local', 'production').required(),
  PORT: Joi.number().port().required(),
})
