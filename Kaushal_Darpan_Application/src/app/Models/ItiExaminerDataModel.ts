import { RequestBaseModel } from "./RequestBaseModel";

export class ItiExaminerDataModel extends RequestBaseModel {
 
  public ExaminerID: number = 0;
  public SSOID: string = '';
  public Name: string = '';
  public DateOfBirth: string = '';
  public FatherName: string = '';
  public Gender: number = 0;
  public Email: string = '';
  public District: number = 0;
  public Address: string = '';
  public AadharNumber: string = '';
  public BhamashahNumber: string = '';
  public MobileNumber: string = '';
  public EducationQualification: string = '';
  public Branch_Trade: number = 0;
  public Designation: number = 0;
  public PostingPlace: string = '';
  public BankAccountNumber: string = '';
  public IFSCCode: string = '';
  public BankName: string = '';
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public IPAddress: string = '';


  ///////

  public StaffID: number = 0;
 
  public ExaminerCode: string = '';

  public DistrictID: number = 0;
  public SubjectID: number = 0;
  public GroupID: number = 0;

  public AdharCardNumber: string = '';
  public BhamashahNo: string = '';

  public HigherQualificationID: string = '';
  public StreamID: number = 0;
  public DesignationID: number = 0;

  public BankAccountNo: string = '';
  
  public AssignGroupCode: number = 0;
  public InstituteID: number = 0;
  public IsAppointed: boolean = false;
  public CourseType: number = 0;
  public RollFrom:string=''
  public RollTo:string=''


}

export class ItiExaminerSearchModel {
  //public ApplicationID?: number = 0;
  //public InstituteID?: number=0;
  //public ExaminerID: number = 0;
 // public DepartmentID: number = 0;
  public ExaminerCode: string = '';
  public Name: string = '';
  public Email: string = '';
  public SSOID: string = '';
  public DistrictID: number = 0;
  public EndTermID: number = 0;
  public CheckStatus: number = 0;
  
}


export class ITITeacherForExaminerSearchModels extends RequestBaseModel {
 public SemesterID: number = 0 
 public SubjectID: number = 0
 public StreamID: number = 0
 public UserID: number = 0
 public InstituteID: number = 0
 public TradeType: number = 0
 public RollFrom: number = 0
 public RollTo: number = 0
 public SubjectType: number = 0
 public StudentCount: number = 0
 public ExaminerID: number = 0
 public IsTheory: boolean = false
 public IsPractical: boolean = false
}




export class ITITeacherForExaminerSearchModel extends RequestBaseModel {
  public SemesterID: number = 0
  public StreamID: number = 0
  public SubjectID: number = 0
  public UserID: number = 0
  public InstituteID: number = 0
  public TradeType: number = 0
  public RollFrom?:number=0
  public RollTo?: number = 0
  public SubjectType: number = 0
  public StudentCount: number = 0
  public ExaminerID: number = 0
  public CenterID: number = 0
  public IsTheory: boolean = false  
  public IsPractical: boolean = false
  public SubjectCode:string=''
  public SubjectName: string = ''
  public Status: number = 0
  public selectedCenters :string=''
  public selectedInstitute :string=''
  public selectedTrade: string = ''
  public sSOID: string = ''
  public PaperID: number = 0
}


export class ItiAssignStudentExaminer extends RequestBaseModel {
  public studentExamID: number = 0;
  public semesterID: number = 0;
  public streamID: number = 0;
  public subjectID: number = 0;
  public centerID: number = 0;
  public rollNo: number = 0;
  public selected: boolean = false;
  public SemesterName:string=''
  public StreamName:string=''
  public CenterName: string = ''
  public ExaminerID:number=0
  public StudentExamPaperID:number=0
  public AppointExaminerID: number = 0
  public UserID: number = 0
  public IsTheory: boolean = false
  public IsPractical: boolean = false
}


export class ITIExaminerUploadFilesModel {
  UploadedID: number = 0;
  ExaminerID: number = 0;
  FileName: string = '';
  displayFileName: string = '';
  EndTermID: number = 0;
  UserID: number = 0;
  SSOID: string = '';
  Remarks: string = '';
  Action: string = '';
}

