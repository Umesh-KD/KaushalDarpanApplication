import { RequestBaseModel } from "./RequestBaseModel"

export class DownloadMarksheetSearchModel {
  public SemesterID: number = 0
  public InstituteID: number = 0
  public IsRevised: number = 0
  public IsBridge: number = 0
  public ResultTypeID: number = 0
  public RollNo: number = 0
  public DepartmentID: number = 0
  public StudentID: number = 0
  public EndTermID: number = 0
  public RequestEndTerm:number=0
  public Eng_NonEngID: number = 0
  public MarksheetPath: string = ''
  public MarksheetFile?: string = ''
  public Marksheet: string = ''
  public IPAddress: string = ''
  public ExamType: number = 0
  public ReqId?: number = 0
  public IsReval?: boolean = false
  public IsRWHResult?: boolean = false
  public IsLateral?: boolean = false
  public FianancialYearID?:number=0
  public DocumentID?:number=0
  public MarksheetID?:number=0
  public ModifyBy?:number=0
  public StudentTypeID?:number=0
  public SessionName?: string = ''
  public SRNO?: string = ''
  public DOB?: string = ''
  public SchemeID?:number=0
}


export class HostelWardenSomeDetailsModel {
  public txtWFatherContactNo: string = ''
  public txtWLocalGuardianName: string = ''
  public txtWLocalGuardianContactNo: string = ''
}

export class StudentResultSearchModel {
  public EndTermID: number = 0
  public RollNo: string = ''
  public SemesterID: number = 0
  public ResultType: number = 0
  public DOB: string = ''
}


export class DiplomaCertificateDownloadSearchModel extends RequestBaseModel {
  public ModifyBy: number = 0;
  public SemesterID: number = 0;
  public FinalDiplomaID: number = 0;
  public InstituteID: number = 0;
  public IsRevised: string = '';
  public IsBridge: number = 0;
  public ResultTypeID: number = 0;
  public RollNo: string = '';
  public StudentID: number = 0;
  public Eng_NonEngID: number = 0;
  public ExamTypeID: number = 0;
  public RWHResultID: number = 0;
  public AcademicYearID: number = 0;
  public IPAddress: string = '';
  public SessionName: string = '';
  public Dis_FileName: string = ''; // Name
  public FileName: string = ''; // With file path
  public DOB: string = '';
  public SRNO: string = '';

  public IsReval: boolean = false;
  public IsRWHResult: boolean = false;
  public IsLateral: boolean = false;
  public ReqId: number = 0;
  public StudentTypeID: number = 0;

  public RequestEndTerm: number = 0;

  public FianancialYearID: number = 0;
  public DocumentID: number = 0;
  public EffectiveEndTermID: number = 0;
  public EnrollmentNo: string = '';
  public StudentName: string = '';
  public ResultDate: string = '';
  public PublishDate: string = '';
  public IsLocked: boolean = false;
  public DiplomaPrintingDate: string = '';
  public IsRevisedIssueDate: string = '';
  public ExamResultID: number = 0;
  public RevisedId: number = 0;
  public IsBlock: number = 0;
  public IsDiploma: number = 0;
  public IsDuplicate: boolean = false;
  public DuplicateDiplomaId: number = 0;
  public RequestId: number = 0;
  public IsIssued: boolean = false;
  public RegistrarSignFile: string = '';
  public FatherName: string = '';
  public StreamName: string = '';
  public FinalDiplomaTermName: string = '';
  public Division: string = '';
  public CourseDuration: string = '';
}
