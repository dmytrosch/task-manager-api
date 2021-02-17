const Joi = require("joi");
const { JoiValidationError } = require("../../../helpers/error.helpers");

function sprintCreateValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    startAt: Joi.string().min(6).required(),
    finishedAt: Joi.string().min(6).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    const { message } = result.error;
    throw new JoiValidationError(message);
  }
  next();
}

function sprintUpdateNameValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    const { message } = result.error;
    throw new JoiValidationError(message);
  }
  next();
}

module.exports = { sprintCreateValidation, sprintUpdateNameValidation };
