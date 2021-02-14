const taskModel = require('./tasks.model');
const sprintModel = require('../sprints/sprints.model');

const {
  Types: { ObjectId },
} = require('mongoose');

class TasksControllers {
  async createTask(req, res) {
    const { name, plannedTime } = req.body;
    const { sprintId } = req.params;

    const newTask = new taskModel({
      name,
      plannedTime,
    });

    await newTask.save();

    await sprintModel.addTask(sprintId, newTask._id);

    return res.status(201).send({ id: newTask._id, name, plannedTime });
  }

  async removeTaskfromSprint(req, res) {
    const { taskId } = req.params;

    const taskObjId = ObjectId(taskId);

    await taskModel.findById(taskObjId);

    await taskModel.removeTask(taskObjId);
    await sprintModel.removeTaskFromSprint(taskObjId);

    return res.status(204).send({ message: 'deleted' });
  }

  async updateSpendedTime(req, res) {
    const { taskId } = req.params;
    const { hours } = req.body;

    const taskObjId = ObjectId(taskId);
    const hoursNumber = Number(hours);

    const updatedTask = await taskModel.incrementSpendedTime(
      taskObjId,
      hoursNumber,
    );

    return res
      .status(200)
      .send({
        id: updatedTask._id,
        name: updatedTask.name,
        plannedTime: updatedTask.plannedTime,
        spendedTime: updatedTask.spendedTime,
      });
  }
}

module.exports = new TasksControllers();
