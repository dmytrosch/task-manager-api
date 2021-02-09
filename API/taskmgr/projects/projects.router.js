const { Router } = require("express");
const autorization = require("../../../helpers/authorization");
const asyncWrapper = require("../../../utils/asyncWrapper");
const ProjectsControllers = require('./projects.controllers');

const projectsRouter = Router();

projectsRouter.post(
    '/create',
    autorization,
    asyncWrapper(ProjectsControllers.setOwner),
);

// projectsRouter.patch(
//     '/add-participant',
//     autorization,
// )

module.exports = projectsRouter;