const { Router } = require("express");
const asyncWrapper = require("../../../utils/asyncWrapper");
const ProjectsControllers = require("./projects.controllers");
const authorization = require("../../middlewares/authorization");
const {
  projectCreateSchema,
  projectUpdateNameSchema,
  addParticipantToProjectSchema,
  projectUpdateDescriptionSchema,
} = require("./projectJoiValidation");

const validator = require("../../../helpers/joi.validation.handler.js");

const projectsRouter = Router();

projectsRouter.post(
  "/create",
  validator(projectCreateSchema),
  authorization,
  asyncWrapper(ProjectsControllers.createProject)
);

projectsRouter.patch(
  "/:projectId/add-participant",
  validator(addParticipantToProjectSchema),
  authorization,
  asyncWrapper(ProjectsControllers.addUserToProject)
);

projectsRouter.delete(
  "/:projectId/remove",
  authorization,
  asyncWrapper(ProjectsControllers.removeProject)
);

projectsRouter.patch(
  "/:projectId/change-name",
  validator(projectUpdateNameSchema),
  authorization,
  asyncWrapper(ProjectsControllers.updateName)
);
projectsRouter.patch(
  "/:projectId/change-description",
  authorization,
  validator(projectUpdateDescriptionSchema),
  asyncWrapper(ProjectsControllers.updateDescription)
);

projectsRouter.get(
  "/:projectId",
  authorization,
  asyncWrapper(ProjectsControllers.currentProject)
);

module.exports = projectsRouter;
