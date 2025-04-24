const Joi = require("joi");

const couponValidationSchema = Joi.object({
  code: Joi.string().max(20).required(), // Coupon code (max 20 characters)
  discount: Joi.number().min(0).max(100).required(), // Discount percentage (0-100)
  courseId: Joi.number().integer().optional(), // Optional course ID
  expiresAt: Joi.date().optional(), // Optional expiration date
  usageLimit: Joi.number().integer().min(0).optional(), // Optional usage limit (0 or more)
});
const applyCouponSchema = Joi.object({
    code: Joi.string().max(20).required(),
    coursePrice: Joi.number().min(0).required(),
    courseId: Joi.number().integer().required(), 
  });
  const validateCouponSchema=Joi.object({
    code: Joi.string().max(20).required(), 
    courseId: Joi.number().integer().required(), 
  });
  const validateIDSchema=Joi.object({
    id: Joi.number().integer().required(), 
  });
module.exports = {couponValidationSchema, applyCouponSchema, validateCouponSchema, validateIDSchema};