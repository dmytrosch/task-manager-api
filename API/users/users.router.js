const { Router } = require("express");

const autorization = require("../middlewares/authorization");
const UsersControllers = require("./users.controllers");
const asyncWrapper = require("../../utils/asyncWrapper");

const userRouter = Router();

userRouter.get(
  "/current",
  autorization,
  asyncWrapper(UsersControllers.getCurrentUser)
);

module.exports = userRouter;
