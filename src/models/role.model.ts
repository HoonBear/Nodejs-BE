import { BaseCache, CacheModel } from "./cache";

export class Role {
  id: number = 0;
  name: string = "";
  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class RoleCache extends BaseCache<Role> {
  constructor(_data: Role[] = []) {
    super();
    this.data = _data.map((item) => new CacheModel(item.id, item));
  }
}
