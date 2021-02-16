const { Router } = require("express");
const authorization = require("../middlewares/authorization");
const {
  registration,
  userLogin,
  userLogout,
  verifyEmail,
} = require("../auth/auth.controller");

const {
  validateUserRegistration,
  validateUserLogin,
} = require("./auth.validators");

const asynWrapper = require("../../utils/asyncWrapper");
const asyncWrapper = require("../../utils/asyncWrapper");

const authRouter = Router();

authRouter.post(
  "/register",
  validateUserRegistration,
  asynWrapper(registration)
);

authRouter.post("/login", validateUserLogin, asynWrapper(userLogin));

authRouter.post("/logout", authorization, asynWrapper(userLogout));

authRouter.get('/verify/:verificationToken', asyncWrapper(verifyEmail));

module.exports = authRouter;
