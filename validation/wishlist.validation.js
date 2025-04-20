const Joi = require("joi");

const wishlistSchema = Joi.object({
  courseId: Joi.number().integer().required(),
});

module.exports = wishlistSchema;
