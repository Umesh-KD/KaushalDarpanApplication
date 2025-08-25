import { RequestBaseModel } from "./RequestBaseModel";

export class CollegeMasterDataModels {
  public InstituteID: number = 0;
  public InstituteCode: string = '';
  public InstituteNameEnglish: string = '';
  public InstituteNameHindi: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public Capacity :number=0
  public MobileNumber: string = '';
  public LandlineStd: string = '';
  public InstitutionDGTCode: string = ''
  public UserID: number = 0;
  public SSOID: string = '';
  public Email: string = '';
  public FaxNumber: string = '';
  public Website: string = '';
  public LandNumber: string = '';
  public DistrictID: number = 0;
  public DivisionID: number = 0;
  public Address: string = '';
  public ApplicationFees: number = 0;
  public ApplicationID: number = 0;
  public FormCommision: number = 0;
  public ServiceID: number = 0;
  public UniqueServiceID: number = 0;
  public StudentName: string = '';
  public ApplicationNo: string = ''
  public PinCode: string = '';
  public TehsilID: number = 0;
  public InstitutionManagementTypeID: number = 0
  public InstitutionCategoryID: number = 0
  public LevelID: number = 0
  public CollegeTypeID: number = 0
  public CourseTypeID: number = 0
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public DepartmentID: number = 0
  public FinancialYearId: number = 0
  public EndTermId: number = 0
  public IsPayment: boolean = false;
  public IsProfileComplete: boolean = false;
}

export class CollegeMasterSearchModel extends RequestBaseModel {
  public InstituteID: number = 0
  public Status:number = 2
  public PageNumber:number=0
  public PageSize:number=0

  public InstituteCode: string = '';
  public InstituteName: string = '';
  public Email: string = '';
  public ManagementType:number=0
  public DistrictId:number=0
  public SSOID: string = '';
  
}

export class CollegeListSearchModel extends RequestBaseModel {
  public InstitutionManagementTypeID: number = 0 
  public IsProfileComplete: number = 0 
}

export class CollegeMasterRequestModel extends RequestBaseModel {
  public InstituteID: number = 0;
  public SSOID: string = ''; 
}




