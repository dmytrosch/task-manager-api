const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().min(6).email().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).email().required(),
  password: Joi.string().min(8).required(),
});
const newPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
});
const emailSchema = Joi.object({
  email: Joi.string().min(6).email().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  newPasswordSchema,
  emailSchema,
};
