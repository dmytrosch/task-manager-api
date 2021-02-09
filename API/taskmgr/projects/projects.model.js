const mongoose = require('mongoose');
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

// const { UnauthorizedError } = require('../../helpers/error.helpers');

const projectSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  owner: { type: ObjectId },
  participants: [{ type: ObjectId }],
  sprintsIds: [{ type: ObjectId }],
});

projectSchema.statics.addParticipant = addParticipant;
projectSchema.statics.getProjectById = getProjectById;
projectSchema.statics.addSprint = addSprint;

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
    $push: {sprintsIds: sprintId},
  });
}
// async function getUserProjects (arguments) {
//     return this.aggregate([
//         $lookup: {
//             from: 'projects',

//         }
//     ]);
// }

const projectModel = mongoose.model('Project', projectSchema);

module.exports = projectModel;
