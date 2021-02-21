const Joi = require("joi");

const projectCreateSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
});

const projectUpdateNameSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

const addParticipantToProjectSchema = Joi.object({
  email: Joi.string().min(6).email().required(),
});

module.exports = {
  projectCreateSchema,
  projectUpdateNameSchema,
  addParticipantToProjectSchema,
};
