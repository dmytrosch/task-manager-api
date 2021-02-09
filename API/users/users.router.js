const { Router } = require("express");

const autorization = require("../../helpers/authorization");
const UsersControllers = require("./users.controllers");

const userRouter = Router();

userRouter.get("/current", autorization, UsersControllers.getCurrentUser)


module.exports = userRouter;