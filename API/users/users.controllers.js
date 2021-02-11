const projectModel = require('../taskmgr/projects/projects.model')
const userModel = require('./users.model')

class UsersControllers {
  async getCurrentUser(req, res, next) {
    const { _id } = req.user
    const [user] = await userModel.aggregate([
      {
        $match: { _id },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectIds',
          foreignField: '_id',
          as: 'projects',
        },
      },
      { $unset: ['projectIds'] },
    ])
    return res.status(200).json(user)
  }

  async removeProjectFromUser(req, res) {
    const { projectId } = req.params
    const { user } = req

    const project = user.projectIds.find((project) => project == projectId)
    if (!project) {
      res.status(404).json({ message: 'Project is not found!' })
      return
    }
    await user.removeProjectId(project)
    await projectModel.removeProjectFromColletion(project)
    await userModel.removeProjectFromParticipants(projectId)

    return res.status(204).json({ message: 'deleted' })
  }
}

module.exports = new UsersControllers()
