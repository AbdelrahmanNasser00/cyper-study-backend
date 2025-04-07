const Joi = require("joi");

const registerSchema = Joi.object({
  firstname: Joi.string().min(3).max(20).required(),
  lastname: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .min(6)
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
  role: Joi.string().valid("student", "instructor").required(),
  bio: Joi.string(),
  profilePicture: Joi.string(),
});

module.exports = registerSchema;
