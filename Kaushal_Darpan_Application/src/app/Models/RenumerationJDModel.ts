import { RequestBaseModel } from "./RequestBaseModel";
import { ResponseBaseModel } from "./ResponseBaseModel";

export class RenumerationJDRequestModel extends RequestBaseModel {
  public SSOID: string = '';
  public ExaminerID: number = 0;
  public GroupCodeID: number = 0;
  public RenumerationExaminerStatusID: number = 0;
}

export class RenumerationJDModel extends ResponseBaseModel {
  public Selected: boolean = false;
  public RenumerationExaminerID: number = 0;
  public GroupCodeID: number = 0;
  public GroupCode: number = 0;
  public ExaminerCode: string = '';
  public ExaminerID: number = 0;
  public SSOID: string = '';
  public TotalAllotedCopy: number = 0;
  public TotalPendingCopy: number = 0;
  public TotalSavedCopy: number = 0;
  public Status: number = 0;
  public StatusName: string = '';
  public FileName: string = '';
}

export class RenumerationJDSaveModel extends ResponseBaseModel {
  public RenumerationExaminerID: number = 0;
}


