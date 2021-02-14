const mongoose = require('mongoose');

const {
  Schema,
  Types: { ObjectId },
} = mongoose;

// const { UnauthorizedError } = require('../../helpers/error.helpers');

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: ObjectId },
  participantsIds: [{ type: ObjectId, ref: 'User' }],
  sprintsIds: [{ type: ObjectId, ref: 'Sprint' }],
});

projectSchema.statics.addParticipant = addParticipant;
projectSchema.statics.getProjectById = getProjectById;
projectSchema.statics.addSprint = addSprint;
projectSchema.statics.removeProjectFromColletion = removeProjectFromColletion;
projectSchema.statics.addUserToProject = addUserToProject;
projectSchema.statics.updateProjectName = updateProjectName;
projectSchema.statics.removeSprint = removeSprint;

async function addParticipant(participantId, projectId) {
  return this.findByIdAndUpdate(projectId, {
    $push: { participants: participantId },
  });
}

async function getProjectById(projectId) {
  return this.findById(projectId);
}

async function addSprint(projectId, sprintId) {
  return this.findByIdAndUpdate(projectId, {
    $push: { sprintsIds: sprintId },
  });
}

async function addUserToProject(projectId, userId) {
  return this.findByIdAndUpdate(projectId, {
    $push: { participantsIds: userId },
  });
}

// async function getUserProjects (arguments) {
//     return this.aggregate([
//         $lookup: {
//             from: 'projects',

//         }
//     ]);
// }
async function removeProjectFromColletion(id) {
  return this.findByIdAndDelete(id);
}

async function updateProjectName(projectId, newName) {
  return this.findByIdAndUpdate(
    projectId,
    { $set: { name: newName } },
    { new: true },
  );
}

async function removeSprint(sprintId) {
  return this.updateMany(
    { sprintsIds: sprintId },
    { $pull: { sprintsIds: { $in: sprintId } } },
  );
}

const projectModel = mongoose.model('Project', projectSchema);

module.exports = projectModel;
