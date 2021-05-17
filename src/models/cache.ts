export class CacheModel<T> {
  id: number;
  data: T;
  constructor(_id: number, _data: T) {
    this.id = _id;
    this.data = _data;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class BaseCache<T> {
  protected data: CacheModel<T>[] = [];
  getItemById(id: number): T | undefined {
    return this.data.find((item) => item.id === id)?.data;
  }
  get allData() {
    return this.data.map((item) => item.data);
  }
}
