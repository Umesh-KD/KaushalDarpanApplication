import { IMenu } from "../Services/Loader/loader.interceptor";

export class SSOLoginDataModel {

  public ProfileID: number = 0
  public UserID: number = 0
  public OfficeID: number = 0
  public LevelId: number = 0
  public ApplicationID: number = 0
  public ApplicationFinalSubmit: number = 0
  public SSOID: string = '';
  public Aadhaarid: string = '';
  public Bhamashahid: string = '';
  public Bhamashahmemberid: string = '';
  public DisplayName: string = '';
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
  public DepartmentName: string = '';
  public Mailofficial: string = '';
  public EmployeeNumber: string = '';
  public DepartmentID: number = 0;
  public FirstName: string = '';
  public LastName: string = '';
  public SldSSOIDs: any = '';
  public JanaadhaarId: string = '';
  public ManaadhaarMemberId: string = '';
  public UserType: string = '';
  public Mfa: string = '';
  public RoleID: number = 0;
  public InstituteID: number = 0;
  public RoleName: string = '';
  public StudentID: number = 0;
  public CandidateID?: number = 0;
  public InstituteName: string = '';
  public Eng_NonEng: number = 0;
  public Eng_NonEngName: string = '';
  public FinancialYearID: number = 0;
  public EndTermID: number = 0;
  public TermPart: number = 0;
  public FinancialYearID_Session: number = 0;
  public EndTermID_Session: number = 0;
  public HostelID: number = 0;
  public IsMutiHostelWarden: boolean = false;
  public IsCitizenQueryUser: boolean = false;
  public QueryType: number = 0;
  public HostelIDs: string = '';
  public SubjectCode: string = '';
  public GuestRoomID: number = 0;
  public StaffID: number = 0;
  public ExamScheme: number = 0;
  public ServiceID: string = '';
  public IsKiosk: boolean = false;
  public KIOSKCODE: string = '';
  public SSoToken: string = '';
  public EmTypeId: number = 0;
  public SSOMenu: IMenu[] = [];
  public PrincipleSSOID?: string = '';
  public PrincipleMobile?: string = '';
  public collageID: number = 0;
  //public MobileNo: number = 0;
  public ShowSessionSelection: number = 0;
  public SelectedValue: number = 0;
  public DistrictID: number = 0;
  public StaffTypeID?:number=0;
  public ManagementTypeId?:number=0;
  public OfficeName:string='';
  public GuestHouseID?: string = ''
  public SelectedInsituteID: number = 0;
  public IsShowFinYearDDL: number = 0;
  public GenderID: number = 0;

}


export class SSOLandingDataDataModel {
  public Username: string = '';
  public LoginType: string = '';
  public Password: string = '';
 
}
export class UpdateStudentDetailsModel {
  public UserID: number = 0;
  public ProfileID: number = 0;
  public SSOID: string = '';
  public RoleID: number = 0;
}


export class ItiPlanningSearchModel {
  public InstituteID:number=0
  public DistrictID:number=0
  public IsNewCollege: number = 2
  public CollegeName: string = ''
  public RoleID:number=0
  public UserID:number=0
  public AnnoucementType:number=0
  public Esttablishment_Year: number = 0
}

export class MenuDataModel {
  public GroupId: number = 0
  public GroupId_Count: number = 0
  public LevelNo: number = 0
  public MenuId: number = 0
  public ParentId: number = 0
  public Priority: number = 0

  public IDdd: string = ''
  public Icon: string = ''
  public MenuName: string = ''
  public OnSelect: string = ''

  public IsMobileMenu: boolean = false
  public U_Add: boolean = false
  public U_Delete: boolean = false
  public U_Print: boolean = false
  public U_Update: boolean = false
  public U_View: boolean = false
}