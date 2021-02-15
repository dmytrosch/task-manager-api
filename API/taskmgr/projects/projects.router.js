const { Router } = require("express");
const asyncWrapper = require("../../../utils/asyncWrapper");
const ProjectsControllers = require("./projects.controllers");
const authorization = require("../../middlewares/authorization");
const {
  projectCreateValidation,
  projectUpdateNameValidation,
  addParticipantToProjectValidation,
} = require("./projectJoiValidation");

const projectsRouter = Router();

projectsRouter.post(
  "/create",
  projectCreateValidation,
  authorization,
  asyncWrapper(ProjectsControllers.createProject)
);

projectsRouter.patch(
  "/:projectId/add-participant",
  addParticipantToProjectValidation,
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
  projectUpdateNameValidation,
  authorization,
  asyncWrapper(ProjectsControllers.updateName)
);

projectsRouter.get(
  "/:projectId",
  authorization,
  asyncWrapper(ProjectsControllers.currentProject)
);

module.exports = projectsRouter;
