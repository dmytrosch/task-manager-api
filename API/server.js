const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const authRouter = require("./auth/auth.router");
const usersRouter = require("./users/users.router");
const projectsRouter = require("./taskmgr/projects/projects.router");
const sprintsRouter = require("./taskmgr/sprints/sprints.router");

const {
  ConflictError,
  UnauthorizedError,
} = require("../helpers/error.helpers");

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
    this.errorHandling();
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

  errorHandling() {
    this.server.use((error, req, res, next) => {
      if (error instanceof ConflictError) {
        return res.status(error.status).send({ message: error.message });
      }
      if (error instanceof UnauthorizedError) {
        return res.status(error.status).send({ message: error.message });
      }
      return res.status(500).send({message: error.message});
    });
  }

  initRoutes() {
    // input routers here
    this.server.use("/api/auth", authRouter);
    this.server.use("/api/users", usersRouter);
    this.server.use("/api/projects", projectsRouter);
    this.server.use("/api/sprints", sprintsRouter);

    console.log("routes initialized");
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      console.log("Database connection successful");
    } catch (err) {
      console.log(err);
      process.exit(1);
    }

    console.log("DB initialized");
  }

  startListening() {
    this.server.listen(this.SERVER_PORT, () => {
      console.log("Server started at PORT:", this.SERVER_PORT);
    });
  }
};
