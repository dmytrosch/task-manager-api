const Joi = require("joi");
const { JoiValidationError } = require("../../helpers/error.helpers");

function validateUserRegistration(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(8).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    const { message } = result.error;
    throw new JoiValidationError(message);
  }
  next();
}

function validateUserLogin(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(8).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    const { message } = result.error;
    throw new JoiValidationError(message);
  }
  next();
}

module.exports = {
  validateUserRegistration,
  validateUserLogin,
};
