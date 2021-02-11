const projectModel = require("./projects.model");
const userModel = require("../../users/users.model");
const {
  Types: { ObjectId },
} = require("mongoose");

const { ConflictError } = require("../../../helpers/error.helpers");

class ProjectsControllers {
  async createProject(req, res) {
    const { user, body } = req;
    const { name, description } = body;

    const newProject = new projectModel({
      name,
      description,
      owner: user._id,
      participantsIds: [user._id],
    });
    // const project = await userModel.findOne({
    //   _id: { $in: partic },
    // })
    // if (project) {
    //   throw new ConflictError('Project is exist')
    // }
    await newProject.save();
    await user.addProject(newProject._id);

    res.status(201).send({
      id: newProject._id,
      name: newProject.name,
      description: newProject.description,
    });
  }

  async currentProject(req, res) {
    const { projectId } = req.params;
    const user = req.user;
    const _id = ObjectId(projectId);

    const [result] = await projectModel.aggregate([
      {
        $match: { _id },
      },
      {
        $lookup: {
          from: "users",
          localField: "participantsIds",
          foreignField: "_id",
          as: "participants",
        },
      },
      { $unset: ["participantsIds"] },
      {
        $project: {
          name: 1,
          description: 1,
          participants: {
            email: 1,
          },
        }
      }
    ]);

    return res.status(200).send(result);
  }

  async addUserToProject(req, res) {
    const { email } = req.body;
    const { projectId } = req.params;

    const userToAdd = await userModel.userByEmail(email);
    if (!userToAdd) {
      return res.status(404).json({ message: "User is not found" });
    }

    const isProjectExist = userToAdd.projectIds.some((item) => {
      const idToString = item.toString();

      return idToString === projectId;
    });

    if (isProjectExist) {
      throw new ConflictError("User already in project");
    }
    await userToAdd.addProject(projectId);
    await projectModel.addUserToProject(projectId, userToAdd._id);
    return res.status(200).send();
  }

  async removeProject(req, res) {
    const { projectId } = req.params;
    const { user } = req;

    const project = user.projectIds.find((project) => project == projectId);
    if (!project) {
      return res.status(404).json({ message: "Project is not found!" });
    }
    await user.removeProjectId(project);
    await projectModel.removeProjectFromColletion(project);
    await userModel.removeProjectFromParticipants(projectId);

    return res.status(204).json({ message: "deleted" });
  }

  async updateName(req, res) {
    const { projectId } = req.params;
    const { name } = req.body;

    const updatedProject = await projectModel.updateProjectName(
      projectId,
      name
    );

    return res.status(200).send({
      id: updatedProject._id,
      name: updatedProject.name,
      description: updatedProject.description,
    });
  }
}

module.exports = new ProjectsControllers();
