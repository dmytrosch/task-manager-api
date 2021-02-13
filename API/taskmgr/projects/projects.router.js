const { Router } = require("express");
const asyncWrapper = require("../../../utils/asyncWrapper");
const ProjectsControllers = require("./projects.controllers");
const authorization = require("../../middlewares/authorization");

const projectsRouter = Router();

projectsRouter.post(
  "/create",
  authorization,
  asyncWrapper(ProjectsControllers.createProject)
);

projectsRouter.patch(
  "/:projectId/add-participant",
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
  authorization,
  asyncWrapper(ProjectsControllers.updateName)
);

projectsRouter.get(
  "/:projectId",
  authorization,
  asyncWrapper(ProjectsControllers.currentProject)
);

module.exports = projectsRouter;
