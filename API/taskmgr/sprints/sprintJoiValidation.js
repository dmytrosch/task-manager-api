const Joi = require("joi");
const { JoiValidationError } = require("../../../helpers/error.helpers");

function sprintCreateValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(1).email().required(),
    startAt: Joi.string().min(6).required(),
    finishedAt: Joi.string().min(6).required(),
  });

  const result = schema.validate(req.body);

  const { message } = result.error;

  if (result.error) {
    throw new JoiValidationError(message);
  }
  next();
}

function sprintUpdateNameValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(1).email().required(),
  });

  const result = schema.validate(req.body);

  const { message } = result.error;

  if (result.error) {
    throw new JoiValidationError(message);
  }
  next();
}

module.exports = { sprintCreateValidation, sprintUpdateNameValidation };
