const projectModel = require('./projects.model');
const userModel = require('../../users/users.model');

class ProjectsControllers {
    async setOwner(req, res){
        const {_id: projectOwner} = req.user;
        const {name, description} = req.body;

        const newProject =  new projectModel({
            name,
            description,
            owner: projectOwner,
            participants: [projectOwner],
        });

        await newProject.save();

        await userModel.addProject(projectOwner, newProject._id);

        return res.status(201).send({data: {name, description}});
    }

    
}

module.exports = new ProjectsControllers();
