const projectModel = require("./projects.model");
const userModel = require("../../users/users.model");

const {ConflictError} = require('../../../helpers/error.helpers');

class ProjectsControllers {
  async setOwner(req, res) {
    const { _id: projectOwner } = req.user;
    const { name, description } = req.body;

    const newProject = new projectModel({
      name,
      description,
      owner: projectOwner,
      participants: [projectOwner],
    });

    await newProject.save();

    await userModel.addProject(projectOwner, newProject._id);

    return res.status(201).send({ data: { name, description } });
  }

  async addUserToProject(req, res) {
    const { email } = req.body;
    const { projectId } = req.params;

    const userToAdd = await userModel.userByEmail(email);

    const isProjectExist = userToAdd.projectIds.some((item) => {
      const idToString = item.toString();

      return idToString === projectId;
    });

    if (isProjectExist) {
      throw new ConflictError("User already in project");
    }
    await userModel.addToProject(userToAdd._id, projectId);
    await projectModel.addUserToProject(projectId, userToAdd._id);
    return res.status(200).send();
  }
}



module.exports = new ProjectsControllers();
