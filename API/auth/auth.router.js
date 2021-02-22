const { Router } = require("express");
const authorization = require("../middlewares/authorization");
const {
  registration,
  userLogin,
  userLogout,
  verifyEmail, resetPasswordRequest
} = require("../auth/auth.controller");

const { registerSchema, loginSchema } = require("./auth.validators");

const validator = require("../../helpers/joi.validation.handler");

const asyncWrapper = require("../../utils/asyncWrapper");

const authRouter = Router();

authRouter.post(
  "/register",
  validator(registerSchema),
  asynWrapper(registration)
);

authRouter.post("/login", validator(loginSchema), asyncWrapper(userLogin));

authRouter.post("/logout", authorization, asyncWrapper(userLogout));

authRouter.get("/verify/:verificationToken", asyncWrapper(verifyEmail));

authRouter.patch('/reset-password/request', asyncWrapper(resetPasswordRequest))

module.exports = authRouter;
