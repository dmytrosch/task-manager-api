const { Router } = require("express");
const authorization = require("../../helpers/authorization");
const {
  registration,
  userLogin,
  userLogout,
} = require("../auth/auth.controller");

const {
  validateUserRegistration,
  validateUserLogin,
} = require("./auth.validators");

const asynWrapper = require("../../utils/asyncWrapper");

const authRouter = Router();

authRouter.post(
  "/register",
  validateUserRegistration,
  asynWrapper(registration)
);

authRouter.post("/login", validateUserLogin, asynWrapper(userLogin));

authRouter.post("/logout", authorization, asynWrapper(userLogout));

module.exports = authRouter;
