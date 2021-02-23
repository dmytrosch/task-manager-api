require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRouter = require("./auth/auth.router");
const usersRouter = require("./users/users.router");
const projectsRouter = require("./taskmgr/projects/projects.router");
const sprintsRouter = require("./taskmgr/sprints/sprints.router");
const tasksRouter = require("./taskmgr/tasks/tasks.router");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const {
  ConflictError,
  UnauthorizedError,
  JoiValidationError,
  NotFoundError,
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
    this.server.use(
      // cors({ origin: `${process.env.BASE_URL}/` })
      cors({})
    );
    this.server.use(morgan("dev"));
    console.log("middlewares initialized");
  }

  errorHandling() {
    let status = 500;
    this.server.use((error, req, res, next) => {
      if (
        error instanceof ConflictError ||
        error instanceof UnauthorizedError ||
        error instanceof JoiValidationError ||
        error instanceof NotFoundError
      ) {
        status = error.status;
      }
      return res.status(status).send({ message: error.message });
    });
  }

  initRoutes() {
    // input routers here
    this.server.use("/api/auth", authRouter);
    this.server.use("/api/users", usersRouter);
    this.server.use("/api/projects", projectsRouter);
    this.server.use("/api/sprints", sprintsRouter);
    this.server.use("/api/tasks", tasksRouter);
    this.server.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );

    console.log("routes initialized");
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
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
