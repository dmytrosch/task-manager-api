const userModel = require("./users.model");

class UsersControllers {
  async getCurrentUser(req, res) {
    const { _id } = req.user;
    const [user] = await userModel.aggregate([
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

    const projects = user.projects.map((project) => {
      return {
        id: project._id,
        name: project.name,
        description: project.description,
        isOwner: project.owner.toString() === _id.toString(),
      }
    });

    const userToRespone = {email: user.email, projects};

    return res.status(200).send(userToRespone);
  }
}

module.exports = new UsersControllers();
