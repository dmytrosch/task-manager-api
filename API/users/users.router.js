const { Router } = require("express");

const autorization = require("../../helpers/authorization");
const UsersControllers = require("./users.controllers");
const asyncWrapper = require("../../utils/asyncWrapper");

const userRouter = Router();

userRouter.get(
  "/current",
  autorization,
  asyncWrapper(UsersControllers.getCurrentUser)
);

module.exports = userRouter;
