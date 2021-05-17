import "reflect-metadata";
import mysql from "mysql";
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import { Role } from "../models/role.model";
import CacheService from "./cache.service";

@singleton()
class RoleService {
  private connection: mysql.Pool;
  allRole: Role[] = [];
  constructor(private dBService: DBService,private cacheServ: CacheService, ) {
    this.connection = this.dBService.getConnection();
  }

  getRoleIdByName = (userRole: any): Promise<number | null> => {
    return new Promise(async (resolve) => {
      const data = this.cacheServ.role.allData;
      const role = data.find((_role) => _role.name === userRole);
      resolve(role ? role.id : null);
    });
  };

  getRoleNameById = (_roleId: number): Promise<string | null> => {
    return new Promise(async (resolve) => {
      const data = this.cacheServ.role.allData;
      const role = data.find((_role) => _role.id === _roleId);
      resolve(role ? role.name : null);
    });
  };

  checkUserRoleById = (userId: any, roleName: any) => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT 1 FROM users ut
                    INNER JOIN role rt
                    ON rt.id=ut.user_role
                    WHERE ut.id=${userId} AND rt.name='${roleName}'`,
        (err, result) => {
          if (err) return reject(err);
          resolve(result && result.length > 0);
        }
      );
    });
  };

  checkUserRoleValid = (userId: any, listRoleName) => {
    const roleQuery = listRoleName
      .map((roleName) => `rt.name='${roleName}'`)
      .join(" OR ");
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT 1 FROM users ut
          INNER JOIN role rt
          ON rt.id=ut.user_role
          WHERE ut.id=${userId} AND (${roleQuery})`,
        (err, result) => {
          if (err) return reject(err);
          resolve(result && result.length > 0);
        }
      );
    });
  };

  getUserRole = (userId: number): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT rt.name FROM users ut
                    INNER JOIN role rt
                    ON rt.id=ut.user_role
                    WHERE ut.id=${userId}`,
        (err, result) => {
          if (err) return reject(err);
          let role = null;
          if (result && result.length > 0) {
            role = result[0].name;
          }
          resolve(role);
        }
      );
    });
  };


}

export default RoleService;
