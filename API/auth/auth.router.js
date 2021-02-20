const { Router } = require("express");
const authorization = require("../middlewares/authorization");
const {
  registration,
  userLogin,
  userLogout,
  verifyEmail,
} = require("../auth/auth.controller");

const { registerSchema, loginSchema } = require("./auth.validators");

const validator = require("../../helpers/joi.validation.handler");

const asynWrapper = require("../../utils/asyncWrapper");
const asyncWrapper = require("../../utils/asyncWrapper");

const authRouter = Router();

authRouter.post(
  "/register",
  validator(registerSchema),
  asynWrapper(registration)
);

authRouter.post("/login", validator(loginSchema), asynWrapper(userLogin));

authRouter.post("/logout", authorization, asynWrapper(userLogout));

authRouter.get("/verify/:verificationToken", asyncWrapper(verifyEmail));

module.exports = authRouter;
