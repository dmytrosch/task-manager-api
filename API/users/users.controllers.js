class UsersControllers {
    async getCurrentUser(req, res, next) {
        const { email, projectIds } = req.user;
        return res.status(200).send({ email, projectIds })
}
}


module.exports = new UsersControllers();