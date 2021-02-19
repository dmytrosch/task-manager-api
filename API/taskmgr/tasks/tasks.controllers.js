const taskModel = require("./tasks.model");
const sprintModel = require("../sprints/sprints.model");
const { JoiValidationError } = require("../../../helpers/error.helpers");

const {
  Types: { ObjectId },
} = require("mongoose");

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

    return res.status(204).send({ message: "deleted" });
  }

  async updateSpendedTime(req, res) {
    const { taskId } = req.params;
    const { hours } = req.body;

    const taskObjId = ObjectId(taskId);
    const hoursNumber = Number(hours);

    const updatedTask = await taskModel.incrementSpendedTime(
      taskObjId,
      hoursNumber
    );

    return res.status(200).send({
      id: updatedTask._id,
      name: updatedTask.name,
      plannedTime: updatedTask.plannedTime,
      spendedTime: updatedTask.spendedTime,
    });
  }

  async searchByName(req, res) {
    const { taskName, sprintId } = req.params;

    const sprint = await sprintModel.findById(sprintId);

    const response = await taskModel.find({ _id: { $in: sprint.tasksIds } });

    const nameToSearch = response
      .filter((item) => {
        const lowerCaseName = item.name.toLowerCase();
        const querySearchName = taskName.toLowerCase();
        const name = lowerCaseName.includes(querySearchName);
        console.log(name);

        return name;
      })
      .map((item) => {
        return {
          id: item.id,
          name: item.name,
          plannedTime: item.plannedTime,
          spendedTime: item.spendedTime,
        };
      });

    console.log(nameToSearch);
    return res.status(200).json(nameToSearch);
  }

  async updateName(req, res) {
    const { taskId } = req.params;
    const { name } = req.body;

    const updatedTask = await taskModel.updateTaskName(taskId, name);

    return res.status(200).send({
      id: updatedTask._id,
      name: updatedTask.name,
      plannedTime: updatedTask.plannedTime,
      spendedTime: updatedTask.spendedTime,
    });
  }

  async getTasks(req, res) {
    const { page } = req.query;
    const { sprintId } = req.params;

    const sprint = await sprintModel.findById(sprintId);

    const tasksIds = sprint.tasksIds;

    const tasks = await taskModel.find({ _id: tasksIds });

    const queryParams = { _id: tasks };
    const options = {
      page: Number(page),
      limit: 4,
    };

    if (options.page < 0) {
      throw new JoiValidationError("Page can't be negative");
    }

    await taskModel.paginate(
      queryParams,
      options,
      function methodName(err, result) {
        const { docs } = result;
        return res.status(200).send(docs);
      }
    );
  }
}

module.exports = new TasksControllers();
