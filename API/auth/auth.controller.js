const userModel = require("../../API/users/users.model");
const {
  ConflictError,
  UnauthorizedError,
} = require("../../helpers/error.helpers");

async function registration(req, res) {
  const { email, password } = req.body;

  const existingUser = await userModel.userByEmail(email);
  if (existingUser) {
    throw new ConflictError("This email is already used");
  }

  const passwordHash = await userModel.brcPassHash(password);

  const user = new userModel({
    email: req.body.email,
    password: passwordHash,
  });

  await user.save();

  return res.status(201).json({
    message: "User succssuly registraited",
  });
}

async function userLogin(req, res) {
  const { email, password } = req.body;

  const user = await userModel.userByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Wrong credentials");
  }

  const token = await user.checkUser(password);

  return res.status(200).json({
    token,
    user: {
      id: user._id,
      email: user.email,
    },
  });
}

async function userLogout(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(400).json({ message: "Not found" });
  }
  const userToBeLoguot = await user.updateToken("");
  if (!userToBeLoguot) {
    return res.status(400).json({ message: "Not found" });
  }

  return res.status(204).send();
}

module.exports = {
  registration,
  userLogin,
  userLogout,
};
