"use strict";
import { singleton } from "tsyringe";
import { ResponseCode, ResponseData } from "../models/response";
import UserService from "../services/user.service";
import LoggerService from "../config/logger";

@singleton()
class Authentication {
  constructor(
    private userService: UserService,
    private logger: LoggerService
  ) {}
  isAuth = async (req: any, res: any, next: any) => {
    const token = req.headers["auth-key"];
    this.userService.getUserByToken(token).then(
      (userInfo) => {
        this.logger.info(
          "userRequest",
          `userID: ${userInfo.userId} - Method: ${req.method} - Path: ${req.originalUrl}`
        );
        req.auth_user = userInfo;
        next();
      },
      (err) => {
        const obj = new ResponseData<any>();
        obj.success = false;
        obj.data = {
          error_code: ["unauthorized"],
        };
        if (err.error_name === "TokenExpiredError") {
          obj.data.error_code = ["Token Expired"];
        }
        res.status(ResponseCode.UNAUTHORIZED).json(obj);
      }
    );
  };

  checkThenGetuser = async (req: any, res: any, next: any) => {
    const token = req.headers["auth-key"];
    this.userService.getUserByToken(token).then(
      (userInfo) => {
        this.logger.info(
          "userRequest",
          `userID: ${userInfo.userId} - Method: ${req.method} - Path: ${req.originalUrl}`
        );
        this.userService
          .getUserById(userInfo.userId)
          .then((user) => {
            const unit = Number(req.params.unit);
            if (
              (unit && user.currentUnit < unit && !user.isAdmin) ||
              (!user.isAdmin && !user.dateRemaining)
            ) {
              const obj = new ResponseData<any>();
              obj.success = false;
              obj.data = {
                error_code: ["unauthorized"],
              };
              return res.status(ResponseCode.UNAUTHORIZED).json(obj);
            }
            req.body.userData = user;
            next();
          })
          .catch((err) => {
            const obj = new ResponseData<any>();
            obj.success = false;
            obj.data = {
              error_code: ["invaild user "],
            };
            res.status(ResponseCode.UNAUTHORIZED).json(obj);
          });
      },
      (err) => {
        const obj = new ResponseData<any>();
        obj.success = false;
        obj.data = {
          error_code: ["Token Expired"],
        };
        if (err.error_name === "TokenExpiredError") {
          obj.data.error_code = ["Token Expired"];
        }
        res.status(ResponseCode.UNAUTHORIZED).json(obj);
      }
    );
  };

  checkIsAdmin = async (req: any, res: any, next: any) => {
    const token = req.headers["auth-key"];
    this.userService.getUserByToken(token).then(
      (userInfo) => {
        this.logger.info(
          "adminRequest",
          `userID: ${userInfo.userId} - Method: ${req.method} - Path: ${req.originalUrl}`
        );
        this.userService
          .getUserById(userInfo.userId)
          .then((user) => {
            if (!user.isAdmin) {
              const obj = new ResponseData<any>();
              obj.success = false;
              obj.data = {
                error_code: ["unauthorized"],
              };
              return res.status(ResponseCode.UNAUTHORIZED).json(obj);
            }
            req.body.userData = user;
            next();
          })
          .catch((err) => {
            const obj = new ResponseData<any>();
            obj.success = false;
            obj.data = {
              error_code: ["unauthorized", err],
            };
            res.status(ResponseCode.UNAUTHORIZED).json(obj);
          });
      },
      (err) => {
        const obj = new ResponseData<any>();
        obj.success = false;
        obj.data = {
          error_code: ["unauthorized"],
        };
        if (err.error_name === "TokenExpiredError") {
          obj.data.error_code = ["Token Expired"];
        }
        res.status(ResponseCode.UNAUTHORIZED).json(obj);
      }
    );
  };

  isUserLoggedIn = async (req: any, res: any) => {
    return new Promise(async (resolve, reject) => {
      const token = req.headers["sb-auth-key"];
      const userInfo = await this.userService.getUserByToken(token);
      if (userInfo) {
        resolve(userInfo);
      } else {
        const obj = new ResponseData();
        obj.success = false;
        obj.data = {
          error_code: ["unauthorized"],
        };
        res.status(ResponseCode.UNAUTHORIZED).json(obj);
      }
    });
  };
}

export default Authentication;
