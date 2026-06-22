export class ITI_PlanningCollegesModel {
  public PlanningID: number = 0;
  public CollegeId: number = 0;
  public InstitutionCategoryId: number = 0;
  public InstituteManagementId: number = 0;
  public TrustSociety: number = 0;
  public TrustSocietyName?: string = '';
  public CollegeName?: string = '';
  public CollegeCode?: string = '';
  public MISC?: string = '';
  public RegNo?: string = '';
  public RegDate?: string = '';
  public ManageRegOffice?: string = '';
  public RegOfficeStateID: number = 0;
  public RegOfficeDistrictID: number = 0;
  public RegFileName?: string = '';
  public RegDisFileName?: string = '';
  public LastElectionDate?: string = '';
  public LastElectionValidUpTo?: string = '';
  public MemberIdProofName?: string = '';
  public MemberIdDisProofName?: string = '';
  public OwnerShipID: number = 0;
  public IsRented: number = 0;
  public AgreementLeaseDate?: string = '';
  public ValidUpToLeaseDate?: string = '';
  public InstituteRegOffice?: string = '';
  public InstituteStateID: number = 0;
  public InstituteDistrictID?: number = 0;
  public AgreementFileName?: string = '';
  public AgreementDisFileName?: string = '';
  public IsOwnRented: number = 0;
  public PlotHouseBuildingNo?: string = '';
  public StreetRoadLane?: string = '';
  public AreaLocalitySector?: string = '';
  public LandMark?: string = '';
  public InstituteDivisionID: number = 0;
  public InstituteSubDivisionID: number = 0;
  public PropDistrictID: number = 0;
  public PropTehsilID: number = 0;
  public PropUrbanRural: number = 0;
  public AdministrativeBodyId: number = 0;
  public VillageID?: number = 0;
  public CityID?: number = 0;
  public WardNo?: string = '';
  public KhasraKhataNo?: string = '';
  public BighaYard?: string = '';
  public LatLongFileName?: string = '';
  public LatLongDisFileName?: string = '';
  public Longitude?: string = '';
  public Latitude?: string = '';
  public ContactNo?: string = '';
  public Email?: string = '';
  public AlternateEmail?: string = '';
  public Website?: string = '';
  public ConsumerName?: string = '';
  public KNo?: string = '';
  public ConnectionType?: number = 0;
  public SanctionLoad?: string = '';
  public ContractDemand?: string = '';
  public Bill_Filename:string=''
  public Bill_DisFilename:string=''
  public DISCOM: number= 0;
  public SubDivOffice?: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public IPAddress?: string = '';
  public DepartmentID: number = 0;
  public GramPanchayatSamiti: number = 0;
  public PanchayatSamiti: number = 0;
  public CourseTypeID?: number = 0;
  public Status: number = 0;
  public ItiAffiliationList: ItiAffiliationList[]=[]
  public ItiMembersModel: ItiMembersModel[] = []
  public ManagementStatus:string=''
  public ManagementRemark:string=''
  public TrustMemberStatus?:string=''
  public TrustMemberRemark:string=''
  public AddressStatus?:string=''
  public AddressRemark:string=''
  public ContactStatus:string=''
  public ContactRemark:string=''
  public ElectricalStatus:string=''
  public ElectricalRemark:string=''
  public AffilationStatus:string=''
  public AffilationRemark:string=''
  public BankRemark:string=''
  public Remarks: string = ''
  public ContactName: string = ''
  public ContactDesignation: string = ''
  public AmountAvailable: string = ''
  public AmountRequired: string = ''
  public AmountDifference: string = ''
  public LandlineNo: string = ''
  public FinancialYearID: number = 0
  public HighCourt: number = 0
  public IsCourt: boolean = false
  public BankStatus :string=''
  public WritNo :string=''
  public CourtDocumernt :string=''
  public DisCourtDocumernt :string=''
  public CourtDate :string=''
  public BuildingPlan :string=''
  public DisBuildingPlan :string=''
  public IsCampus: boolean = false
}

export class ItiAffiliationList {
  public AffiliationID: number = 0;
  public CollegeID: number = 0;
  public OrderID: number = 0;
  public OrderNo: string = '';
  public PageNo: string = '';
  public SerialNo: string = '';
  public OrderDate?: string = ''; 
  public EffectFrom?: string = '';
  public FileName: string = '';
  public Dis_Filename: string = '';

  
}

export class ItiMembersModel {
  public MemberId: number = 0;
  public CollegeID: number = 0;
  public PostID: number = 0;
  public MemberName: string = '';
  public ContactNo: string = '';
  public IDFileName: string = '';
  public IDdis_Filename: string = '';
  public PostName?: string = '';

}


export class ItiVerificationModel {
  public InstituteID: number = 0;
  public Status: number = 0;
  public Remarks: string = '';
  public UserID: number = 0;
  public FileName:string=''
  public DisFileName:string=''
}
export class ITI_PlanningCollegesSearchModel {
  public InstituteID: number = 0;
  public UserID: number = 0;
  public StudentExamManagementTypeId: number = 0;
  public CollegeID: number = 0;
}


export class ITIPlanningBankGuarantee {
  public BankGuaranteeID: number = 0;
  public CollageId: number = 0;
  public BankName: string = '';
  public BankGuaranteeNumber: string = '';
  public dateOfIssue: string = '';          
  public maturityDate: string = '';         
  public duration: string = '';
  public amount: number = 0;
  public BankAgreementDocument: string = '';
  public numberOfUnit: number = 0;
  public status: number = 0;
  public Remarks?: string = '' ;
  public FinYearId?: number = 0 ;
  public MonthWise?: number = 0 ;
  public dayWise?: number = 0 ;
  public BankID: number = 0 ;
  public ActionType: string = '' ;
  public UserID: number = 0;
  public OrderNo?: number = 0;
  public Orderdate?: string = '';

  public GauranteeNo?: string = '';


  

}
export class ITIPlanningBankGuaranteeReturn {
  public BankGuaranteeID: number = 0;
  public CollageId: number = 0;
  public status: number = 0;
}
export class ITIPlanningStatusUpdateByIdModel {
  public BankGuaranteeID: number = 0;
  public CollageId: number = 0;
  public status: number = 1;
  public Remarks: string = '';
  public OrderNo?: number = 0;
  public Orderdate: string = '';
}

