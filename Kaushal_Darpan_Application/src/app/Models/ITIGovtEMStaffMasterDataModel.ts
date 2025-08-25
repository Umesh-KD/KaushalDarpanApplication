import { RequestBaseModel } from "./RequestBaseModel";

export class ITIGovtEMStaffMasterDataModel {

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

  public EduQualificationDetailsModel: ITIGovtEMStaff_EduQualificationDetailsModel[] = [];
  public StaffSubjectListModel: ITIGovtEMStaffSubjectList[] = [];
}

export class ITIGovtEMStaff_EduQualificationDetailsModel {

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

export class ITIGovtEMAddStaffBasicDetailDataModel extends RequestBaseModel {
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

  public HostelIDs: ITIGovtEMStaffHostelListModel[] = [];

  public multiHostelIDs: string = '';

  public EMTypeID: number = 0;
  public OfficeID: number = 0;


}

export class ITIGovtEMStaffMasterSearchModel {
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
  // New Work  18-02-2025

  public StaffLevelID: number = 0
  public StaffLevelChildID: number = 0
  public BranchID: number = 0
  public TechnicianID: number = 0
  public CreatedBy: number = 0

  public FilterName: string = '';
  public FilterStaffTypeID: number = 0;  
  public FilterSSOID: string = '';
}

export class ITIGovtEMStaffSubjectList {
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


export class ITIGovtEMStaffHostelListModel {

  public ID: number = 0
  public Name: string = ''

}
export class UpdateSSOIDByPricipleModel {

  public StaffID: number = 0
  public SSOID: string = ''
  public UserID: number = 0;
}

export class ITIGovtUserPrincipMasterSerchModel {
  public MenuId: number = 0;
  public MenuNameEn: string = '';
  public DepartmentID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleId: number = 0;

}


export class ITIGovtEM_OfficeSearchModel {
  public officeID: number = 0;
  public officeName: string = '';
  public levelID: number = 0;
  public levelName: string = '';
  public departmentID: number = 0;
}

export class ITIGovtEM_OfficeSaveDataModel {
  public officeID: number = 0;
  public officeName: string = '';
  public departmentID: number = 0;
  public levelID: number = 0;
  public endTermId: number = 0;
  public courseTypeID: number = 0;
  public createdBy: number = 0;
  public modifyBy: number = 0;

}

export class ITI_Govt_EM_OFFICERSDataModel {
  ID: number = 0;
  DivisionID: number = 0;
  DistrictID: number = 0;
  DepartmentID: number = 0;
  NameOfDistrict: string = '';
  NameOfInstitution_office: string = '';
  NameOfOfficer_DDO: string = '';
  AdditionalCharage_DDO: string = '';
  ActiveStatus: boolean = false;
  DeleteStatus: boolean = false;
  RTS: string = '';
  CreatedBy: number = 0;
  ModifyBy: number = 0;
  ModifyDate: string = '';
  IPAddress: string = '';
  DivisionName: string = '';
  DistrictName: string = '';
}

export class ITI_Govt_EM_OFFICERSSearchDataModel {
  ID: number = 0;
  DivisionID: number = 0;
}

export class ITI_Govt_EM_ZonalOFFICERSSearchDataModel {
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

export class ITI_Govt_EM_ZonalOFFICERSDataModel {
  public ID: number = 0;
  public LevelID: number = 0;
  public OfficeID: number = 0;
  public StaffTypeID: number = 0;
  public PostID: number = 0;
  public RoleID: number = 0;
  public IsHod: boolean = false;
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

}

export class ITIGovtEM_PostSearchModel {
  public ID: number = 0;
  public OfficeID: number = 0;
  public officeName: string = '';
  public PostName: string = '';

  public departmentID: number = 0;
}

export class ITIGovtEM_PostSaveDataModel {
  public ID: number = 0;
  public OfficeID: number = 0;
  public OfficeName: string = '';
  public PostName: string = '';
  public departmentID: number = 0;

  public endTermId: number = 0;
  public courseTypeID: number = 0;
  public createdBy: number = 0;
  public modifyBy: number = 0;

}

export class ITIGovtEMStaff_PersonalDetailsModel {
  public ID: number = 0;
  public StaffID: number = 0;
  public Name: string = '';
  public EmployeeID: string = '';
  public CurrentBasicDesignationID: number = 0;
  public CoreBusiness: string = '';
  public CurrentPostingEmp: number = 0;
  public DateofPostingEmp: string = '';
  public GenderID: number = 0;
  public PanCardNumber: string = '';
  public BloodGroupID: number = 0;
  public FatherName: string = '';
  public DateOfBirth: string = '';
  public MaritalStatusID: number = 0;
  public Husband_WifeName: string = '';
  public ServiceTypeHWID: number = 0;
  public EmployeeIDOfHusband_Wife: string = '';
  public CastID: number = 0;
  public ReligionID: number = 0;
  public DivyangID: number = 0;
  public BeforeChildren: number = 0;
  public AfterChildren: number = 0;
  public TotalChildren: number = 0;
  public Address: string = '';
  public Pincode: string = '';
  public StateID: number = 0;
  public DistrictID: number = 0;
  public StateHomeStateID: number = 0;
  public Email: string = '';
  public MobileNumber: string = '';
  public AdharCardNumber: string = '';
  public BhamashahNo: string = '';
  public PassportNo: string = '';
  public CITSPassedYears: string = '';
  public DateOfJoiningGvernmentOfEmp: string = '';
  public FirstPostJoiningDateEmp: string = '';
  public JudicialCasePendingID: number = 0;
  public SpecialAbilityID: number = 0;
  public DepartmentalEnquiryPendingID: number = 0;
  public PunishedInDepartmentalInquiryID: number = 0;
  public DateOfPunishment: string = '';
  public DistrictYear: string = '';
  public DistrictCommak: string = '';
  public DivisionLevelYear: string = '';
  public DivisionLevelCommak: string = '';
  public StateYear: string = '';
  public StateCommak: string = '';
  public PromotionList: ITIGovtEMStaff_promotionModel[] = []
  public isSeniorInstructor: boolean = false;
  public isRenounced: boolean = false;
  public isDepartmentalMixed: boolean = false;

}

export class ITIGovtEMStaff_EmployeeIsWorkingAsJuniorInstructorOrSeniorInstructorModel {

  public CITSPassedIfYesWhichYearPassed: string = '';
  public TheFirstDateOfJoiningAnyGovernmentServiceOfTheEmployee: string = '';
  public PersonnelOnWhichPostFirstJoiningDate: string = '';
  public SpecialAbility: number = 0;
  public JudicialCasePending: number = 0;
  public DepartmentalEnquiryUnderConsideration: number = 0;
  public PunishedInDepartmentalEnquiry: number = 0;
  public DateOfPunishment: string = '';

}


export class ITIGovtEMStaff_DetailsOfDepartmentalMixedSeniorityForThePresentPostModel {
  public DistrictLevelYear: string = '';
  public DistrictLevelCommak: string = '';
  public DivisionLevelYear: string = '';
  public DivisionLevelNo: string = '';
  public StateLevelYear: string = '';
  public StateLevelCommack: string = '';
}
export class ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel {
  public ID: number = 0;
  public LevelOfExamID: number = 0;
  public NameOfTheExam: string = '';
  public ExamTypeID: number = 0;
  public NameOfTheBoard_University: string = '';
  public StateOfTheBoard_University: string = '';
  public DateOfPassing: string = '';
  public YearOfPassing: string = '';
  public Subject_Occupation_Branch: string = '';
  public NameOfTheInstituteFromWherePassed: string = '';
  public StaffUserID: number = 0;
  public DepartmentID: number = 0;
  public EndTermId: number = 0;
  public CourseTypeID: number = 0;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public LevelOfExamName: string = '';
  public ExamTypeName: string = '';
}

export class ITIGovtEMStaff_ServiceDetailsOfPersonalModel {
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

export class ITIGovtEMStaff_promotionModel {
  public PromotionDate: string = '';
  public PostID: number = 0;
  public Business: string = '';
  public PostName: string = '';
  public ID: number = 0;
}


export class ITI_Govt_EM_SanctionedPostBasedInstituteModel {
  public InstituteID: number = 0;
  public SanctionedBudgetPostID: number = 0;
  public P_GID: number = 0;
  public PersonnelPostID: number = 0;
  public SSOID: string = '';
  public EmpName: string = ''
  public SanctionedBudgetBusiness: string = ''
  public PersonnelBusiness: string = ''
  public PostingType: string = ''
  public DateOfJoiningRetiredPersonnelHonorarium: string = ''
  public DateDepartureAssignedWork: string = ''
  public BudgetChief: string = ''
  public InstituteName: string = ''
  public SanctionedBudgetPostName: string = ''
  public P_GName: string = ''
  public PersonnelPostName: string = ''
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public CreatedBy: number = 0;


}

export class ITI_Govt_EM_SanctionedPostBasedInstituteSearchDataModel {
  ID: number = 0;
  OfficeID: number = 0;
  PostID: number = 0;
  DepartmentID: number = 0;
  CreatedBy: number = 0;
}
export class RequestUpdateStatus {
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
  

  IsEOL: boolean = false;
  EOLFromDate: string = '';
  EOLToDate: string = '';
  IsEnquiries: boolean = false;
  Comments: string = '';
  IsAccount: boolean = false;
  AccountComments: string = '';
  RoleID: number = 0;
}

export class ITI_Govt_EM_RoleOfficeMapping_GetAllDataSearchDataModel {
  ID: number = 0;
  OfficeID: number = 0;
  PostID: number = 0;
  DepartmentID: number = 0;
  CreatedBy: number = 0;
}
export class ITI_Govt_EM_PersonalDetailByUserIDSearchModel {

  public StaffID: number = 0;
  public StaffUserID: number = 0;
  public Action: string = '';
  public SSOID: string = '';

}

export class ITI_Govt_EM_PersonalDetailByUserIDDeleteModel {

  public StaffID: number = 0;
  public UserID: number = 0; 

}

export class ITI_Govt_EM_EducationDeleteModel {

  public StaffID: number = 0;
  public UserID: number = 0;

}

export class ITI_Govt_EM_ServiceDeleteModel {

  public StaffID: number = 0;
  public UserID: number = 0;

}
export class JoiningLetterSearchModel {

  public UserID: number = 0;

}
export class RelievingLetterSearchModel {

  public UserID: number = 0;

}

export class ITI_Govt_EM_NodalSearchDataModel {
 
  DistrictID: number = 0; 
  DepartmentID: number = 0;
  LevelID: number = 0;
 
}

export class ITI_Govt_EM_UserRequestHistoryListSearchDataModel { 
  DepartmentID: number = 0;
  StaffUserID: number = 0;
  StaffID: number = 0; 

}
export class DeleteModel {

  public ID: number = 0;
  public ModifyBy: number = 0;

}

export class BTERRequestUpdateStatus {
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
  
  IsEOL: boolean = false;
  EOLFromDate: string = '';
  EOLToDate: string = '';
  IsEnquiries: boolean = false;
  Comments: string = '';
  IsAccount: boolean = false;
  AccountComments: string = '';
  RoleID: number = 0;
}
export class Bter_Govt_EM_SanctionedPostBasedInstituteSearchDataModel {
  ID: number = 0;
  OfficeID: number = 0;
  PostID: number = 0;
  DepartmentID: number = 0;
  CreatedBy: number = 0;
}
export class BterStaffUserRequestReportSearchModel {
  action: string = '';
  userID: number = 0;
  staffUserID: number = 0;
  staffID: number = 0;
  RequestType: number = 0;
  statusID: number = 0;
  OfficeID: number = 0;
  levelID: number = 0;
  departmentID: number = 0;
  orderNo: string = '';
  orderDate: string = '';
  relievingDate: string = '';
  joiningDate: string = '';
  requestDate: string = '';
  postID: number = 0;
  StaffTypeID: number = 0;
  PageSize: number = 0;
  PageNumber: number = 0;
  PostID: number = 0;
 
}

export class HODDashboardSearchModel {
  public DepartmentID: number = 0;
  public ModifyBy: number = 0;
  public UserID: number = 0;
  public Eng_NonEng: number = 0;
  public EndTermID: number = 0;
  public RoleID: number = 0;
  public InstituteID: number = 0
  public InvigilatorAppointmentID: number = 0
  public StaffID: number = 0
  public SSOID: string = ''
}
