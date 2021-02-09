const { Router } = require("express");
const authorization = require("../../helpers/authorization");

const {
  validateUserRegistration,
  validateUserLogin,
} = require("./auth.validators");

const authRouter = Router();

authRouter.post("/register", (req, res) => {
  return res.status(201).json({ message: "register" });
});

authRouter.post("/login", (req, res) => {
  return res.status(201).json({ message: "login" });
});

authRouter.post("/logout", authorization, (req, res) => {
  return res.status(201).json({ message: "logout" });
});

module.exports = authRouter;
