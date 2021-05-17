import "reflect-metadata";
import express from "express";
import LoggerService from "../config/logger";
import { ResponseCode, ResponseData } from "../models/response";
import { check, ValidationChain, validationResult } from "express-validator";
import { container } from "tsyringe";
import Authentication from "../middleware/Authentication";
import { timeStampSeconds } from "../ultils/Ultil";

class BaseRouter {
  protected nameSpace = "";
  router: express.IRouter;
  private logger: LoggerService = container.resolve(LoggerService);
  private auth: Authentication = container.resolve(Authentication);
  public isAuth: any;
  public checkAuthThenGetuser: any;
  public isUserLoggedIn: any;
  public checkIsAdmin: any;
  check = check;

  constructor() {
    this.isAuth = this.auth.isAuth;
    this.isUserLoggedIn = this.auth.isUserLoggedIn;
    this.checkAuthThenGetuser = this.auth.checkThenGetuser;
    this.checkIsAdmin = this.auth.checkIsAdmin;
    this.router = express.Router();
  }

  log = (data: any, message: string = "") => {
    this.logger.info(this.nameSpace, message, data);
  };

  get timeNow(): number {
    return timeStampSeconds();
  }

  handleError = (
    resp: express.Response,
    responseData: ResponseData<any>,
    errorMessage: string[],
    errorCode: ResponseCode
  ) => {
    responseData.data = null;
    responseData.success = false;
    responseData.errorCodes = errorMessage;
    return resp.status(errorCode).json(responseData);
  };

  getMethod = async (path: string, middelWare: any[], mainFunction) => {
    const flow = async (
      req: express.Request,
      resp: express.Response,
      next: express.NextFunction
    ) => {
      return this.baseFlow(req, resp, next, mainFunction);
    };
    this.router.get(path, middelWare, flow);
  };

  deleteMethod = async (path: string, middelWare: any[], mainFunction) => {
    const flow = async (
      req: express.Request,
      resp: express.Response,
      next: express.NextFunction
    ) => {
      return this.baseFlow(req, resp, next, mainFunction);
    };
    this.router.delete(path, middelWare, flow);
  };

  postMethod = async (
    path: string,
    middelWare: ValidationChain[],
    mainFunction
  ) => {
    const flow = async (
      req: express.Request,
      resp: express.Response,
      next: express.NextFunction
    ) => {
      return this.baseFlow(req, resp, next, mainFunction);
    };
    this.router.post(path, middelWare, flow);
  };

  putMethod = async (
    path: string,
    middelWare: ValidationChain[],
    mainFunction
  ) => {
    const flow = async (
      req: express.Request,
      resp: express.Response,
      next: express.NextFunction
    ) => {
      return this.baseFlow(req, resp, next, mainFunction);
    };
    this.router.put(path, middelWare, flow);
  };

  patchMethod = async (
    path: string,
    middelWare: ValidationChain[],
    mainFunction
  ) => {
    const flow = async (
      req: express.Request,
      resp: express.Response,
      next: express.NextFunction
    ) => {
      return this.baseFlow(req, resp, next, mainFunction);
    };
    this.router.patch(path, middelWare, flow);
  };

  baseFlow(
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    mainFunction
  ): express.Response {
    const responseData = new ResponseData<any>();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({
        data: {
          error_codes: ["bad_request"],
          error_message: errors,
        },
        success: false,
      });
    }
    return mainFunction(req, resp, next, responseData);
  }
}

export default BaseRouter;
