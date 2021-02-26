const { Router } = require("express");
const authorization = require("../middlewares/authorization");
const {
  registration,
  userLogin,
  userLogout,
  verifyEmail,
  resetPasswordRequest,
  resetPassword,
} = require("../auth/auth.controller");

const {
  registerSchema,
  loginSchema,
  newPasswordSchema,
  emailSchema,
} = require("./auth.validators");

const validator = require("../../helpers/joi.validation.handler");

const asyncWrapper = require("../../utils/asyncWrapper");

const authRouter = Router();

authRouter.post(
  "/register",
  validator(registerSchema),
  asyncWrapper(registration)
);

authRouter.post("/login", validator(loginSchema), asyncWrapper(userLogin));

authRouter.post("/logout", authorization, asyncWrapper(userLogout));

authRouter.get("/verify/:verificationToken", asyncWrapper(verifyEmail));

authRouter.post(
  "/reset-password/request",
  validator(emailSchema),
  asyncWrapper(resetPasswordRequest)
);

authRouter.patch(
  "/reset-password/:resetPasswordToken",
  validator(newPasswordSchema),
  asyncWrapper(resetPassword)
);

module.exports = authRouter;
