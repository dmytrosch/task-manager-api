const mongoose = require('mongoose');
const sprintModel = require('../sprints/sprints.model');
const {ConflictError} = require('../../../helpers/error.helpers');
const { Schema } = mongoose;

const taskSchema = new Schema({
  name: { type: String, required: true },
  plannedTime: { type: Number, required: true },
  spendedTime: { type: Number, default: 0 },
});

taskSchema.statics.removeTask = removeTask;
taskSchema.statics.incrementSpendedTime = incrementSpendedTime;

async function removeTask(taskId) {
  return this.findByIdAndDelete(taskId);
}

async function incrementSpendedTime(taskId, value) {
  const task = await this.findById(taskId);

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

  const {timeDifference: timeDiff} = result;

  const timeDiffInHours = timeDiff * 24;

  const updatedTime = task.spendedTime + value;

  if (updatedTime >= timeDiffInHours) {
    throw new ConflictError('Spended time more than planned time');
  }

  return this.findByIdAndUpdate(
    taskId,
    { $set: { spendedTime: updatedTime } },
    { new: true },
  );
}

const taskModel = mongoose.model('Task', taskSchema);

module.exports = taskModel;
