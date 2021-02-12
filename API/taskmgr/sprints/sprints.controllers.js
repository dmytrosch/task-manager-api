const sprintModel = require("./sprints.model");
const projectModel = require("../projects/projects.model");

class SprintsControllers {
  async createSprint(req, res) {
    const { projectId } = req.params;
    const { name, startAt, finishedAt } = req.body;

    const newSprint = new sprintModel({
      name,
      startAt,
      finishedAt,
    });

    await newSprint.save();

    await projectModel.addSprint(projectId, newSprint._id);

    return res.status(201).send({ data: { name, startAt, finishedAt } });
  }

  async removeSprintfromProject(req, res) {
    const { projectId, sprintId } = req.params;

    await sprintModel.removeSprint(projectId, sprintId);

    return res.status(204).json({ message: "deleted" });
  }
}

module.exports = new SprintsControllers();
