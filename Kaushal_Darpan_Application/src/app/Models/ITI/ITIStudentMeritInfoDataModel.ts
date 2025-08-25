import { QualificationViewDetails } from "../ItiApplicationPreviewDataModel";

export class ITIStudentMeritInfoModel {

  public ApplicationID: number = 0;
  public AllotmentMasterId: number = 0;
  public ApplicationNo: string = ''
  public StudentName: string = '';
  public Gender: string = '';
  public categoryName: string = '';
  public TenthPer: string = '';
  public MaxMarks: string = '';
  public MarksObt: string = '';
  public Class: number = 0;
  public CategoryId: number = 0;
  public MeritNo: number = 0;
  public IsPH: boolean = false
  public IsKM: boolean = false
  public IsWID: boolean = false
  public IsRajDOMICILE: boolean = false
  public IsSingleMotherDependent: boolean = false
  public IsTSP: boolean = false
  public IsExServicemen: boolean = false
  public ExServicemenId: boolean = false
  public DOB: string = '';
  public IsApply: boolean = false
  public PrefentialCategory: string = ''

  public status: number = 0;
  public Action: number = 0;
  public MeritId: number = 0;
  public IsEdit: boolean = false;

  public CourseTypeID: number = 0;
  public DepartmentID: number = 0;

  public QualificationViewDetails: QualificationViewDetails[] = [];
/*  public RecheckDocumentModel: RecheckDocumentModel[] = []*/

}

export class ITICollegeSearchModel
{
    public SearchText: string = ''
    public DivisionId: number = 0
    public DistrictId: number = 0
    public PageNumber: number = 0;
    public PageSize: number = 0;
  //public InstituteID: number = 0;
  //public Id: number = 0;
  //public Name: string = '';
  //public website: string = '';
  //public SecretaryName: string = '';
  //public SecretaryMobile: string = '';
  //public ItiEmail: string = '';
  //public Email: string = '';
  //public Ssoid: string = '';
  //public PrincipalName: string = '';
  //public PrincipalMobile: string = '';
  //public Dis_Name: string = '';
  //public Logo: string = '';
  //public InstitutionCategoryId: number = 0
  //public SubDivisionId: number = 0
  //public TehsilId: number = 0
  //public UrbanRural: number = 0
  //public ParliamentId: number = 0
  //public AssemblyId: number = 0
  //public Pincode: string = '';
  //public PlotNo: string = '';
  //public Address: string = '';
  //public Street: string = '';
  //public Area: string = '';
  //public Landmark: string = '';
  //public ActiveStatus: boolean = true;
  //public DeleteStatus: boolean = false;
  //public UserID: number = 0;
  //public ModifyBy: number = 0;
  //public CreatedBy: number = 0;
  //public FinancialYearId: number = 0
  //public EndTermId: number = 0
  //public AdministrativeId: number = 0
  //public NagarNigamName: string = '';
  //public NagarPalikaName: string = '';
  //public NagarParishadName: string = '';
  //public CantonmentBoardName: string = '';
  //public CityID: number = 0
  //public Ward: number = 0
  //public VillageId: number = 0
  //public PanchayatsamityId: number = 0
  //public GrampanchayatId: number = 0
  //public StatusName: string = ''
  //public Remark: string = ''
  //public UpdatedBy: string = ''
  
}
