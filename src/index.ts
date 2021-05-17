import "reflect-metadata";
import { container } from "tsyringe";
import AppRouter from "./app";
import config from "./config/config";
import LoggerService from "./config/logger";
import { getFullDateTime } from "./ultils/Ultil";

const appRouter = container.resolve(AppRouter);
const logger = container.resolve(LoggerService);

appRouter.appRouter.listen(config.server.port, () => {
  logger.info(
    `============================${getFullDateTime()}==========================`,
    ""
  );
  logger.info(
    "App",
    `listening at ${config.server.hostName}:${config.server.port}`
  );
});
