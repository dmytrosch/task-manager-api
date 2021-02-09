const { Router } = require("express");

const authRouter = Router();

authRouter.get("/test", (req,res,next)=>{
    return res.status(200).send({message: "success"})
})


module.exports = authRouter;