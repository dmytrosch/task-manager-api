const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const sprintSchema = new Schema({
  name: { type: String, required: true },
  startAt: { type: String, required: true },
  finishedAt: { type: String, required: true },
  tasksIds: [{ type: ObjectId }],
});

sprintSchema.statics.removeSprint = removeSprint;

async function removeSprint(projectId, sprintId) {
  return this.findByIdAndUpdate(
    projectId,
    { $pull: { sprintIds: { $in: sprintId } } },
    { new: true }
  );
}

const sprintModel = mongoose.model("Sprint", sprintSchema);

module.exports = sprintModel;
