const projectModel = require('../taskmgr/projects/projects.model');

class UsersControllers {
  async getCurrentUser(req, res, next) {
    const { email, projectIds } = req.user;

    const userProjects = await Promise.all(projectIds.map(async projectId => {
        const {_id: id, name, description, owner} = await projectModel.getProjectById(projectId);
        return {id, name, description, ownerId: owner};
    }));

    return res.status(200).send({ email, userProjects });
  }
}

module.exports = new UsersControllers();