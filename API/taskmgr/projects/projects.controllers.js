const projectModel = require("./projects.model");
const userModel = require("../../users/users.model");
const sprintModel = require("../sprints/sprints.model");
const taskModel = require("../tasks/tasks.model");
const {
  Types: { ObjectId },
  Promise,
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

    const project = await projectModel.findById(projectId);

    const isOwner =
      project.owner.toString() === user._id.toString() ? true : false;

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
        $lookup: {
          from: "sprints",
          localField: "sprintsIds",
          foreignField: "_id",
          as: "sprints",
        },
      },
      { $unset: ["sprintsIds"] },
      {
        $project: {
          name: 1,
          description: 1,
          participants: {
            email: 1,
          },
          sprints: {
            _id: 1,
            name: 1,
            startAt: 1,
            finishedAt: 1,
          },
        },
      },
    ]);

    return res.status(200).send({ ...result, isOwner });
  }

  async addUserToProject(req, res) {
    const { email } = req.body;
    const { projectId } = req.params;

    const userToAdd = await userModel.userByEmail(email);
    if (!userToAdd) {
      return res.status(404).json({ message: "User is not found" });
    }

    const isProjectExist = userToAdd.projectIds.find((item) => {
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

    const sprints = await sprintModel.find(
      {},
      {
        owner: project,
      }
    );

    let tasksIds = [];
    sprints.forEach(async (item) => {
      const sprintItem = await sprintModel.findById(item);
      const [allTasksIds] = sprintItem.tasksIds;
      if (!allTasksIds) {
        return;
      }
      tasksIds.push(allTasksIds);

      return tasksIds;
    });
    const tasks = await taskModel.find({}, tasksIds);

    await taskModel.deleteMany({}, { _id: tasks._id });

    await sprintModel.deleteMany({}, { _id: sprints });

    await user.removeProjectId(project);
    await projectModel.removeProjectFromColletion(project);
    await userModel.removeProjectFromParticipants(projectId);

    return res.status(204).end();
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
