const { Router } = require("express");
const autorization = require("../../middlewares/authorization");
const asyncWrapper = require("../../../utils/asyncWrapper");
const SprintsControllers = require("./sprints.controllers");

const sprintsRouter = Router();

sprintsRouter.post(
  "/create/:id",
  autorization,
  asyncWrapper(SprintsControllers.createSprint)
);

module.exports = sprintsRouter;
