const jwt = require("jsonwebtoken");
const userModel = require("../users/users.model");
const { UnauthorizedError } = require("../../helpers/error.helpers");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const [_, token] = header.split(" ");
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error();
    }

    req.user = user;
  } catch (error) {
    next(new UnauthorizedError("Authorization failed"));
  }

  next();
};
