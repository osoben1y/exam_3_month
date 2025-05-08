import Joi from 'joi';

export const userValidator = (data) => {
  const user = Joi.object({
    fullName: Joi.string().min(4).max(25).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return user.validate(data);
};
