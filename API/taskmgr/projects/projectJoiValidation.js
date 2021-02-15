const Joi = require("joi");
const { JoiValidationError } = require("../../../helpers/error.helpers");

function projectCreateValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(1).email().required(),
    description: Joi.string().min(1).required(),
  });

  const result = schema.validate(req.body);

  const { message } = result.error;

  if (result.error) {
    throw new JoiValidationError(message);
  }
  next();
}

function projectUpdateNameValidation(req, res, next) {
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

function addParticipantToProjectValidation(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().min(6).email().required(),
  });

  const result = schema.validate(req.body);

  const { message } = result.error;

  if (result.error) {
    throw new JoiValidationError(message);
  }
  next();
}

module.exports = {
  projectCreateValidation,
  projectUpdateNameValidation,
  addParticipantToProjectValidation,
};
