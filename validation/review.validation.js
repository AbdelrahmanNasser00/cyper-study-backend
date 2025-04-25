const Joi = require("joi");

const reviewSchema = Joi.object({
  courseId: Joi.number().integer().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(1000),
});

module.exports = reviewSchema;
