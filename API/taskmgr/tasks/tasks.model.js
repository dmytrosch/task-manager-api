const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  name: { type: String, required: true },
  planedTime: { type: Number, required: true },
  spendedTime: { type: Number, default: 0 },
});

taskSchema.statics.removeTask = removeTask;
taskSchema.statics.incrementSpendedTime = incrementSpendedTime;

async function removeTask(taskId) {
  return this.findByIdAndDelete(taskId);
}

async function incrementSpendedTime(taskId, value) {
  const task = await this.findById(taskId);

  const updatedTime = task.spendedTime + value;

  return this.findByIdAndUpdate(
    taskId,
    { $set: { spendedTime: updatedTime } },
    { new: true },
  );
}

const taskModel = mongoose.model('Task', taskSchema);

module.exports = taskModel;
