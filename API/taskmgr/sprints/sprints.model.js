const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const sprintSchema = new Schema({
  name: { type: String, required: true },
  startAt: { type: String, required: true },
  finishedAt: { type: String, required: true },
  timeDifference: String,
  tasksIds: [{ type: ObjectId, ref: "Task" }],
  owner: { type: ObjectId },
});

sprintSchema.statics.removeSprint = removeSprint;
sprintSchema.statics.addTask = addTask;
sprintSchema.statics.updateSprintName = updateSprintName;
sprintSchema.statics.removeTaskFromSprint = removeTaskFromSprint;

async function addTask(sprintId, taskId) {
  return this.findByIdAndUpdate(sprintId, {
    $push: { tasksIds: taskId },
  });
}

async function removeSprint(sprintId) {
  return this.findByIdAndDelete(sprintId);
}

async function removeTaskFromSprint(taskId) {
  return this.updateMany(
    { tasksIds: taskId },
    { $pull: { tasksIds: { $in: taskId } } }
  );
}

async function updateSprintName(sprintId, newName) {
  return this.findByIdAndUpdate(
    sprintId,
    { $set: { name: newName } },
    { new: true }
  );
}

const sprintModel = mongoose.model("Sprint", sprintSchema);

module.exports = sprintModel;
