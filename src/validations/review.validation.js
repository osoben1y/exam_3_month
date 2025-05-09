import Joi from 'joi';

export const reviewValidator = (data) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;

  const review = Joi.object({
    user: Joi.string().pattern(objectIdPattern).required(),
    course: Joi.string().pattern(objectIdPattern).required(),
    rating: Joi.string().valid('1', '2', '3', '4', '5').required(),
    comment: Joi.string().max(500).required(),
  });

  return review.validate(data);
};
