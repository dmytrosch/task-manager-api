const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const taskSchema = new Schema({
  name: { type: String, required: true, unique: true },
  planedTime: { type: Number, required: true },
  owner: { type: ObjectId },
});

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;
