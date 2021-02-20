const { Router } = require("express");
const autorization = require("../../middlewares/authorization");
const asyncWrapper = require("../../../utils/asyncWrapper");
const TasksControllers = require("./tasks.controllers");
const {
  taskCreateValidation,
  taskTimeUpdateValidation,
  taskUpdateNameValidation,
} = require("./taskJoiValidation");

const tasksRouter = Router();

tasksRouter.post(
  "/:sprintId/create",
  taskCreateValidation,
  autorization,
  asyncWrapper(TasksControllers.createTask)
);

tasksRouter.delete(
  "/:sprintId/:taskId/remove",
  autorization,
  asyncWrapper(TasksControllers.removeTaskfromSprint)
);

tasksRouter.patch(
  "/:taskId/update-time",
  taskTimeUpdateValidation,
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
  taskUpdateNameValidation,
  autorization,
  asyncWrapper(TasksControllers.updateName)
);

tasksRouter.get(
  "/:sprintId",
  autorization,
  asyncWrapper(TasksControllers.getTasks)
);

module.exports = tasksRouter;
