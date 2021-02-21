const { Router } = require("express");
const authorization = require("../../middlewares/authorization");
const asyncWrapper = require("../../../utils/asyncWrapper");
const SprintsControllers = require("./sprints.controllers");
const {
  sprintCreateSchema,
  sprintUpdateNameSchema,
} = require("./sprintJoiValidation");

const validator = require("../../../helpers/joi.validation.handler");

const sprintsRouter = Router();

sprintsRouter.post(
  "/:projectId/create",
  validator(sprintCreateSchema),
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
  validator(sprintUpdateNameSchema),
  authorization,
  asyncWrapper(SprintsControllers.updateName)
);

module.exports = sprintsRouter;
