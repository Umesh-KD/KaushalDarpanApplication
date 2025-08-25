import { RequestBaseModel } from "./RequestBaseModel";
import { ResponseBaseModel } from "./ResponseBaseModel";

export class RenumerationAccountsRequestModel extends RequestBaseModel {
  public SSOID: string = '';
  public ExaminerID: number = 0;
  public GroupCodeID: number = 0;
  public RenumerationExaminerStatusID: number = 0;
}

export class RenumerationAccountsModel extends ResponseBaseModel {
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

  public TVNo: number = 0;
  public VoucharNo: string = '';
  public ClearDate: string = '';
  public Remark: string = '';
  public BillStatus: number = 0;
}

export class RenumerationAccountsSaveModel extends ResponseBaseModel {
  public RenumerationExaminerID: number = 0;
  public SSOID: string = '';
  public TVNo: number = 0;
  public VoucharNo: string = '';
  public ClearDate: string = '';
  public Remark: string = '';
  public Status: number = 0;
  public BillStatus: number = 0;
  public CourseTypeID: number = 0;
  public UserId: number = 0;
  public IsBillGenerated: number = 0;
  public BillGeneratedDate: string = '';
}


