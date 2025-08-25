import { RequestBaseModel } from "../RequestBaseModel";

export class ITI_IIPManageDataModel extends RequestBaseModel{
    public regOfficeID: number = 0;
    public RegOfficeName: string = ''
    public RegNumber: string = ''
    public RegDate: string = ''
    public RegLink: string = ''
    public IMCMemberDetails: IIPManageMemberDetailsDataModel[] = []
    public UserID: number = 0
  
}

export class IIPManageMemberDetailsDataModel extends RequestBaseModel {
    public MemberTypeID?: number = 0
    public MemberTypeName: string = ''
    public MemberName: string = ''
    public MemberAddress: string = ''
    public MemberEmail: string = ''
    public MemberContact: string = ''

}

export class IIPManageFundSearchModel extends RequestBaseModel {
  public FundID: number = 0
  public UserID: number = 0
  public QuarterID?: number
  public IMCRegID: number = 0
  public InstalmentPaid?: number;
  public InstalmentPending?: number;
  public SchemeSanctioned?: number;
  public TradeAffiliated?: number;
  public TradeNotAffiliated?: number;
  public InstalmentPaidAmt: string = ''
  public InstalmentPendingAmt: string = ''
  public SchemeSanctionedTrade: string = ''
  public TradeAffiliatedName: string = ''
  public TradeNotAffiliatedName: string = ''
  public Remarks: string = ''
  public OrderDate: string = ''
  public SanctionedTradeList: TradeList[] = []
  public AffilateTradeList: TradeList[] = []
  public NotAffilateTradeList: TradeList[] = []
}

export class TradeList extends RequestBaseModel {
  public ID?: number = 0
  public TypeId?: number = 0
  public Name: string = ''

}


export class IMCFundRevenue extends RequestBaseModel {
  public ID: number = 0;;
  public IMCFundID: number = 0;
  public IMCRegID: number = 0;
 
  public InterestReceivedAmt?: number
  public AdmissionFeesAmt?: number
  public OtherRevenueAmt?: number
  public TotalRevenueAmt?: number
 
  public CivilAmt?: number 
  public ToolsAmt?: number 
  public FurnitureAmt?: number 
  public BooksAmt?: number 
  public AdditionalAmt?: number 
  public MaintenanceAmt?: number
  public MiscellaneousAmt?: number 
  public TotalExpenditureAmt?: number 
  
  public FundAvailableAmt?: number 
   
  public FinancialYearId: number = 0;
  public QuarterID: number = 0;
 
  public RTS: string = '';          
  public UserID: number = 0;
  public ModifyDate?: string;     

}


export class ITI_IIPManageDropdownModel extends RequestBaseModel {
    public action: string = ''
    public DistrictID: number = 0
    public InstituteID: number = 0
    public ManagementTypeID?: number = 0
}

export class ITI_IIPManageSearchModel extends RequestBaseModel {
    public IIPManageTeamID?: number = 0
    public Status?: number = 0
    public IIPManageID?: number = 0
    public TypeID?: number = 0
    public DeploymentDate?: string = ''
    public IIPManageTeamName?: string = ''
    public DeploymentStatus?: string = ""
    public TeamName?: string = ''
    public StaffID?: number = 0
    public UserID?: number = 0
    public LevelId?: number = 0

  public DeploymentDateFrom: string = ''
  public DeploymentDateTo: string = ''
}

export class IIPManageGenOrderDataModel extends RequestBaseModel {
    public DistrictID: number = 0
    public InstituteID: number = 0
    public ShiftID: number = 0
    public DeploymentDate: string = ''
    public IIPManageTeamID: number = 0
    public UserID: number = 0
    public IIPManageTeamName: string = ''
    public IPAddress: string = ''

    public DistrictName: string = ''
    public InstituteName: string = ''
    public Selected: boolean = false
    public DeploymentStatus: number = 0
    public DeploymentID: number = 0

  public DeploymentDateFrom: string = ''
  public DeploymentDateTo: string = ''

    public IIPManageMemberDetails: IIPManageMemberDetailsDataModel[] = []
}


export class SaveCheckSSODataModel extends RequestBaseModel {
  public ID: number = 0
  public DistrictID: number = 0
  public InstituteID: number = 0
  public StreamID: number = 0
  public SemesterID: number = 0
  public SSOID: string = ''
  public ShiftID: number = 0
  public StaffID: number = 0
  public ManagementTypeID?: number = 0
  IsIncharge: boolean = false

  public Name: string = ''
  public MobileNo: string = ''
  public EmailID: string = ''

  public DeploymentDateFrom?: string = ''
  public DeploymentDateTo?: string = ''
}
