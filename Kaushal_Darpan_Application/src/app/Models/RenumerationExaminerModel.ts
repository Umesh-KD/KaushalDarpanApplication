import { RequestBaseModel } from "./RequestBaseModel";
import { ResponseBaseModel } from "./ResponseBaseModel";

export class RenumerationExaminerRequestModel extends RequestBaseModel {
  public SSOID: string = '';
  public ExaminerID: number = 0;
  public GroupCodeID: number = 0;
  public RenumerationExaminerStatusID: number = 0;
}
export class RenumerationExaminerModel extends ResponseBaseModel {
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

export class TrackStatusDataModel extends ResponseBaseModel {
  public GroupCodeID: number = 0;
  public GroupCode: number = 0;
  public ExaminerCode: string = '';
  public ExaminerID: number = 0;
  public SSOID: string = '';
  public TotalAllotedCopy: number = 0;
  public TotalPendingCopy: number = 0;
  public TotalSavedCopy: number = 0;
  public PerCopyCharge: number = 0;
  public Status: number = 0;
  public StatusName: string = '';
  public FileName: string = '';
  public IsESign: boolean = false;
  public ESignDate: string = '';
  public ModifyDate: string = '';
  public UserName: string = '';
  public RoleName: string = '';
}

export class RenumerationExaminerPDFModel extends ResponseBaseModel {
  public GroupCodeID: number = 0;
  public ExaminerID: number = 0;
  public TotalSavedCopy: number = 0;
  public PerCopyCharge: number = 0;
  public Status: number = 0;
  public FileName: string = '';
  public IsESign: boolean = false;
  public ESignDate: string = '';
  public CreatedBy: number = 0;  
}

