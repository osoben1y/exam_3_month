import Joi from 'joi';

export const courseValidator = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(255).required(),
    duration: Joi.string().required(),
    price: Joi.string().required(),
    author: Joi.string().required(),
    category: Joi.string().required(),
  });
  return schema.validate(data);
};
