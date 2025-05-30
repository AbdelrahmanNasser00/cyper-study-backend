const Joi = require("joi");

const createOrderSchema = Joi.object({
  courseIds: Joi.array().required(),
  coupons: Joi.optional(),
  provider: Joi.string().valid("paypal", "stripe", "fawry").required(),
});
module.exports = {
    createOrderSchema,
    };