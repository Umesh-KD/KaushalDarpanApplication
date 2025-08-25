import { RequestBaseModel } from "./RequestBaseModel";

export class GenerateRollSearchModel extends RequestBaseModel {
  public InstituteID: number = 0
  public StreamID: number = 0
  public SemesterID: number = 0;
  public StudentTypeID: number = 0;
  public action:string=''
  public ActionID: number = 0;
  public Status: number = 0;
  public UserID: number = 0;
  public ShowAll: number = 0;
  public ModuleID: number = 1;
  public PDFType:number=0
  public StatusID: number = 0
  public IsExaminationVerified: boolean=false
  public IsRegistrarVerified: boolean=false
  public PublishOrder: number = 0
  public VerifierStatus: number = 0
  public IsYearly?: number = -1;
  public Remark: string = ''
}



export class GenerateRollData extends RequestBaseModel
{
  public StudentID: number = 0
  public ApplicationID: number = 0
  public EnrollmentNo: string = ''
  public RollNumber: string = ''
  public StudentName: string = ''
  public FatherName: string = ''
  public InstituteName: string = ''
  public SemesterName: string = ''
  public StudentCategory: string = ''
  public InstituteCode: string = ''
  public DOB: string = ''
  public InstituteID: number = 0
  public MobileNo: number = 0
  public StreamID: number = 0
  public SemesterID: number = 0
  Marked: boolean = false
  public StreamName: number = 0
  public ModifyBy: number = 0
  public Selected: boolean = false
  public Status: number = 0
  public IsVerified: boolean = false
  public IsExam: boolean = false
  public IsRegistrarVerified: boolean = false
  public IsExaminationVerified: boolean = false
  public VerifyerStatus: number = 0
  public PublishOrder: number = 0
  public VerifyerStatusName: string = ''
  
  /*public Initialvalue :number=0*/
}


export class DownloadnRollNoModel
{
  public InstituteID: number = 0;
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public DepartmentID: number = 0;
  public Eng_NonEng: number = 0;
  public EndTermID: number = 0;
  public CenterName: string ='' ;
  public InstituteNameEnglish: string = '';
  public BranchCode: string = '';
  public StudentType: string = '';
  public EndTermName: string = '';
  public FinancialYearName: string = '';
  public Totalstudent: number = 0;
  public StudentTypeID: number = 0;
  public CreatedBy: number = 0;
  public RoleID: number = 0;

}

export class VerifyRollNumberList {
  public RollListID:number=0
  public InstituteID: number = 0;
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public DepartmentID: number = 0;
  public Eng_NonEng: number = 0;
  public EndTermID: number = 0;
  public CenterName: string = '';
  public InstituteNameEnglish: string = '';
  public BranchCode: string = '';
  public StudentType: string = '';
  public EndTermName: string = '';
  public FinancialYearName: string = '';
  public Totalstudent: number = 0;
  public StudentTypeID: number = 0;
  public PDFType: number = 0;
  public Selected: boolean = false;
  public Status: number = 0;
  public UserID: number = 0;
  public RoleID: number = 0;
  public ModuleID: number = 0;
  public ActionCode: string = '';
  public IsRegistrarVerified: boolean = false;
  public IsExaminationVerified: boolean = false;
  public RollListFileName?: string = '';
  public AdmitCardFileName?: string = '';
  public RollListDate?: string = '';
  public AdmitCardDate?: string = '';
}

export class StudentAdmitCardDownloadModel extends RequestBaseModel {
  public RollNo?: string = '';
  public UserID?: number = 0; 
}
