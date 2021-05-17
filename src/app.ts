import "reflect-metadata";
import cors from "cors";
import bodyParser from "body-parser";

import express from "express";
import { container, singleton } from "tsyringe";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import UserRouter from "./router/users";
import pm2ProdDoc from "./pm2Config.prod.json";
import pm2stagingDoc from "./pm2Config.staging.json";
import LoggerService from "./config/logger";

@singleton()
class AppRouter {
  appRouter = express();
  private logger: LoggerService = container.resolve(LoggerService);
  private nameSpace = "App";
  constructor(
    private user: UserRouter,
  ) {
    this.appRouter = express();
    /** Parse the body of the request */
    this.appRouter.use(cors());
    this.appRouter.use(bodyParser.urlencoded({ extended: false }));
    this.appRouter.use(bodyParser.json({ limit: "50mb" }));
    /** Routes go here */
    this.appRouter.use(
      "/api/swagger",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );

    // this.appRouter.get("/api/swagger", swaggerUi.setup(swaggerDocument));

    /** Error handling */
    this.appRouter.use((req, res, next) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
      this.logger.request(ip, req.originalUrl, req.method, req.body);
      next();
    });

    // serve static file
    // this.appRouter.use("/assets", express.static("../public"));

    this.appRouter.use("/api/user", this.user.router);
  }

  log = (data: any, message: string = "") => {
    this.logger.info(this.nameSpace, message, data);
  };
}

export default AppRouter;
