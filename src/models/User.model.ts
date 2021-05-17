import ROLE from "../constants/role.constant";
import { calculateDaysRemaining } from "../helpers/time";
import { getUserRoleName, timeStampSeconds } from "../ultils/Ultil";

export class User {
  id: number = 0;
  fullame: string = "";
  userEmail: string = "";
  userRole: number = 0;
  dateConnected: number = 0;
  dateExpired: number = 0;
  facebookID: number = 0;
  cyberID: string = "";
  userLogin: string = "";
  userPass: string = "";
  currentUnit: number = 0;
  avatarUrl: string = "";
  isActiveAccount: boolean = false;
  orther: any;
  created: number = 0;
  modified: number = 0;
  isAdmin: boolean = false;
  userRoleName: string = "";
  displayName: string = "";
  dateRemaining: number = 0;

  constructor(data: any) {
    if (data && data.id) {
      this.id = data.id;
      this.modified = data.modified;
      this.userEmail = data.user_email;
      this.userRole = data.user_role;
      this.avatarUrl = data.avatar_url;
      this.displayName = data.display_name;
      this.dateConnected = data.date_connected;
      this.userLogin = data.user_login;
      this.userPass = data.user_pass;
      this.isActiveAccount = !!data.is_active_account;
      this.currentUnit = data.current_unit;
      this.created = data.created;
      this.cyberID = data.cyber_id;
      this.facebookID = data.facebook_id;
      this.fullame = data.full_name;
      this.dateExpired = data.date_expired;
      this.userRoleName = getUserRoleName(this.userRole);
      this.isAdmin = this.userRoleName === ROLE.ADMIN;
      this.dateRemaining = calculateDaysRemaining(
        timeStampSeconds(),
        this.dateExpired
      );
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class UserLoginResponse {
  id: number | null = null;
  fullName: string = "";
  displayName: string = "";
  userEmail: string = "";
  userRole: number = 0;
  userRoleName: string = "";
  authKey: string = "";
  curentUnit: number = 1;
  dateRemaining: number = 0;
  isFirstTimeLogin: boolean = false;

  constructor(authKey: string = "", data?: User, _isFirstTimeLogin = false) {
    if (data) {
      this.authKey = authKey;
      this.id = data.id;
      this.fullName = data.fullame;
      this.displayName = data.displayName;
      this.userEmail = data.userEmail;
      this.userRole = data.userRole;
      this.userRoleName = data.userRoleName;
      this.dateRemaining = data.dateRemaining;
      this.curentUnit = data.currentUnit;
      this.isFirstTimeLogin = _isFirstTimeLogin;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class UserLoginFromCyberLearn {
  id: string = "";
  email: string = "";
  hoTen: string = "";
  biDanh: string = "";
  soDT: string = "";
  avatar: string = "";
  urls: string = "";
  facebookId: string = "";
  facebookEmail: string = "";
  thongTinMoRong: string = "";
  maNhomQuyen: string = "";
  danhSachLopHoc: string = "";
  ngayTao: string = "";

  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.email = data.email;
      this.hoTen = data.hoTen;
      this.biDanh = data.biDanh;
      this.soDT = data.soDT;
      this.avatar = data.avatar;
      this.urls = data.urls;
      this.facebookId = data.facebookId;
      this.facebookEmail = data.facebookEmail;
      this.thongTinMoRong = data.thongTinMoRong;
      this.maNhomQuyen = data.maNhomQuyen;
      this.danhSachLopHoc = data.danhSachLopHoc;
      this.ngayTao = data.ngayTao;
    }
  }
}
