import { RequestBaseModel } from "./RequestBaseModel";

export class ExaminerCodeLoginModel extends RequestBaseModel {
  public ExaminerID: number = 0;
  public GroupCodeID?: number = 0;
  public ExaminerCode: string = '';
  public SSOID: string = '';
}



export class ExaminerDashboardSearchModel extends RequestBaseModel {
  public ExaminerCode: string = '';
  public SSOID: string = '';
  public InstituteID: any = 0;
}

export class DDL_GroupCode_ExaminerWise extends RequestBaseModel {
  public ExaminerID?: number = 0;
  public SSOID?: string = '';
}

