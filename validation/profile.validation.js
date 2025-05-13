const Joi = require("joi");

const updateProfileSchema = Joi.object({
  firstname: Joi.string().min(2).optional(),
  lastname: Joi.string().min(2).optional(),
  email: Joi.string().email().optional(),
  bio: Joi.string().allow("").optional(),
});

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
        "any.only": "Confirm password must match the new password",
        }),
});

const updateProfilePictureSchema = Joi.object({
  profilePicture: Joi.string().uri().required(),
});

module.exports = {
  updateProfileSchema,
  updatePasswordSchema,
  updateProfilePictureSchema,
};
