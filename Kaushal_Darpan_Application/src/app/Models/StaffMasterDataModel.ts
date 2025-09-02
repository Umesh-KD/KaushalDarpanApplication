import { RequestBaseModel } from "./RequestBaseModel";

export class StaffDetailsDataModel {

  public StaffID: number = 0;
  public StaffTypeID: number = 0;
  public SSOID: string = '';
  public RoleID: number = 0;
  public CourseID: number = 0;
  public SemesterID: number = 0;
  public SubjectID: number = 0;
  public Name: string = '';
  public DesignationID: number = 0;
  public Email: string = '';
  public MobileNumber: string = '';
  public DateOfBirth: string = '';
  public HigherQualificationID: string = '';
  public ProfilePhoto: string = '';
  public Dis_ProfileName: string = '';
  public StreamName: string = ''
  public AdharCardNumber: string = '';
  public PanCardNumber: string = '';
  public AdharCardPhoto: string = '';
  public FolderName:string=''
  public PanCardPhoto: string = '';
  public Dis_AdharCardNumber: string = '';
  public Dis_PanCardNumber: string = '';

  public StateID: number = 0;
  public DistrictID: number = 0;
  public InstituteDivision: string = '';
  public InstituteDistrict: string = '';
  public InstituteTehsil: string = '';
  public InstituteName: string = '';
  public District: string = '';
  public Pincode: string = '';
  public Address: string = '';

  public DateOfAppointment: string = '';
  public DateOfJoining: string = '';
  public Experience: string = '';
  public Certificate: string = ''
  public Dis_Certificate: string = ''
  public SpecializationSubjectID: number = 0;
  public AnnualSalary: string = '';
  public StaffStatus: string = '';
  public PFDeduction: string = '';
  public ResearchGuide: string = '';
  public StateName: string = '';

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0
  public RTS?: string = '';
  public CreatedBy: number = 0;
  public UserID: number = 0;
  public ModifyDate?: string = '';
  public IPAddress?: string = '';
  public IsExaminer: boolean = false
  //bank details Save
  public BankName: string = '';
  public BankAccountName: string = '';
  public BankAccountNo: string = '';
  public IFSCCode: string = '';
  public DepartmentID: number = 0;

  public StatusOfStaff: number = 0;
  public ProfileStatus: number = 0
  public InstituteID: number = 0;

  public StaffIDs: string = '';

  public UGQualificationID: number = 0
  public PGQualificationID: number = 0
  public PHDQualification: number = 0
  public UGQualificationName: string = '';
  public PGQualificationName: string = '';
  public PHDQualificationName: string = '';
  public StreamCode: string = '';
  public Designation: string = '';
  public HostelID: number = 0;
  public StaffLevelID: number = 0;
  public StaffLevelChildID: number = 0;

  public InstituteDistrictID: number = 0
  public InstituteDivisionID: number = 0
  public InstituteTehsilID: number = 0

  public EduQualificationDetailsModel: Staff_EduQualificationDetailsModel[] = [];
  public StaffSubjectListModel: StaffSubjectList[]= [];
}

export class Staff_EduQualificationDetailsModel {

  public QualificationID: number = 0;
  public QualificationName: string = '';
  public StreamID: number = 0;
  public StreamName: string = '';
  public University: string = '';
  public PassingYear: string = '';
  public PassingYearID: number = 0;
  public PercentageGrade: string = '';
  public MarksheetPhoto: string = '';
  public Dis_Marksheet: string = ''
}

export class AddStaffBasicDetailDataModel extends RequestBaseModel {
  // public StaffID: number = 0;
  public ProfileID: number = 0
  public UserID: number = 0
  public StaffTypeID: number = 0;
  public SSOID: string = '';
  public Aadhaarid: string = '';
  public Bhamashahid: string = '';
  public Bhamashahmemberid: string = '';
  public Displayname: string = '';
  public Dateofbirth: string = '';
  public Gender: string = '';
  public Mobileno: string = '';
  public Telephonenumber: string = '';
  public Ipphone: string = '';
  public Mailpersonal: string = '';
  public Postaladdress: string = '';
  public Postalcode: string = '';
  public City: string = '';
  public State: string = '';
  public Photo: string = '';
  public Designation: string = '';
  public Department: string = '';
  public Mailofficial: string = '';
  public EmployeeNumber: string = '';

  public InstituteName :string=''
  public FirstName: string = '';
  public LastName: string = '';
  public SldSSOIDs: any = '';
  public JanaadhaarId: string = '';
  public ManaadhaarMemberId: string = '';
  public UserType: string = '';
  public Mfa: string = '';
  public InstituteID: number = 0;
  public RoleName: string = '';
  /*  public Name: string = '';*/
  public DesignationID: number = 0;
  public ModifyBy: number = 0
  public StatusOfStaff: number = 0;
  public CreatedBy: number = 0


  // New Work  18-02-2025

  public StaffLevelID: number = 0;
  public StaffLevelChildID: number = 0;
  public BranchID: number = 0;
  public HODsId: number = 0;
  public TechnicianID: number = 0;
  public HostelID: number = 0;
  public ExaminerStatus: number = 0;
  public StaffID: number = 0;
  public Show_StaffLevelChild: boolean = false;

  public HostelIDs: StaffHostelListModel[] = [];

  public multiHostelIDs: string = '';

  
}

export class StaffMasterSearchModel {
  public StaffID: number = 0
  public StaffTypeID: number = 0;
  public RoleID: number = 0;
  public SubjectID: number = 0;
  public StateID: number = 0;
  public DistrictID: number = 0;
  public CourseID: number = 0;
  public InstituteID: number = 0;
  public Action: string = '';
  public SSOID: string = '';
  public DepartmentID: number = 0
  public Status:number=0
  public CourseTypeId?: number = 0
  // New Work  18-02-2025

  public StaffLevelID: number = 0
  public StaffLevelChildID: number = 0
  public BranchID: number = 0
  public TechnicianID: number = 0

}

export class StaffSubjectList {
  public StreamTypeID:number=0
  public BranchID:number=0
  public ExamTypeID:number=0
  public SemesterID:number=0
  public SubjectID: number = 0
public StreamType:string=''
public BranchName:string=''
public SemesterName:string=''
public ExamType:string=''
  public SubjectName: string = ''
  public SubjectType: string = ''
 
public IsOptional:boolean=false
}


export class StaffHostelListModel {

  public ID: number = 0
  public Name: string =''
   
}

export class BranchHODModel {
  public ID: number = 0;
  public Action: string = '';
  public SSOID: string = '';
  public UserID: number = 0;
  public StreamID: number = 0;
  public CollegeID: number = 0;
  public DepartmentID: number = 0;
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DisplayName: string = '';
  public FirstName: string = '';
  public LastName: string = '';
  public MailPersonal: string = '';
  public MobileNo: string = '';
  public RoleID: number = 0;
  public EndTermID: number = 0;
  public SemesterID: number = 0;
  public StreamIDs: number[] = [];
}

export class BranchHODApplyModel {
  public Action: string = '';
  public GuestHouseID: number = 0;
  public GuestReqID: number = 0;
  public UserID: number = 0;
  public CollegeID: number = 0;
  public DepartmentID: number = 0;
  public GuestHouseName: string = '';
  public FacilitiesName: string = '';
  public IsFacilities: boolean = false;
  public ModifyBy: number = 0;
  public RoleID: number = 0;
  public Status: number = 0;
}


export class StudentEnrCancelReqModel extends RequestBaseModel {
  public StudentId: number = 0
  public ActionBy: number = 0
  public NextRoleId: number = 0
  public IsApproveOrReject: number = 0
  public Remarks: string = '';
  public CourstType: number = 0
  public ActionType: string = '';
}
export class AssignTeacherForSubjectReqModel  {
  public StreamID: number = 0;
  public SectionID: number = 0
  public NextRoleId: number = 0
  public IsApproveOrReject: number = 0
  public Remarks: string = '';
  public CourstType: number = 0
  public ActionType: string = '';
}

export class AddStaffSubjectSectionModel {
  public ID: number = 0;
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public SubjectID: number = 0;
  public SSOID: string = '';
  public UserID: number = 0;
  public StaffID: number = 0;
  public SectionIDs: string = '';
  public DisplayName: string = '';
  public DepartmentID: number = 0;
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public EndTermID: number = 0;
  public RoleID: number = 0;
  public InstituteID: number = 0;

  public StreamName: string = "";
  public SemesterName: string = "";
  public SubjectName: string = "";
  public SatffName: string = '';
  public SectionsName: string = '';
 
}

export class PostAttendanceTimeTable {
  public ID: number = 0;
  public EndTermID: number = 0;
  public FinancialYearID: number = 0;
  public CourseTypeID: number = 0;
  public StreamID: number = 0;
  public SectionID: number = 0;
  public DepartmentID: number = 0;
  public SubjectID: number = 0;
  public SemesterID: number = 0;
  public AssignToRoleID: number = 0;
  public AssignByRoleID: number = 0;
  public AssignbyStaffID: number = 0;
  public DeleteStatus: number = 0;
  public ActiveStatus: number = 1;
  public ShiftId: number = 0;
  public AssignBySSOID: string | null = null;
  public AssignToSSOID: string | null = null;
  public InstituteID: number = 0;
  public RoleID: number = 0;
  public StaffID: number = 0;
  public SectionIDs: string = "";
}

export class CalendarEventModel {
  public EventId: number = 0;
  public EventDate: Date = new Date();
  public EventType: string = "";
  public Remark: string = "";
  public Color: string = "";
  public WeekDayName: string = "";
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public AcademicYearID: number = 0;
  public CourseTypeID: number = 0;
  public IsActive: boolean = true;
  public IsDelete: boolean = false;
  public Day: number = 0; // <-- add this for calendar matching
}



