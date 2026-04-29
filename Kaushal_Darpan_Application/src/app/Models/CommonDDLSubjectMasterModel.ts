import { RequestBaseModel } from "./RequestBaseModel";

export class CommonDDLSubjectMasterModel extends RequestBaseModel {
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public SubjectID: number = 0;
  public UserID: number = 0;
}
export class CommonDDLSubjectCodeMasterModel extends RequestBaseModel {
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public StudentExamID: number = 0;
  public SubjectType:number=0
}

export class OptionalSubjectDDLDataModel {
  public DepartmentID?: number = 0;
  public CourseType?: number = 0;
  public EndTermID?: number = 0;
  public SemesterId?: number = 0;
  public StreamId?: number = 0;
}

export class EmitraFeePaymentListSearchModel {
  public TypeID?: number = 0;
  public RoleID?: number = 0;
  public UserID?: number = 0;
  public FeeFor?: string = '';
  public SSOID?: string = '';
  public PRN?: string = '';
  public TransctionDate?: string = '';
  public StudentName?: string = '';
  public TransctionStatus?: string = '';
}
