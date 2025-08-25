import { RequestBaseModel } from "./RequestBaseModel";

export class PrometedStudentMasterModel  {
  public Selected: boolean = false;  // default value is false (from convert(bit, 0))
  public StudentID: number = 0;  // default value is 0
  public ApplicationNo: string = '';  // default value is empty string
  public StudentName: string = '';  // default value is empty string
  public FatherName: string = '';  // default value is empty string
  public EnrollmentNo: string = '';  // default value is empty string
  public MobileNo: string = '';  // default value is empty string
  public InstituteName: string = '';  // default value is empty string (concatenated value in SQL)
  public BranchName: string = '';  // default value is empty string
  public SemesterName: string = '';  // default value is empty string
  public DistrictName: string = '';  // default value is empty string
  public EndTermID: number = 0;  // default value is 0
  public StreamID: number = 0;  // default value is 0
  public SemesterID: number = 0;  // default value is 0
  public Dis_DOB: string = '';  // default value is a Unix epoch date (could be an invalid date)
  public IsBridge: boolean = false;  
}

export class PromotedStudentMarkedModel {
  public Marked: boolean = false;
  public StudentId: number = 0;
  public RoleId: number = 0;
  public ModifyBy: number = 0;
  public EndTermID: number = 0;
}

export class PromotedStudentSearchModel extends RequestBaseModel {
  public InstituteID: string = '0';  // default value is empty string
  public SemesterID: string = '0';   // default value is empty string
  public StreamID: string = '0';     // default value is empty string
  public IsBridge: string = '';
}

