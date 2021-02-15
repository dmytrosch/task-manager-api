const Joi = require("joi");

function taskCreateValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(1).email().required(),
    plannedTime: Joi.number().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
}

function taskTimeUpdateValidation(req, res, next) {
  const schema = Joi.object({
    spendedTime: Joi.number(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
}

module.exports = {
  taskCreateValidation,
  taskTimeUpdateValidation,
};
