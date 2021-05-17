import "reflect-metadata";
import { singleton } from "tsyringe";
import JWTHelper, { TokenData } from "../helpers/jwt.helper";
import { User, UserLoginFromCyberLearn } from "../models/User.model";
import hasher from "wordpress-hash-node";
import BaseService from "./base.service";
import config from "../config/config";
import { cyberLearnFacebookLoginURI } from "../constants";
import axios from "axios";
import CacheService from "./cache.service";
import { Role } from "../models/role.model";
import { plusUnitTimestampOnDays } from "../helpers/time";

@singleton()
class UserService extends BaseService {
  private myHasher = hasher;
  constructor(private jwtHelper: JWTHelper, private cacheServ: CacheService) {
    super();
    this.nameSpace = "UserService";
  }

  login = (username: string, password: string): Promise<any> =>
    new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM users WHERE user_login='${username}'`,
        async (err, result) => {
          if (err) return reject(err);
          const data = {
            usernameIsCorrect: false,
            passwordIsCorrect: false,
            user: new User(null),
          };
          if (result && result.length > 0) {
            data.usernameIsCorrect = true;
            data.passwordIsCorrect = this.myHasher.CheckPassword(
              password,
              result[0].user_pass
            );
            data.user = new User(result[0]);
          }
          resolve(data);
        }
      );
    });

  getUserById = (userId: number): Promise<User> =>
    new Promise((resolve, reject) => {
      if (!userId) {
        reject(null);
        return;
      }
      this.connection.query(
        `SELECT * FROM users WHERE id=${userId}`,
        (err, result) => {
          if (err) return reject(err);
          if (result && result.length > 0) resolve(new User(result[0]));
          else reject(null);
        }
      );
    });

  getToken = (user: User): Promise<string> =>
    new Promise(async (resolve, reject) => {
      const timeExpired = 86400; // 1 day = 86400s
      const timeNow = Date.now();
      const token = await this.jwtHelper.generateToken(
        user,
        "access-token-secret",
        "24h"
      );
      this.connection.query(
        `INSERT INTO user_token (user_id, token, created_date, expired_date, modified_date)
            VALUES (${user.id}, '${token}', ${timeNow}, ${
          timeNow + timeExpired
        }, ${timeNow}) ON DUPLICATE KEY UPDATE token = '${token}', expired_date=${
          timeNow + timeExpired
        }, modified_date=${timeNow};`,
        (err, result) => {
          if (err) return reject(err);
          resolve(token ? token : "");
        }
      );
    });

  getUserByToken = async (token: string): Promise<TokenData> =>
    this.jwtHelper.verifyToken(token, "access-token-secret");

  updateCurentUnit = (userId: number): Promise<any> =>
    new Promise(async (resolve, reject) => {
      this.connection.query(
        `UPDATE users SET modified = ${this.timeNow}, current_unit = current_unit + 1
          WHERE id = ${userId};`,
        (err, result) => {
          if (err) {
            this.log(err, "");
            return reject(err);
          }
          if (result) return resolve(result);
        }
      );
    });

  loginByFacebookID = (
    facebookID: number
  ): Promise<{
    existFacebookId: boolean;
    user: User;
  }> =>
    new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM users WHERE facebook_id='${facebookID}'`,
        async (err, result) => {
          if (err) return reject(err);
          const data = {
            existFacebookId: false,
            user: new User(null),
          };
          if (result && result.length > 0) {
            data.existFacebookId = true;
            data.user = new User(result[0]);
          }
          resolve(data);
        }
      );
    });

  loginByFacebookEmail = (
    facebookEmail: string
  ): Promise<{
    existFacebookEmail: boolean;
    user: User;
  }> =>
    new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM users WHERE user_email='${facebookEmail}'`,
        async (err, result) => {
          if (err) return reject(err);
          const data = {
            existFacebookEmail: false,
            user: new User(null),
          };
          if (result && result.length > 0) {
            data.existFacebookEmail = true;
            data.user = new User(result[0]);
          }
          resolve(data);
        }
      );
    });

  loginCyberLearnByEmail = async (
    email?: string
  ): Promise<UserLoginFromCyberLearn | null> =>
    new Promise((resolve) => {
      const url =
        config.extenalServer +
        cyberLearnFacebookLoginURI +
        "/" +
        'none' +
        "/" +
        email;
      axios
        .get(url)
        .then((res) => {
          if (
            res.data &&
            Number(res.data.statusCode) === 200 &&
            res.data.content
          ) {
            resolve(new UserLoginFromCyberLearn(res.data.content));
          } else {
            resolve(null);
          }
        })
        .catch((err) => resolve(err));
    });

  loginCyberLearnByFacebookId = async (
    facebookId: number
  ): Promise<UserLoginFromCyberLearn | null> =>
    new Promise((resolve) => {
      const url =
        config.extenalServer +
        cyberLearnFacebookLoginURI +
        "/" +
        facebookId +
        "/" +
        'none';
      axios
        .get(url)
        .then((res) => {
          if (
            res.data &&
            Number(res.data.statusCode) === 200 &&
            res.data.content
          ) {
            resolve(new UserLoginFromCyberLearn(res.data.content));
          } else {
            resolve(null);
          }
        })
        .catch((err) => resolve(err));
    });

  private getRoleID = (roleName: string): Role => {
    const role = this.cacheServ.role.allData.find(
      (item) => item.name.toLowerCase() === roleName.toLowerCase()
    );
    const roleUnknow = new Role();
    roleUnknow.id = -1;
    roleUnknow.name = "unknow";
    return role ? role : roleUnknow;
  };

  storageCyberLearnLogin = async (
    user: UserLoginFromCyberLearn,
    facebookId: string | number
  ): Promise<User> =>
    new Promise((resolve, reject) => {
      const role = this.getRoleID(user.maNhomQuyen);
      const dateExpired = plusUnitTimestampOnDays(this.timeNow, 150);
      const tempData = [
        user.hoTen,
        user.email,
        role.id,
        this.timeNow,
        facebookId,
        user.id,
        this.timeNow,
        this.timeNow,
        dateExpired,
        JSON.stringify(user),
      ];
      this.connection.query(
        `INSERT INTO users (full_name,user_email,user_role,date_connected,facebook_id,cyber_id,created,modified, date_expired, orther)
          VALUES (?)
        ON DUPLICATE KEY UPDATE
          modified = ${this.timeNow},
          facebook_id = ${facebookId}`,
        [tempData],
        (err, result) => {
          if (err) return reject(err);
          if (result) {
            const data = new User(null);
            data.id = result.insertId;
            data.fullame = user.hoTen;
            data.displayName = user.biDanh;
            data.userEmail = user.email;
            data.userRole = role.id;
            data.userRoleName = role.name;
            data.isActiveAccount = true;
            data.dateExpired = dateExpired;
            return resolve(data);
          }
        }
      );
    });
}

export default UserService;
