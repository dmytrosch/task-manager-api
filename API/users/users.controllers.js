const projectModel = require("../taskmgr/projects/projects.model");
const userModel = require("./users.model");

class UsersControllers {
  async getCurrentUser(req, res, next) {
    const { email, projectIds, _id } = req.user;
    const user = await userModel.aggregate([
      {
        $match: { _id },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectIds",
          foreignField: "_id",
          as: "projects",
        },
      },
      { $unset: ["projectIds"] },
    ]);
    console.log("user", user);
    // const userProjects = await Promise.all(projectIds.map(async projectId => {
    //     const {_id: id, name, description, owner} = await projectModel.getProjectById(projectId);
    //     return {id, name, description, ownerId: owner};
    // }));

    return res.status(200).send({ user });
  }

  async removeProjectFromUser(req, res) {
    const { id: projectId } = req.params;
    const { _id: userId } = req.user;

    await userModel.removeProjectId(projectId, userId);
    await projectModel.removeProjectFromColletion(projectId);
    await userModel.removeProjectFromParticipants(projectId);

    return res.status(204).json({ message: "deleted" });
  }
}

module.exports = new UsersControllers();
