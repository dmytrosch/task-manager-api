const Joi = require("joi");

function projectCreateValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(1).email().required(),
    description: Joi.string().min(1).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
}

function projectUpdateNameValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(1).email().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
}

function addParticipantToProjectValidation(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().min(6).email().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
}

module.exports = {
  projectCreateValidation,
  projectUpdateNameValidation,
  addParticipantToProjectValidation,
};
