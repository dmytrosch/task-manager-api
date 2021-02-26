const sprintModel = require("./sprints.model");
const projectModel = require("../projects/projects.model");
const taskModel = require("../tasks/tasks.model");
const diff = require("../../../utils/date");
const {NotFoundError} = require('../../../helpers/error.helpers');
const { DateTime } = require("luxon");

const {
  Types: { ObjectId },
} = require("mongoose");

class SprintsControllers {
  async createSprint(req, res) {
    const { projectId } = req.params;
    const { name, startAt, finishedAt } = req.body;
    const user = req.user;

    const isProjectExist = await projectModel.findById(projectId);

    if (!isProjectExist) {
      throw new NotFoundError("Project not found");
    }

    const [startYear, startMonth, startDay] = startAt.split('/');
    const [finishedYear, finishedMonth, finishedDay] = finishedAt.split('/');

    const startAtFormatted = DateTime.fromObject({year: startYear, month: startMonth, day: startDay}).setLocale('zh').toLocaleString();
    const finishedAtFormatted = DateTime.fromObject({year: finishedYear, month: finishedMonth, day: finishedDay}).setLocale('zh').toLocaleString();

    const timeDifference = diff(
      startAtFormatted,
      finishedAtFormatted
    ).toString();

    const newSprint = new sprintModel({
      name,
      startAt: startAtFormatted,
      finishedAt: finishedAtFormatted,
      timeDifference,
      owner: user._id,
    });

    await newSprint.save();

    await projectModel.addSprint(projectId, newSprint._id);

    return res.status(201).send({
      id: newSprint._id,
      name,
      startAt: startAtFormatted,
      finishedAt: finishedAtFormatted,
      timeDifference,
    });
  }

  async removeSprintfromProject(req, res) {
    const { sprintId } = req.params;
    const sId = ObjectId(sprintId);

    const isSprintExist = await sprintModel.findById(sprintId);

    if (!isSprintExist) {
      throw new NotFoundError("Sprint not found");
    }

    await projectModel.removeSprint(sId);
    const tasksId = await sprintModel.findById(sprintId);
    const { tasksIds } = tasksId;
    await taskModel.deleteMany({}, { _id: tasksIds });
    await sprintModel.removeSprint(sId);

    return res.status(204).end();
  }

  async currentSprint(req, res) {
    const { sprintId } = req.params;
    const user = req.user;
    const _id = ObjectId(sprintId);

    const isSprintExist = await sprintModel.findById(sprintId);

    if (!isSprintExist) {
      throw new NotFoundError("Sprint not found");
    }


    const sprint = await sprintModel.findById(sprintId);
    const isOwner =
      sprint.owner.toString() === user._id.toString() ? true : false;

    const result = await sprintModel.aggregate([
      {
        $match: { _id },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "tasksIds",
          foreignField: "_id",
          as: "tasks",
        },
      },
      {
        $unset: ["tasksIds"],
      },
      {
        $project: {
          name: 1,
          tasks: {
            _id: 1,
            name: 1,
            plannedTime: 1,
            spendedTime: 1,
            totalWastedTime: 1,
          },
        },
      },
    ]);

    const [prepearedResult] = result.map((item) => {
      return {
        id: item._id,
        name: item.name,
        tasks: item.tasks.map((task) => {
          return {
            id: task._id,
            name: task.name,
            plannedTime: task.plannedTime,
            spendedTime: task.spendedTime,
            totalWastedTime: task.totalWastedTime,
          };
        }),
        isOwner,
      };
    });

    return res.status(200).send(prepearedResult);
  }

  async updateName(req, res) {
    const { sprintId } = req.params;
    const { name } = req.body;

    const isSprintExist = await sprintModel.findById(sprintId);

    if (!isSprintExist) {
      throw new NotFoundError("Sprint not found");
    }

    const updatedSprint = await sprintModel.updateSprintName(sprintId, name);

    return res.status(200).send({
      id: updatedSprint._id,
      name: updatedSprint.name,
      startAt: updatedSprint.startAt,
      finishedAt: updatedSprint.finishedAt,
      timeDifference: updatedSprint.timeDifference,
    });
  }
}

module.exports = new SprintsControllers();
