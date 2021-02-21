const { Router } = require("express");
const autorization = require("../../middlewares/authorization");
const asyncWrapper = require("../../../utils/asyncWrapper");
const TasksControllers = require("./tasks.controllers");
const {
  taskCreateSchema,
  taskUpdateNameSchema,
  taskTimeUpdateSchema,
} = require("./taskJoiValidation");

const validator = require("../../../helpers/joi.validation.handler");

const tasksRouter = Router();

tasksRouter.post(
  "/:sprintId/create",
  validator(taskCreateSchema),
  autorization,
  asyncWrapper(TasksControllers.createTask)
);

tasksRouter.delete(
  "/:sprintId/:taskId/remove",
  autorization,
  asyncWrapper(TasksControllers.removeTaskfromSprint)
);

tasksRouter.patch(
  "/:taskId/:dateId/update-time",
  validator(taskTimeUpdateSchema),
  autorization,
  asyncWrapper(TasksControllers.updateSpendedTime)
);

tasksRouter.get(
  "/:sprintId/:taskName",
  autorization,
  asyncWrapper(TasksControllers.searchByName)
);

tasksRouter.patch(
  "/:taskId/change-name",
  validator(taskUpdateNameSchema),
  autorization,
  asyncWrapper(TasksControllers.updateName)
);

module.exports = tasksRouter;
