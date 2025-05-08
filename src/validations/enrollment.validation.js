import Joi from 'joi';

export const enrollmentValidator = (data) => {
  const enrollment = Joi.object({
    user: Joi.string().required(),
    course: Joi.string().required(),
  });
  return enrollment.validate(data);
};
