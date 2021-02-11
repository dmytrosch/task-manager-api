const projectModel = require("./projects.model");
const userModel = require("../../users/users.model");

const { ConflictError } = require("../../../helpers/error.helpers");

class ProjectsControllers {
  async setOwner(req, res, next) {
    const { user, body } = req;
    const { name, description } = body;

    const newProject = new projectModel({
      name,
      description,
      owner: user._id,
      participants: [user._id],
    });
    // const project = await userModel.findOne({
    //   _id: { $in: partic },
    // })
    // if (project) {
    //   throw new ConflictError('Project is exist')
    // }

    await newProject.save();

    await user.addProject(newProject._id);

    res.status(201).json({ name, description });
  }

  async addUserToProject(req, res) {
    const { email } = req.body;
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);
    if (!project) {
      res.status(404).json({ message: "Project is not found" });
      return;
    }

    const userToAdd = await userModel.userByEmail(email);
    if (!userToAdd) {
      res.status(404).json({ message: "User is not found" });
      return;
    }

    const isProjectExist = userToAdd.projectIds.some((item) => {
      const idToString = item.toString();

      return idToString === projectId;
    });

    if (isProjectExist) {
      throw new ConflictError("User already in project");
    }
    await userToAdd.addProject(projectId);
    await project.addUserToProject(userToAdd._id);
    res.status(200).send();
  }
}

module.exports = new ProjectsControllers();
