const Joi = require("joi");

const courseSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().precision(2).min(0).default(0),
  categoryId: Joi.number().integer().required(),
  // instructorId: Joi.number().integer().required(),
  thumbnail: Joi.string().uri().optional(),
  level: Joi.string().valid("beginner", "intermediate", "advanced").optional(),
  duration: Joi.number().integer().min(1).optional(),
  isPublished: Joi.boolean().default(false),
});

module.exports = courseSchema;
