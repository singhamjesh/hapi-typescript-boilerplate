import * as Joi from 'joi';

/* Agent response schema validation */
export const createSchema = Joi.object({
  url: Joi.string().uri().required(),
  agentId: Joi.string().required()
});

/* Update schema validation */
export const updateSchema = Joi.object({
  anyFieldsName: Joi.any()
}).unknown();

/* Webhook schema validation */
export const webhookSchema = Joi.object({
  id: Joi.string().required(),
  response: Joi.object({
    statusCode: Joi.number(),
    statusType: Joi.string(),
    data: Joi.object(),
    message: Joi.string()
  })
});

/* Get agents schema validation */
export const agentParams = Joi.object({
  agentName: Joi.string()
    .valid('agent_00', 'agent_01', 'agent_01', 'agrnt_02', 'agent_03')
    .required()
});
