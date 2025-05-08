import Joi from 'joi';

export const categoryValidator = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(255),
  });
  return schema.validate(data);
};
