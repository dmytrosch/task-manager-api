const { Router } = require("express");
const authorization = require("../../middlewares/authorization");
const asyncWrapper = require("../../../utils/asyncWrapper");
const SprintsControllers = require("./sprints.controllers");

const sprintsRouter = Router();

sprintsRouter.post(
  "/:projectId/create",
  authorization,
  asyncWrapper(SprintsControllers.createSprint)
);

sprintsRouter.delete(
  "/:projectId/:sprintId/remove",
  authorization,
  asyncWrapper(SprintsControllers.removeSprintfromProject)
);


sprintsRouter.get(
  "/:sprintId",
  authorization,
  asyncWrapper(SprintsControllers.currentSprint)
);


sprintsRouter.patch(
  "/:sprintId/change-name",
  authorization,
  asyncWrapper(SprintsControllers.updateName)
);

module.exports = sprintsRouter;
