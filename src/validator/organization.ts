import * as Joi from 'joi';

/* createUser validation */
export const createSchema = Joi.object({
  profile: Joi.object({
    name: Joi.string().required(),
    logo: Joi.string().required(),
    cover: Joi.string().optional()
  }),
  agents: Joi.array().items({
    agentId: Joi.string().required(),
    name: Joi.string().required(),
    url: Joi.string().uri()
  }),
  users: Joi.array().items({
    userId: Joi.string().required(),
    userName: Joi.string().required(),
    avatar: Joi.string().required(),
    email: Joi.string().required()
  })
});

export const updateSchema = Joi.object({
  profile: Joi.object({
    name: Joi.string(),
    logo: Joi.string(),
    cover: Joi.string().optional()
  }),
  agents: Joi.array().items({
    agentId: Joi.string(),
    name: Joi.string(),
    url: Joi.string().uri()
  }),
  users: Joi.array().items({
    userId: Joi.string(),
    userName: Joi.string(),
    avatar: Joi.string(),
    email: Joi.string()
  })
});
