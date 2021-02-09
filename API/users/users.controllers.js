const userModel = require("../users/users.model");
const { UnauthorizedError } = require("../../helpers/error.helpers");


class UsersControllers {
    async getCurrentUser(req, res, next) {
        try {
            const { email, projectIds } = req.user;
            return res.status(200).send({ email, projectIds })
        } catch(err) {
            next(err)
        }
    }
}


module.exports = new UserControllers();