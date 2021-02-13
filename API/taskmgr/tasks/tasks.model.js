const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const taskSchema = new Schema({
  name: { type: String, required: true },
  planedTime: { type: Number, required: true },
  // owner: { type: ObjectId },
});

taskSchema.statics.removeTask = removeTask;

async function removeTask(sprintId, taskId) {
  return this.findByIdAndUpdate(
    sprintId,
    { $pull: { tasksIds: { $in: taskId } } },
    { new: true }
  );
}

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;
