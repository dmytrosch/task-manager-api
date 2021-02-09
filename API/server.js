const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
require("dotenv").config();


const authRouter = require("./auth/auth.router")

module.exports = class taskMgrServer {
    constructor() {
        this.server = null;
        this.SERVER_PORT = null;
    }


    async start() {
        // Input start middlwares here
        this.initPort();
        this.initServer();
        this.initMiddlwares();
        this.initRoutes();
        await this.initDatabase();
        this.startListening();
    }

    initServer() {
        this.server = express();
        console.log("server initialized");

    }

    initPort() {
        this.SERVER_PORT = process.env.PORT || 3000;
        console.log("port initialized");

    }


    initMiddlwares() {
        this.server.use(express.json());
        this.server.use(cors({ origin: `http://localhost:${process.env.PORT}` }));
        this.server.use(morgan("dev"));
        console.log("middlewares initialized");
    }



    initRoutes() {
        // input routers here
        this.server.use("/api/auth", authRouter)


        console.log("routes initialized");
    }

    initDatabase() {


        console.log("DB initialized");
     }


    startListening() {
        this.server.listen(this.SERVER_PORT, () => {
            console.log('Server started at PORT:',this.SERVER_PORT);
        })
    }


}