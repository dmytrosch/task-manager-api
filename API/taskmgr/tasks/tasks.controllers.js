const taskModel = require("./tasks.model");
const sprintModel = require("../sprints/sprints.model");

class TasksControllers {
  async createTask(req, res) {
    const { name, planedTime } = req.body;
    const { sprintId } = req.params;

    const newTask = new taskModel({
      name,
      planedTime,
    });

    await newTask.save();

    await sprintModel.addTask(sprintId, newTask._id);

    return res.status(201).send({ data: { name, planedTime } });
  }

  async removeTaskfromSprint(req, res) {
    const { sprintId, taskId } = req.params;

    await sprintModel.removeTask(sprintId, taskId);

    return res.status(204).json({ message: "deleted" });
  }
}

module.exports = new TasksControllers();
