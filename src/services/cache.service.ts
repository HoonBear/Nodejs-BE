import "reflect-metadata";
import { singleton } from "tsyringe";
import BaseService from "./base.service";
import { Role, RoleCache } from "../models/role.model";

@singleton()
class CacheService extends BaseService {
  role: RoleCache = new RoleCache();
  constructor() {
    super();
    this.nameSpace = "CacheService";
    this.init();
  }
  init = async () => {
    this.getRoleCache();
  };

  getRoleCache = async () => {
    try {
      this.log("", "start cache getAllRole");
      const data = await this.getAllRole();
      this.role = new RoleCache(data);
      this.log("", "finish cache RoleCache");
    } catch (error) {
      this.logErr(error);
    }
  };

  private getAllRole = (): Promise<Role[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM role`, (err, result) => {
        if (err) return reject(err);
        let data: Role[] = [];
        if (result && result.length > 0) {
          data = result.map((item: any) => new Role(item));
        }
        return resolve(data);
      });
    });
  };
}

export default CacheService;
