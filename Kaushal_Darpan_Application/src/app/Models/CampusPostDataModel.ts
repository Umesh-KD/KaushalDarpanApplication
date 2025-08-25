export class CampusPostMasterModel {
  public AID: number = 0;
  public PostID: number = 0;
  public PostNo: string = '';
  public PostCollegeID: number = 0;
  public RoleID: number = 0;
  public PostSSOID: string = '';
  public CompanyID: number = 0;
  public CompanyTypeID: number = 0;
  public Website: string = '';
  public StateID: number = 0;
  public DistrictID: number = 0;
  public IsMainRole: number = 0;
  public Address: string = '';
  public HR_Name: string = '';
  public HR_MobileNo: string = '';
  public HR_Email: string = '';
  public HR_SSOID: string = '';
  public JobDiscription: string = '';
  public Dis_JobDiscription: string = '';
  public CampusVenue: string = '';
  public CampusVenueLocation: string = '';
  public CampusFromDate: string = '';
  public CampusFromTime: string = '';
  public CampusToDate: string = '';
  public CampusToTime: string = '';
  public CampusAddress: string = '';
  public Action: string = '';
  public ActionRemarks: string = '';
  public ActionBy: number = 0;
  public ActionRTS?: string = '';
  public CompanyName: string = '';
  public Marked: boolean = false;
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public RTS?: string = '';
  public CreatedBy: number = 0;
  public UserID: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate?: string = '';
  public IPAddress?: string = '';
  public DepartmentID: number = 0;
  public CampusPostType: number = 234;
  public EligibilityCriteriaModel: CampusPostMaster_EligibilityCriteriaModel[] = [];
}
export class CampusPostMaster_EligibilityCriteriaModel {
  public AID: number = 0;
  public PostID: number = 0;
  public BranchID: number = 0;
  public BranchName: string = '';
  public PassingYear: number = 2025;
  public ToPassingYear: number = 2026;
  public SalaryTypeID: number = 0;
  //public SemesterID: number = 0;
  //public SemesterName: string = '';
  public MinPre_10: number = 1;
  public MinPre_12: number = 1;
  public MinPre_Diploma: number = 1;
  public NoofBackPapersAllowed: number = 0;
  public AgeAllowedFrom: string = '2007-08-21';
  public AgeAllowedTo: string = '2007-08-21';
  public HiringRoleID: number = 0;
  public HiringRoleName: string = '';
  public NoofPositions: number = 0;
  public CTC: string = '';
  public SalaryRemark: string = 'Per Month';
  public Gender: string = 'Male and Female Both';
  public OtherBenefit: string = '';
  public CampusType: string = '0';
  public InterviewType: string = 'Written And Interview';
  public NoOfInterviewRound: number = 2;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public Dis_AgeAllowedFrom: string = '';
  public Dis_AgeAllowedTo: string = '';
  public EligibleInstitutesID: number = 96;
  public EligibleInstitutesName: string ='';
  public SalaryName: string ='';
}

export class CampusPostMaster_Action {
  public PostID: number = 0;
  public Action: string = '0';
  public ActionRemarks: string = '';
  public ActionBy: number = 0;
  public DepartmentID: number = 0;
  public CompanyID: number = 0;
  public PostCollegeID: number = 0;
  public Dis_SuspendDoc: string = '';
  public SuspendDocumnet: string = '';
}


export class CampusPostQRDetail {
  public Address: string = '';
  public CampusAddress: string = '';
  public CampusFromDate: string = '';  // Use Date if you plan to parse this as a date
  public CampusToDate: string = '';    // Same as above
  public CampusTypeClass: string = '';
  public CampusVenue: string = '';
  public CompanyAddress: string = '';
  public CompanyID: number = 0;
  public CompanyName: string = '';
  public DistrictID: number = 0;
  public HR_Email: string = '';
  public HR_MobileNo: string = '';
  public HR_Name: string = '';
  public InstituteCode: string = '';
  public PostCollegeID: number = 0;
  public PostID: number = 0;
  public PostNo: string = '';
  public RoleDetails: string = '';
  public StateID: number = 0;
  public Status: string = '';
  public TPOCollegeName: string = '';
  public TPOSSOID: string = '';
  public Website: string = '';
}
