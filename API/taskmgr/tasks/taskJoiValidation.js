const Joi = require("joi");

const taskCreateSchema = Joi.object({
  name: Joi.string().min(1).required(),
  plannedTime: Joi.number().required(),
});

const taskUpdateNameSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

const taskTimeUpdateSchema = Joi.object({
  hours: Joi.number(),
});

module.exports = {
  taskCreateSchema,
  taskUpdateNameSchema,
  taskTimeUpdateSchema,
};
