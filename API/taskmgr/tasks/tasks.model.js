const mongoose = require("mongoose");
const sprintModel = require("../sprints/sprints.model");
const { ConflictError } = require("../../../helpers/error.helpers");
const { Schema } = mongoose;

const taskSchema = new Schema({
  name: { type: String, required: true },
  plannedTime: { type: Number, required: true },
  spendedTime: [{
    _id: false,
    id: Number,
    date: String,
    wastedTime: Number,
  }],
  totalWastedTime: Number,
});

taskSchema.statics.removeTask = removeTask;
taskSchema.statics.incrementSpendedTime = incrementSpendedTime;
taskSchema.statics.updateTaskName = updateTaskName;

async function removeTask(taskId) {
  return this.findByIdAndDelete(taskId);
}

async function incrementSpendedTime(taskId, dateId,  value) {
  const task = await this.findById(taskId);

  const spendedTimeArr = task.spendedTime;

  const newSpendedTimeArr = spendedTimeArr.map((item, index) => {
    if(index === Number(dateId)){
      item = {id: item.id, date: item.date, wastedTime: item.wastedTime + value}
    }
    return item;
  });

  const totalWastedTime = newSpendedTimeArr.reduce((acc, item) => {
    acc += item.wastedTime;
    return acc;
  }, 0);

  const [result] = await sprintModel.aggregate([
    {
      $match: { tasksIds: { $eq: taskId } },
    },
    {
      $project: {
        timeDifference: 1,
      },
    },
  ]);

  const { timeDifference: timeDiff } = result;

  const timeDiffInHours = timeDiff * 24;

  if (totalWastedTime >= timeDiffInHours) {
    throw new ConflictError("Spended time more than planned time");
  }

  return this.findByIdAndUpdate(
    taskId,
    { $set: { spendedTime: newSpendedTimeArr } },
    { new: true }
  );
}

async function updateTaskName(taskId, newName) {
  return this.findByIdAndUpdate(
    taskId,
    { $set: { name: newName } },
    { new: true }
  );
}

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;
