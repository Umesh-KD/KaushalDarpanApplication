import { DocumentDetailList } from "./ApplicationFormDataModel";
import { CommonSubjectDetailsMasterModel } from "./CommonSubjectDetailsMasterModel";
import { DocumentDetailsModel } from "./DocumentDetailsModel";

export class StudentEnrollmentApprovalReject {
  public AID: number = 0;
  public ApplicationID: number = 0;
  public StudentID: number = 0;
  public EnrollmentNo: string = '';
  public AcademicYearID: number = 0;
  public EndTermID: number = 0;
  public EntryDate: string = '';
  public SSOID: string = '';
  public AdmissionCategoryID: number = 0;
  public InstituteID: number = 0;
  public UserID: number = 0;
  public StreamID: number = 0;
  public InstituteStreamID: number = 0;
  public StudentName: string = '';
  public StudentNameHindi: string = '';
  public FatherName: string = '';
  public StudentExamStatus: string = '';
  public FatherNameHindi: string = '';
  public MotherName: string = '';
  public MotherNameHindi: string = '';
  public Gender: number = 0;
  public DOB: string = '';
  public CategoryA_ID: number = 0;
  public CategoryB_ID: number = 0;
  public status: number = 0;
  public MobileNo: string = '';
  public TelephoneNo: string = '';
  public Email: string = '';
  public Address1: string = '';
  public Address2: string = '';
  public StateID: number = 0;
  public DistrictID: number = 0;
  public BlockID: number = 0;
  public PanchayatSamityID: number = 0;
  public GramPanchayatID: number = 0;
  public Pincode: string = '';
  public AadharNo: string = '';
  public FatherAadharNo: string = '';
  public JanAadharNo: string = '';
  public JanAadharMobileNo: string = '';
  public JanAadharName: string = '';
  public BankAccountNo: string = '';
  public IFSCCode: string = '';
  public BankAccountName: string = '';
  public BankName: string = '';
  public StudentPhoto: string = '';
  public StudentSign: string = '';

  public Dis_StudentPhoto: string = '';
  public Dis_StudentSign: string = '';
  public Folder:string=''

  public Remark: string = '';
  public TypeOfAdmissionID: number = 0;
  public StudentStatusID: number = 0;
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string = '';
  public SemesterID: number = 0;
  public StudentTypeID: number = 0;
  public ABCID: number = 0;
  public RejectFlag:number=0

  public BhamashahNo: string = '';
  public JanAadharMemberId: string = '';
  public Papers: string = '';
  public Dis_DOB: string = '';
  public QualificationDetails: M_StudentMaster_QualificationDetailsModel[] = [];
  public Selected: boolean = false
  public commonSubjectDetails: SubjectModel[] = [];

  public StudentFilterStatusId: number = 0;
  public Status_old: number = 0;
  public ApplicationNo: string = '';
  public SubCategoryA_ID: number = 0;
  public DocumentDetailList: DocumentDetailList[] = []
  public DocumentDetails: DocumentDetailsModel[] = []
}

export class M_StudentMaster_QualificationDetailsModel {
  public StudentQualificationID: number = 0;
  public StudentID: number = 0;
  public Qualification: string = '';
  public ClassBoard: number = 0;
  public ClassSubject: string = '';
  public PasssingYear: number = 0;
  public ClassDocument: string = '';
  public ClassAgMaxMarks: number = 0;
  public ClassPercentage: number = 0;
  public ClassAgObtMarks: number = 0;
  public OtherDoc: string = '';
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string = '';
}

export class Student_DataModel {
  public StudentSubjectID: number = 0
  public StudentId: number = 0
  public StreamId: number = 0
  public SemesterId: number = 0
  public ModifyBy: number = 0
  public EndTermID: number = 0
  public FeeAmount: number = 0
  public status: number = 0
  public IsParent: boolean = true
  public ActiveStatus: boolean = true
  public DeleteStatus: boolean = true
  public Selected: boolean = false
}

export class SubjectModel {
  SubjectId: number = 0
  StudentID: number = 0
  SubjectName: string = ''
}

export class StudentMarkedModel {
  public Marked: boolean = false;
  public StudentId: number = 0;
  public Status: number = 0;
  public StudentFilterStatusId: number = 0;
  public ModifyBy: number = 0;
  public RoleId: number = 0;
}

export class StudentRejectMarkedModel {
  public Marked: boolean = false;
  public StudentId: number = 0;
  public Status: number = 0;
  public StudentFilterStatusId: number = 0;
  public ModifyBy: number = 0;
  public RoleId: number = 0;
  public RejectFlag: number = 0 
}



export class AbcIdStudentDetailsSearchModel {
  public DepartmentId: number = 0;
  public Eng_NonEng: number = 0;
}

