const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(500).optional(),
});

module.exports = categorySchema;