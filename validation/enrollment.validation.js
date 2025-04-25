const Joi = require("joi");

const createOrderSchema = Joi.object({
  courseId: Joi.number().integer().required(),
  couponCode: Joi.string().optional(),
  provider: Joi.string().valid("paypal", "stripe", "fawry").required(),
});
module.exports = {
    createOrderSchema,
    };