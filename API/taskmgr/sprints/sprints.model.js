const mongoose = require('mongoose');
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const sprintSchema = new Schema({
    name: {type: String, required: true},
    startAt: {type: String, required: true},
    finishedAt: {type: String, required: true},
    tasksIds: [{type: ObjectId}],
});

const sprintModel = mongoose.model('Sprint', sprintSchema);

module.exports = sprintModel;