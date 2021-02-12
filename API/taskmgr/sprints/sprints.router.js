const { Router } = require("express");
const autorization = require("../../middlewares/authorization");
const asyncWrapper = require("../../../utils/asyncWrapper");
const SprintsControllers = require("./sprints.controllers");

const sprintsRouter = Router();

sprintsRouter.post(
  "/:projectId/create",
  autorization,
  asyncWrapper(SprintsControllers.createSprint)
);

sprintsRouter.delete(
  "/:projectId/:sprintId/remove",
  autorization,
  asyncWrapper(SprintsControllers.removeSprintfromProject)
);

module.exports = sprintsRouter;
