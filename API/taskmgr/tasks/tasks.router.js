const { Router } = require("express");
const autorization = require("../../middlewares/authorization");
const asyncWrapper = require("../../../utils/asyncWrapper");
const TasksControllers = require("./tasks.controllers");

const tasksRouter = Router();

tasksRouter.post(
  "/create/:id",
  autorization,
  asyncWrapper(TasksControllers.createTask)
);

module.exports = tasksRouter;
