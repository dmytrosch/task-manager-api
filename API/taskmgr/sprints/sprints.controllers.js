const sprintModel = require("./sprints.model");
const projectModel = require("../projects/projects.model");
const dateFormat = require("dateformat");
const diffDates = require("diff-dates");

const {
  Types: { ObjectId },
} = require("mongoose");

class SprintsControllers {
  async createSprint(req, res) {
    const { projectId } = req.params;
    const { name, startAt, finishedAt } = req.body;
    const user = req.user;

    console.log();
    //new Date(2015, 11, 16) так передавать в запросе

    const startAtFormatted = dateFormat(startAt, "paddedShortDate");
    const finishedAtFormatted = dateFormat(finishedAt, "paddedShortDate");
    const [startDay, startMonth, startYear] = startAtFormatted.split("/");
    const [finishDay, finishMonth, finishYear] = finishedAtFormatted.split("/");
    const startDate = new Date(startYear, startMonth, startDay);
    const finishDate = new Date(finishYear, finishMonth, finishDay);
    const timeDifference = diffDates(finishDate, startDate, "days").toString();

    const newSprint = new sprintModel({
      name,
      startAt: startAtFormatted,
      finishedAt: finishedAtFormatted,
      timeDifference,
      owner: user._id,
    });

    await newSprint.save();

    await projectModel.addSprint(projectId, newSprint._id);

    return res
      .status(201)
      .send({ name, startAtFormatted, finishedAtFormatted, timeDifference });
  }

  async removeSprintfromProject(req, res) {
    const { projectId, sprintId } = req.params;

    const pId = ObjectId(projectId);
    const sId = ObjectId(sprintId);

    const result = await projectModel.removeSprint(pId, sId);
    console.log(result);
    await sprintModel.removeSprint(sId);

    return res.status(204).json({ message: "deleted" });
  }

  async currentSprint(req, res) {
    const { sprintId } = req.params;
    const user = req.user;
    const _id = ObjectId(sprintId);

    const sprint = await sprintModel.findById(sprintId);
    const isOwner =
      sprint.owner.toString() === user._id.toString() ? true : false;




    const [result] = await sprintModel.aggregate([
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
        $unset: ['tasksIds']
      },
      {
        $project: {
          name: 1,
          tasks: {
            name: 1,
            planedTime: 1,
          }
        }
      }
    ]);

    return res.status(200).send({... result, isOwner})

  }


  async updateName(req, res) {
    const { sprintId } = req.params;
    const { name } = req.body;

    const updatedSprint = await sprintModel.updateSprintName(
      sprintId,
      name,
    );

    return res.status(200).send({
      id: updatedSprint._id,
      name: updatedSprint.name,
    });
  }

}

module.exports = new SprintsControllers();
