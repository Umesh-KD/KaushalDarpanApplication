import { RequestBaseModel } from "./RequestBaseModel";

export class BridgeCourseStudentMasterModel  {
  public Selected: boolean = false;  
  public StudentID: number = 0;  
  public ApplicationNo: string = '';  
  public StudentName: string = '';  
  public FatherName: string = '';  
  public EnrollmentNo: string = '';  
  public MobileNo: string = '';  
  public InstituteName: string = '';  
  public BranchName: string = '';  
  public SemesterName: string = ''; 
  public DistrictName: string = '';  
  public EndTermID: number = 0;
  public InstituteID: number = 0;
  public StreamID: number = 0;
  public FinancialYearID: number = 0;
  public SemesterID: number = 0;   
  public Dis_DOB: string = '';  
  public StudentTypeID: number = 0;  
  public StudentType: string = '';
  public IsBridge: boolean = false
  public MotherName: string = '';
}
export class BridgeCourseStudentMarkedModel {
  public Marked: boolean = false;
  public StudentId: number = 0;
  public StudentName: string = '';  
  public SemesterId: number = 0;
  public StudentTypeId: number = 0;
  public FinancialYearID: number = 0;
  public InstituteID: number = 0;
  public StreamID: number = 0;
  public DepartmentID: number = 0
  public FatherName: string = ''; 
  public RoleId: number = 0;
  public ModifyBy: number = 0;
  public EndTermID: number = 0;

  public EnrollmentNo: string = '';
  public MotherName: string = '';
  public Dis_DOB: string = '';
  public IsBridge: boolean = false
}

export class BridgeCourseStudentSearchModel extends RequestBaseModel {
  public InstituteID: number = 0; 
  public SemesterID:number = 0;   
  public StreamID: number = 0;    
  public StudentTypeID: string = '0'; 
}

