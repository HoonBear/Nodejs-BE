import { container } from "tsyringe";
import DBService from "../config/mysql";
import mysql from "mysql";
import LoggerService from "../config/logger";
import { timeStampSeconds } from "../ultils/Ultil";

class BaseService {
  protected connection: mysql.Pool;
  protected nameSpace = "";
  private logger: LoggerService = container.resolve(LoggerService);
  constructor() {
    this.connection = container.resolve(DBService).getConnection();
  }

  get timeNow(): number {
    return timeStampSeconds();
  }

  protected log = (data: any, message: string = "") => {
    this.logger.info(this.nameSpace, message, data);
  };

  protected logErr = (data: any, message: string = "error") => {
    this.logger.error(this.nameSpace, message, data);
  };
}
export default BaseService;
