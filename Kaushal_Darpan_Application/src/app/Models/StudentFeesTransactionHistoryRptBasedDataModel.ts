import { RequestBaseModel } from "./RequestBaseModel"

export class StudentFeesTransactionHistoryRptModel extends RequestBaseModel {
  public StudentID: number = 0;  
  public EnrollmentNo: string = '';
  public ApplicationNo: string = '';
}


export class StudentFeesTransactionHistorySearchmodel extends RequestBaseModel{
  public Status: string = '';
  public StudentExamID: number = 0;
  public AcademicYearID : number = 0;
  public TransactionType : number = 2;
  public CourseType : number = 0;
  public PageNumber : number = 1;
  public PageSize : number = 1000;
  public TransctionStatus : string = '';
  public TransactionId : number = 0;
  public StudentName : string = '';
  public MobileNo : string = '';
  public AadharNo : string = '';
  public DOB : string = '';
  public FeeFor : string = '';
  public PRN : string = '';
  public InstituteID: number = 0
  public StudentID: number = 0
  public TransctionDate: string = ''
  public EnrollmentNo: string = ''
  public StreamID: number = 0
  public SemesterID: number = 0
  public PaymentServiceID: number = 0
}

export class GetApplicationFeesTransactionSearchModel extends RequestBaseModel{
  public AcademicYearID : number = 0;
  public TransactionType : number = 2;
  public CourseType : number = 0;
  public PageNumber : number = 1;
  public PageSize : number = 1000;
  public TransctionStatus : string = '';
  public TransactionId : number = 0;
  public ApplicationID : string = '';
  public TransactionNo : string = '';
  public StudentName : string = '';
  public MobileNo : string = '';
  public AadharNo : string = '';
  public DOB : string = '';
  public FeeFor : string = '';
  public TransctionDate : string = '';
  public PRN : string = '';

}


export class GetEmitraFeesTransactionSearchModel extends RequestBaseModel {
  public Status: string = '';
  public StudentExamID: number = 0;
  public AcademicYearID: number = 0;
  public TransactionType: number = 2;
  public CourseType: number = 0;
  public PageNumber: number = 1;
  public PageSize: number = 1000;
  public TransctionStatus: string = '';
  public TransactionId: number = 0;
  public StudentName: string = '';
  public MobileNo: string = '';
  public AadharNo: string = '';
  public DOB: string = '';
  public FeeFor: string = '';
  public PRN: string = '';
  public InstituteID: number = 0
  public StudentID: number = 0
  public TransctionDate: string = ''
  public EnrollmentNo: string = ''
  public StreamID: number = 0
  public SemesterID: number = 0
  public SSOID: string = '';
  public ApplicationID: number = 0;

}
