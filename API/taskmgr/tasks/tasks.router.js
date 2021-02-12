const { Router } = require("express");
const autorization = require("../../middlewares/authorization");
const asyncWrapper = require("../../../utils/asyncWrapper");
const TasksControllers = require("./tasks.controllers");

const tasksRouter = Router();

tasksRouter.post(
  ":sprintId/create/",
  autorization,
  asyncWrapper(TasksControllers.createTask)
);

module.exports = tasksRouter;
