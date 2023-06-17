import * as Joi from 'joi';

/* Id validation */
export const idSchema = Joi.object({
  id: Joi.string().required()
});
