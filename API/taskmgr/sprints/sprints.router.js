const { Router } = require("express");
const autorization = require("../../../helpers/authorization");
const asyncWrapper = require("../../../utils/asyncWrapper");
const SprintsControllers = require('./sprints.controllers');

const sprintsRouter = Router();

sprintsRouter.post(
    '/create/:id',
    autorization,
    asyncWrapper(SprintsControllers.createSprint),
);

module.exports = sprintsRouter;