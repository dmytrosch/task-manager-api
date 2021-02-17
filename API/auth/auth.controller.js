const userModel = require("../../API/users/users.model");
const {
  ConflictError,
  UnauthorizedError,
} = require("../../helpers/error.helpers");
const uuid = require('uuid');
const path = require('path');

const sendEmailVerification = require("../../utils/send.email.verification");

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

  const verificationToken = uuid.v4();

  await user.createVerificationToken(verificationToken);

  await sendEmailVerification(user.email, verificationToken);

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

  if(user.verificationToken !== null){
    throw new UnauthorizedError("Email is not verified!");
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

async function verifyEmail(req, res) {
  const { verificationToken } = req.params;

  const verifiedUser = await userModel.findByVerificationToken(
    verificationToken
  );

  if (!verifiedUser) {
    return res.status(404).sendFile(path.join(__dirname, '../../static/html/404.html'));
  }

  await verifiedUser.removeVerificationToken();

  return res.status(200).sendFile(path.join(__dirname, '../../static/html/redirect.html'));
}

module.exports = {
  registration,
  userLogin,
  userLogout,
  verifyEmail,
};
