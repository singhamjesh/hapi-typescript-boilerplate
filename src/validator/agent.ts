import * as Joi from 'joi';

/* create agent schema validation */
export const agentsSchema = Joi.object({
  color: Joi.string().required(),
  name: Joi.string().required(),
  label: Joi.string().required(),
  url: Joi.string().uri()
});

/* update agent schema validation */
export const updateSchema = Joi.object({
  anyFieldsName: Joi.any()
}).unknown();
