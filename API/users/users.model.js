const mongoose = require('mongoose')
const {
  Schema,
  Types: { ObjectId },
} = mongoose
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { UnauthorizedError } = require('../../helpers/error.helpers')

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, default: '' },
  projectIds: [{ type: ObjectId }],
})

userSchema.statics.brcPassHash = brcPassHash
userSchema.statics.userByEmail = userByEmail
userSchema.methods.checkUser = checkUser
userSchema.methods.updateToken = updateToken
userSchema.statics.verifyToken = verifyToken
userSchema.statics.addProject = addProject
userSchema.statics.removeProjectId = removeProjectId
userSchema.statics.removeProjectFromParticipants = removeProjectFromParticipants
userSchema.statics.addToProject = addToProject

function brcPassHash(password) {
  return bcrypt.hash(password, 3)
}

async function userByEmail(email) {
  return this.findOne({ email })
}

async function checkUser(password) {
  const isPassValid = await bcrypt.compare(password, this.password)

  if (!isPassValid) {
    throw new UnauthorizedError('Email or password is wrong')
  }

  const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 30 * 24 * 60 * 60,
  })

  await this.updateToken(token)

  return token
}

function updateToken(token) {
  return userModel.findByIdAndUpdate(this._id, {
    token,
  })
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

async function addProject(userId, projectId) {
  return this.findByIdAndUpdate(userId, {
    $push: { projectIds: projectId },
  })
}

async function removeProjectId(projectId, userId) {
  return this.findByIdAndUpdate(userId, {
    $pull: { projectIds: { $in: projectId } },
  })
}
async function removeProjectFromParticipants(projectId) {
  return this.updateMany(
    { projectIds: projectId },
    { $pull: { projectIds: { $in: projectId } } }
  )
}
async function addToProject(userId, projectId) {
  return this.findByIdAndUpdate(
    userId,
    {
      $push: { projectIds: projectId },
    },
    {
      new: true,
    }
  )
}

const userModel = mongoose.model('User', userSchema)

module.exports = userModel
