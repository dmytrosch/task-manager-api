const Joi = require("joi");

function validateUserRegistration(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().min(1).email().required(),
    password: Joi.string().min(1).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
}

function validateUserLogin(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().min(1).email().required(),
    password: Joi.string().min(1).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
}

module.exports = {
  validateUserRegistration,
  validateUserLogin,
};
