const Joi = require("joi");

const sprintCreateSchema = Joi.object({
  name: Joi.string().min(1).required(),
  startAt: Joi.string().min(6).required(),
  finishedAt: Joi.string().min(6).required(),
});

const sprintUpdateNameSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

module.exports = { sprintCreateSchema, sprintUpdateNameSchema };
