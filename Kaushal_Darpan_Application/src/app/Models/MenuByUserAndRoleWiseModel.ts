import { RequestBaseModel } from "./RequestBaseModel";

export interface MenuByUserAndRoleWiseModel extends RequestBaseModel {
  UserID: number;
  RoleID: number;
}
