import { Counselling_DocumentDetailsModel } from "./DocumentDetailsModel";
import { RequestBaseModel } from "./RequestBaseModel";

export class CounsellingApplicationFormDataModel {
  public CandidateID: number = 0;
  public SSOID?: string = '';
  public CandidateName?: string = '';
  public FatherName?: string = '';
  public MotherName?: string = '';
  public GenderId: number = 0;
  public DOB?: string = '';
  public CategoryA_ID: number = 0;
  public CategoryB_ID: number = 0;
  public MobileNo?: string = '';
  public Email?: string = '';
  public Address1?: string = '';
  public Address2?: string = '';
  public Address3?: string = '';
  public StateID: number = 0;
  public DistrictID: number = 0;
  public BlockID: number = 0;
  public Pincode?: string = '';
  public AadharNo?: string = '';
  public JanAadharNo?: string = '';
  public JanAadharMobileNo?: string = '';
  public JanAadharName?: string = '';
  public JanAadharMemberId?: string = '';
  public Remark?: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
  public CourseType?: string = '';
  public ProfileStatus: number = 0;
  public ApplicationNo?: string = '';
  public ReligionID: number = 0;
  public NationalityID: number = 0;
  public MaritalID: number = 0;
  public PWDCategoryID: number = 0;
  public IsMinority: boolean = false;
  public IsFinalSubmit: number = 0;
  public DepartmentName?: string = '';
  public SubmittedStep?: string = '';

  public RollNumber?: string = '';
  public Designation?: string = '';
  public Trade?: string = '';
  public MeritNo?: string = '';
  public SelectionCategoryID?: number = 0;
  public IsTSP?: boolean = false;
  public HomeDistrictID?: number = 0;
  public IsPH?: boolean = false;
  public IsExServicemen?: boolean = false;
  public IsSportsPerson?: boolean = false;
  public IsSpouseInSameService?: boolean = false;
  public IsShahidDependent?: boolean = false;
  public IsAnyIncurableDiseases?: boolean = false;
}

export class CounsellingApplicationSearchModel {
  public CandidateId?: number = 0; 
  public DepartmentID?: number = 0;
  public SSOID?: string = '';
  public JanAadharMemberID?: string = '';
  public JanAadharNo?: string = '';
  public CandidateName?: string = ''; 
  public MobileNo?: string = '';
  
  public AadharNo?: string = '';
  public DOB?: string = '';
  public Action?: string = '';
  public ModifyBy?: number = 0;
}

export class Counselling_OptionFormDataModel extends RequestBaseModel{
    public OptionID?: number = 0;
    public Priority?: number = 0;
    public CandidateID?: number = 0;
    public TradeId?: number = 0;
    public TradeName?: string = '';
    public InstituteID?: number = 0;
    public CourseType?: number = 0;
    public ModifyBy?: number = 0;
    public Type?: string = '';
    public InstituteList?: InstituteListDataModel_Coun[] = [];
}

export class InstituteListDataModel_Coun {
  public InstituteOptionID?: number = 0;
  public InstituteID?: number = 0;
  public Priority?: number = 0;
  public InstituteName?: string = '';
  public OptionID?: number = 0;
  public Type?: string = '';
}

export class Counselling_DropdownDataModel extends RequestBaseModel {
    public Action?: string = '';
    public TradeID?: number = 0;
    public InstituteID?: number = 0;
}

export class CounsellingApplicationPreviewDataModel {
    CandidateID?: number = 0;
    ApplicationNo?: string = '';
    CandidateName?: string = '';
    FatherName?: string = '';
    MotherName?: string = '';
    AadharNo?: string = '';
    MaritalStatusName?: string = '';
    Religion?: string = '';
    DOB?: string = '';
    Email?: string = '';
    CategoryA?: string = '';
    MobileNo?: string = '';
    AddressLine1?: string = '';
    AddressLine2?: string = '';
    AddressLine3?: string = '';
    StateName?: string = '';
    DistrictName?: string = '';
    BlockName?: string = '';
    Pincode?: string = '';
    Age?: string = '';
    StudentPhoto?: string = '';
    SignaturePhoto?: string = '';
    ProfileStatus?: number = 0;
    ServiceID?: number = 0;
    DepartmentID?: number = 0;
    CourseTypeID?: number = 0;
    UniqueServiceID?: number = 0;
    OptionViewData?: OptionviewData_Counselling[] = [];
    PendingDataModel?: PendingDataModel_Counselling[] = [];
    DocumentDetailList?: Counselling_DocumentDetailsModel[] = [];
    CategoryAId?: number = 0;
    GenderId?: number = 0;
    IsFinalSubmit?: number = 0;
    Nationality?: string = '';
    Category_E?: string = '';
}

export class OptionviewData_Counselling {
    InstituteName?: string = '';
    TradeId?: number = 0;
    OptionID?: number = 0;
    Priority?: number = 0;
    TradeName?: string = '';
}

export class PendingDataModel_Counselling {
    Pending?: string = '';
    Index?: number = 0;
}

