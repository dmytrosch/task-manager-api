const taskModel = require("./tasks.model");
const sprintModel = require("../sprints/sprints.model");
const { DateTime } = require("luxon");

const {
  NotFoundError,
  ConflictError,
} = require("../../../helpers/error.helpers");

const {
  Types: { ObjectId },
} = require("mongoose");

class TasksControllers {
  async createTask(req, res) {
    const { name, plannedTime } = req.body;
    const { sprintId } = req.params;

    const isSprintExist = await sprintModel.findById(sprintId);

    if (!isSprintExist) {
      throw new NotFoundError("Sprint not found");
    }

    if (plannedTime < 1) {
      throw new ConflictError("Spended time must be more than 0");
    }

    const sprint = await sprintModel.findById(ObjectId(sprintId));

    const [year, month, day] = sprint.startAt.split("/");

    const sprintDuration = sprint.timeDifference;

    const spendedTime = [];

    for (let i = 0; i < sprintDuration; i++) {
      const dayValue = i;

      const yearNum = Number(year);
      const monthNum = parseInt(month, 10);
      const dayNum = Number(day);

      const date = DateTime.local(yearNum, monthNum, dayNum)
        .plus({ days: dayValue })
        .toISODate();

      const id = i;

      spendedTime.push({ id, date, wastedTime: 0 });
    }

    const newTask = new taskModel({
      name,
      plannedTime,
      spendedTime,
    });

    await newTask.save();

    await sprintModel.addTask(sprintId, newTask._id);

    return res.status(201).send({
      id: newTask._id,
      name,
      plannedTime,
      spendedTime,
      totalWastedTime: newTask.totalWastedTime,
    });
  }

  async removeTaskfromSprint(req, res) {
    const { taskId } = req.params;

    const isTaskExist = await taskModel.findById(taskId);

    if (!isTaskExist) {
      throw new NotFoundError("Task not found");
    }

    const taskObjId = ObjectId(taskId);

    await taskModel.findById(taskObjId);

    await taskModel.removeTask(taskObjId);
    await sprintModel.removeTaskFromSprint(taskObjId);

    return res.status(204).end();
  }

  async updateSpendedTime(req, res) {
    const { taskId, dateId } = req.params;
    const { hours } = req.body;

    const isTaskExist = await taskModel.findById(taskId);

    if (!isTaskExist) {
      throw new NotFoundError("Task not found");
    }

    const taskObjId = ObjectId(taskId);
    const hoursNumber = Number(hours);

    const updatedTask = await taskModel.incrementSpendedTime(
      taskObjId,
      dateId,
      hoursNumber
    );

    return res.status(200).send({
      id: updatedTask._id,
      name: updatedTask.name,
      plannedTime: updatedTask.plannedTime,
      spendedTime: updatedTask.spendedTime,
      totalWastedTime: updatedTask.totalWastedTime,
    });
  }

  async searchByName(req, res) {
    const { taskName, sprintId } = req.params;

    const sprint = await sprintModel.findById(sprintId);

    if (!sprint) {
      throw new NotFoundError("Sprint not found");
    }

    const response = await taskModel.find({ _id: { $in: sprint.tasksIds } });

    const nameToSearch = response
      .filter((item) => {
        const lowerCaseName = item.name.toLowerCase();
        const querySearchName = taskName.toLowerCase();
        const name = lowerCaseName.includes(querySearchName);

        return name;
      })
      .map((item) => {
        return {
          id: item.id,
          name: item.name,
          plannedTime: item.plannedTime,
          spendedTime: item.spendedTime,
          totalWastedTime: item.totalWastedTime,
        };
      });

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
      totalWastedTime: updatedTask.totalWastedTime,
    });
  }
}

module.exports = new TasksControllers();
