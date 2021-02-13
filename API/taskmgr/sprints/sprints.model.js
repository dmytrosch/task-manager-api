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
  tasksIds: [{ type: ObjectId }],
  owner: { type: ObjectId },
});

sprintSchema.statics.removeSprint = removeSprint;
sprintSchema.statics.addTask = addTask;
sprintSchema.statics.updateSprintName = updateSprintName;

async function addTask(sprintId, taskId) {
  return this.findByIdAndUpdate(sprintId, {
    $push: { tasksIds: taskId },
  });
}

async function removeSprint(sprintId) {
  return this.findByIdAndDelete(sprintId);
}

const sprintModel = mongoose.model("Sprint", sprintSchema);


async function updateSprintName(sprintId, newName) {
  return this.findByIdAndUpdate(
    sprintId,
    { $set: { name: newName } },
    { new: true },
  );
}

module.exports = sprintModel;
