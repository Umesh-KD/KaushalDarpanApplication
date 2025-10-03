import { RequestBaseModel } from "./RequestBaseModel";

export class LeaveMaster extends RequestBaseModel {
  StaffLeaveID: number = 0;
  LeaveID: number = 0;
  StaffID: number = 0;
  From_Date: string = '';
  To_Date: string = '';
  Remark: string = '';
  Action: string = '';
  ActionBy: number = 0;
  ActionDate: string = '';
  ActionRemark: string = '';
  ModifyBy: number = 0;
  InstituteID: number = 0;
  SSOID: string = '';
  TotalDays: number = 0;           // changed decimal to number and initialized
  IsHeadQuarter: boolean = false;  // boolean should be true/false
  LeaveTypeID: number = 0;
}
export class LeaveMasterSearchModel extends RequestBaseModel{
  Name: string = '';
  InstituteID: number = 0;
  Status: string = '';
  SSOID: String = '';
  StaffID: number = 0;
  From_Date: string = '';
  To_Date: string = '';
  }
