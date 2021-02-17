const Joi = require("joi");
const { JoiValidationError } = require("../../../helpers/error.helpers");

function taskCreateValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    plannedTime: Joi.number().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    const { message } = result.error;
    throw new JoiValidationError(message);
  }
  next();
}

function taskTimeUpdateValidation(req, res, next) {
  const schema = Joi.object({
    hours: Joi.number(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    const { message } = result.error;
    throw new JoiValidationError(message);
  }
  next();
}

module.exports = {
  taskCreateValidation,
  taskTimeUpdateValidation,
};
