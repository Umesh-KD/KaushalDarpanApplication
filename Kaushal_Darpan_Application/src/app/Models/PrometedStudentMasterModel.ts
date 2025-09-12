import { RequestBaseModel } from "./RequestBaseModel";
import { ResponseBaseModel } from "./ResponseBaseModel";

export class PrometedStudentMasterModel extends ResponseBaseModel  {
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
  public StreamID: number = 0;  // default value is 0
  public SemesterID: number = 0;  // default value is 0
  public Dis_DOB: string = '';  // default value is a Unix epoch date (could be an invalid date)
  public IsBridge: boolean = false;  

  public EarnedCreditsSem1: number = 0;
  public EarnedCreditsSem2: number = 0;
  public TotalEarnedCredits: number = 0;
  public Detain: boolean = false; 
  public UFM: boolean = false; 
  public UFMCategory: number = 0;  
  public InstituteId: number = 0;  
  public StudentType: string = ''; 
}

export class PromotedStudentMarkedModel extends RequestBaseModel {
  public Marked: boolean = false;
  public StudentId: number = 0;
  public EnrollmentNo: string = '';
  public StudentName: string = '';
  public FatherName: string = '';
  public MotherName: string = '';
  public DOB: string = '';
  public Gender: string = '';
  public InstituteNameEnglish: string = '';
  public StreamName: string = '';
  public StudentType: string = '';
  public SemesterId: number = 0;
  public IsDetain: boolean = false;
  public IsUFM: boolean = false;
  public UFMCategory: number = 0;
  public IsBridge: boolean = false;
  public StreamId: number = 0;
  public ModifyBy: number = 0;
  public IPAddress: string = '';
}

export class PromotedStudentSearchModel extends RequestBaseModel {
  public InstituteID: string = '0';  // default value is empty string
  public SemesterID: string = '0';   // default value is empty string
  public StreamID: string = '0';     // default value is empty string
  public IsBridge: string = '';
}

