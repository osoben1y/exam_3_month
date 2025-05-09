import Joi from 'joi';

export const enrollmentValidator = (data) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;

  const enrollment = Joi.object({
    user: Joi.string().pattern(objectIdPattern).required(),
    course: Joi.string().pattern(objectIdPattern).required(),
  });

  return enrollment.validate(data);
};
