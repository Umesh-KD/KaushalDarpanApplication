import { RequestBaseModel } from "../RequestBaseModel";

export class BTER_EM_StaffListSearchModel {
    ID: number = 0;
  OfficeID: number = 0;
  PostID: number = 0;
  DepartmentID: number = 0;
  CreatedBy: number = 0;
  SSOID: string = "";
  LevelID: number = 0;
  StaffTypeID: number = 0;
  RoleID: number = 0;
  UserID: number = 0;
  Name: string = "";
}

export class BTER_EM_AddStaffDataModel extends RequestBaseModel {
  public ID: number = 0;
  public LevelID: number = 0;
  public OfficeID: number = 0;
  public StaffTypeID: number = 0;
  public PostID: number = 0;
  public IsHod: boolean = false;
  public IsNodal: boolean = false;
  public SSOID: string = '';
  public OfficeName: string = ''
  public InstituteName: string = ''
  public DistrictName: string = ''
  public PostName: string = ''
  public LevelName: string = ''
  public RoleName: string = ''
  public StaffTypeName: string = ''
  public InstituteID: number = 0
  public Name: string = ''
  public MobileNo: string = ''
  public EmailID: string = ''
  public DistrictID: number=0

  public ModifyBy: number=0
  public CourseTypeID: number=0
}

export class BTER_EM_AddStaffBasicDetailDataModel extends RequestBaseModel {
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
  public MobileNo: string = '';
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

  public InstituteName: string = ''
  public FirstName: string = '';
  public LastName: string = '';
  public SldSSOIDs: any = '';
  public JanaadhaarId: string = '';
  public ManaadhaarMemberId: string = '';
  public UserType: string = '';
  public Mfa: string = '';
  public InstituteID: number = 0;
  public RoleName: string = '';
  public DesignationID: number = 0;
  public ModifyBy: number = 0
  public StatusOfStaff: number = 0;
  public CreatedBy: number = 0

  public StaffLevelID: number = 0;
  public StaffLevelChildID: number = 0;
  public BranchID: number = 0;
  public HODsId: number = 0;
  public TechnicianID: number = 0;
  public HostelID: number = 0;
  public ExaminerStatus: number = 0;
  public StaffID: number = 0;
  public Show_StaffLevelChild: boolean = false;
  public HostelIDs: BTER_EM_StaffHostelListModel[] = [];
  public multiHostelIDs: string = '';
  public EMTypeID: number = 0;
  public guestRoomID: number = 0;
}

export class BTER_EM_StaffHostelListModel {
  public ID: number = 0
  public Name: string = ''
}

export class BTER_EM_StaffMasterSearchModel {
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
  public Status: number = 0
  public CourseTypeId?: number = 0
  public StaffLevelID: number = 0
  public StaffLevelChildID: number = 0
  public BranchID: number = 0
  public TechnicianID: number = 0
  public CreatedBy: number = 0
  public FilterName: string = '';
  public FilterStaffTypeID: number = 0;  
  public FilterSSOID: string = '';
}

export class BTER_EM_AddStaffDetailsDataModel extends RequestBaseModel {
  public InstituteID: number = 0
  public BranchID: number = 0
  public DesignationID: number = 0
  public ServiceBookBranchID: number = 0
  public Gender: number = 0
  public Name: string = ''
  public DateOfBirth: string = ''
  public DateOfAppointment: string = ''
  public DateOfJoining: string = ''
  public DateOfRetirement: string = ''
  public MobileNumber: string = ''
  public SSOID: string = ''
  public EmployeeID: string = ''
  public CurrentDesignationID: string = ''
  public Experience: string = ''
  public QualificationAtJoining: string = ''
  public QualificationAfterJoining: string = ''
  public Remark: string = ''

  public ProfileStatusID?: number = 0

  public StaffUserID: number = 0
  public ModifyBy: number = 0
  public StaffID: number = 0
  public UserID: number = 0
  public OfficeID: number = 0
  public EduQualificationDetailsModel: Staff_EduQualificationDetailsModel[] = [];
  public bterStaffSubjectListModel: BterStaffSubjectList[] = [];

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
export class BterStaffSubjectList {
  public StreamTypeID: number = 0
  public BranchID: number = 0
  public ExamTypeID: number = 0
  public SemesterID: number = 0
  public SubjectID: number = 0
  public StreamType: string = ''
  public BranchName: string = ''
  public SemesterName: string = ''
  public ExamType: string = ''
  public SubjectName: string = ''
  public SubjectType: string = ''

  public IsOptional: boolean = false
}
export class BTER_EM_GetPersonalDetailByUserID{
    public StaffUserID: number = 0
    public SSOID: string = ''
    public DepartmentID: number = 0
}

export class BTER_EM_ApproveStaffDataModel extends RequestBaseModel {
  public InstitiuteID: number = 0
  public BranchID: number = 0
  public SanctionedPosts: number = 0 // dropdown
  public IsWorking: boolean = false // radio button
  public IsExtraWorking: boolean = false
  public IsVacant: boolean = false
  public OccupiedVacant: number = 0
  public SSOID: string = '' // textbox
  public Name: string = ''
  public DesignationID: number = 0  

  public Gender: number = 0
  public MobileNumber: string = ''
  public EmployeeID: string = ''
  public DateOfBirth: string = ''
  public Experience: number = 0

  public IsEmpWorkingOnPost: boolean = false

  public IsEmpWorkingOnDeputationFromOther: boolean = false
  public EmpInstituteID: number = 0

  public EmpBranchID: number = 0

  public IsEmpWorkingOnDeputationToOther: boolean = false
  public EmpDeputatedInstituteID: number = 0 

  public IsSalaryDrawnFromSamePost: boolean = false
  public SalaryDrawnPostID: number = 0
  public IsSalaryDrawnFromOtherInstitute: boolean = false
  public SalaryDrawnInstituteID: number = 0
  public DateOfRetirement: string = ''
  public AnyCourtCasePending: boolean = false
  public AnyDisciplinaryActionPending: boolean = false
  public ExtraOrdinaryLeave: boolean = false
  public SelectionCategory: string = ''

  public HigherEduPermission: boolean = false
  public HigherEduInstitute: string = ''
  public Remark: string = ''

  public StaffID: number = 0
  public UserID: number = 0
  public StaffUserID: number = 0
  public ProfileStatusID: number = 0

  public ModifyBy: number = 0
}

export class BTER_EM_DeleteModel extends RequestBaseModel {
  public ID: number = 0
  public ModifyBy: number = 0
}

export class BTER_EM_UnlockProfileDataModel {
  public StaffUserID: number = 0
  public StaffID: number = 0
  public SSOID: string = ''
  public ModifyBy: number = 0
}


/*----------------Bter EM-------*/
export class Bter_RequestUpdateStatus {
  ID: number = 0;
  ServiceRequestId: number = 0;
  StatusIDs: number = 0;
  Remark: string = '';
  SSOID: string = '';
  DepartmentID: number = 0;
  CreatedBy: number = 0;
  ProfileStatusID: number = 0;
  RequestType: number = 0;
  RequestTypeID: number = 0;
  LastWorkingDate: string = '';
  JoiningDate: string = '';
  UserID: number = 0;

}


export class BTERGovtEMStaff_ServiceDetailsOfPersonalModel {
  public ID: number = 0;
  public FromDate: string = '';
  public ToDate: string = '';
  public OriginalPositionID: number = 0;
  public CoreBusinessID: number = 0;
  public DistrictID: number = 0;
  public BlockID: number = 0;
  public GramPanchayatID: number = 0;
  public NameOfRevenueVillage: string = '';
  public NameAndLocationOfTheInstitution_Office: string = '';
  public City_VillageID: number = 0;
  public PostingDirectRecruitment_PromotionID: number = 0;
  public GradationOrderNumberAndDate: string = '';
  public CadreID: number = 0;
  public ConfirmationDate: string = '';
  public DuffelCarriageOrderNoDate: string = '';
  public StaffUserID: number = 0;
  public DepartmentID: number = 0;
  public EndTermId: number = 0;
  public CourseTypeID: number = 0;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public LevelOfExamName: string = '';
  public ExamTypeName: string = '';
  public OriginalPositionName: string = '';
  public CoreBusinessName: string = '';
  public DistrictName: string = '';
  public BlockName: string = '';
  public GramPanchayatName: string = '';
  public City_Village: string = '';
  public PostingDirectRecruitment_Promotion: string = '';
  public CasteName: string = '';

}

export class BTERGovtEMStaffMasterDataModel {

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
  public FolderName: string = ''
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

  public EduQualificationDetailsModel: BTERGovtEMStaff_EduQualificationDetailsModel[] = [];
  public StaffSubjectListModel: BTERGovtEMStaffSubjectList[] = [];
}

export class BTERGovtEMStaff_EduQualificationDetailsModel {

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


export class BTERGovtEMStaffSubjectList {
  public StreamTypeID: number = 0
  public BranchID: number = 0
  public ExamTypeID: number = 0
  public SemesterID: number = 0
  public SubjectID: number = 0
  public StreamType: string = ''
  public BranchName: string = ''
  public SemesterName: string = ''
  public ExamType: string = ''
  public SubjectName: string = ''
  public SubjectType: string = ''

  public IsOptional: boolean = false
}


export class BTER_Govt_EM_ZonalOFFICERSSearchDataModel {
  ID: number = 0;
  OfficeID: number = 0;
  PostID: number = 0;
  DepartmentID: number = 0;
  CreatedBy: number = 0;
  SSOID: string = "";
  LevelID: number = 0;
  StaffTypeID: number = 0;
  Name: string = "";
}

export class BTER_Govt_EM_PersonalDetailByUserIDSearchModel {

  public StaffID: number = 0;
  public StaffUserID: number = 0;
  public Action: string = '';
  public SSOID: string = '';

}

export class BTER_Govt_EM_ServiceDeleteModel {

  public StaffID: number = 0;
  public UserID: number = 0;

}



export class UpdateSSOIDByPricipleModel {

  public StaffID: number = 0
  public SSOID: string = ''
  public UserID: number = 0;
}
export class Bter_Govt_EM_UserRequestHistoryListSearchDataModel {
  DepartmentID: number = 0;
  StaffUserID: number = 0;
  StaffID: number = 0;

}
