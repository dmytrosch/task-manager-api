const Joi = require("joi");

function sprintCreateValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(1).email().required(),
    startAt: Joi.string().min(6).required(),
    finishedAt: Joi.string().min(6).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
}

function sprintUpdateNameValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(1).email().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
}

module.exports = { sprintCreateValidation, sprintUpdateNameValidation };
