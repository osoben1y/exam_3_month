import Joi from 'joi';

export const reviewValidator = (data) => {
  const review = Joi.object({
    user: Joi.string().required(),
    course: Joi.string().required(),
    rating: Joi.string().required(),
    comment: Joi.string().max(500).required(),
  });

  return review.validate(data);
};
