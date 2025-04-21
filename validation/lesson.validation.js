const Joi = require("joi");

const lessonSchema = Joi.object({
  courseId: Joi.number().integer().required(),
  title: Joi.string().required(),
  videoUrl: Joi.string().uri().optional(),
  content: Joi.string().optional(),
  order: Joi.number().integer().required(),
  duration: Joi.number().integer().optional(),
  isPreview: Joi.boolean().optional(),
});
module.exports = lessonSchema;