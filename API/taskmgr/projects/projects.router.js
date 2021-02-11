const { Router } = require("express");
const autorization = require("../../middlewares/authorization");
const asyncWrapper = require("../../../utils/asyncWrapper");
const ProjectsControllers = require("./projects.controllers");
const authorization = require("../../middlewares/authorization");

const projectsRouter = Router();

projectsRouter.post(
  "/create",
  autorization,
  asyncWrapper(ProjectsControllers.createProject)
);

projectsRouter.patch(
  "/:projectId/add-participant",
  autorization,
  asyncWrapper(ProjectsControllers.addUserToProject)
);

projectsRouter.delete(
  "/:projectId/remove",
  autorization,
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
