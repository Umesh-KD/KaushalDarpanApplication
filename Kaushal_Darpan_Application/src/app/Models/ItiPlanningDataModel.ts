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
  public ItiMembersModel: ItiMembersModel[]=[]
}

export class ItiAffiliationList {
  public AffiliationID: number = 0;
  public CollegeID: number = 0;
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
}
