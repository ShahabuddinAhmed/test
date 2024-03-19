import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import { initializeDBConnection } from "./infra/db";

import { UserModel } from "./model/user";

import { newUserRepo } from "./repo/user";

import { newUserService } from "./service/user";

import { newV1Router } from "./web/router/v1/index";
import { newUserController } from "./web/controller/user";

import config from "./config/config";
import { newLogManager, newLogManagerStreamer } from "./infra/logger";


const app = express();

// registering app level middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// bootstrapping the application
(async () => {
    // initialize logger
    const logger = await newLogManager();
    const requestLogStreamer = await newLogManagerStreamer(logger);

    // initializing db connection
    await initializeDBConnection(config.MONGO.MONGO_HOST, config.MONGO.MONGO_DB);

    // initializing repos
    const userRepo = await newUserRepo(UserModel);

    // initializing services
    const userService = await newUserService(userRepo);

    // initializing controllers
    const userController = await newUserController(userService, logger);

    //initialize routers
    const v1Router = await newV1Router(userController);

    app.use(morgan("short", { stream: requestLogStreamer }));
    app.use("/api", v1Router);

})();

export default app;

