import { HrMasterDataModel } from "./HrMasterDataModel"

export class CompanyMasterDataModels {
  public ID: number = 0
  public Name: string = ''
  public Website: string = ''
  public StateID: number = 0
  public DistrictID: number = 0
  public RoleID: number = 0
  public CompanyTypeId: number = 0
  public Address: string = ''
  public CompanyPhoto: string = '';
  public Dis_CompanyName: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0
  public DepartmentID: number = 0
  public CreatedBy: number = 0

  public HRName: string = '';
  public EmailId: string = '';
  public MobileNo: String = '';

  public ListCompanyHRDetails: HrMasterDataModel[] = [];
}

export interface ICompanyMasterDataModel {
  ID: number
  Name: string
  Website: string
  StateID: number
  DistrictID: number
  Address: string
  CompanyPhoto: string
  Dis_CompanyName: string
  ActiveStatus: boolean
  DeleteStatus: boolean
  ModifyBy: number
}

export class CompanyMasterSearchModel {
  public Name: string = '';
  public Status: string = '';
  public ModifyBy: number = 0
  public RoleID: number = 0;
  // public ID: number = 0;
  
  public DepartmentID: number = 0;
  public PageNumber: number = 0;
  public PageSize: number = 0;
}

export class CompanyMasterSearchByIdModel extends CompanyMasterSearchModel {
  public ID: number = 0;
}


export class CompanyMaster_Action {
  public ID: number = 0;
  public Action: string = '0';
  public ActionRemarks: string = '';
  public ActionBy: number = 0;
  public DepartmentID: number = 0;
  public ModifyBy: number = 0
  public RoleID: number = 0
}

export class SignedCopyOfResultModel {
   public SignedCopyOfResultID: number = 0;
   public CampusPostID: number = 0;
   public HRID: number = 0;
   public CompanyID: number = 0;
  public Remark: string = '';
  public FileName: string = '';
  public Dis_File: string = '';
  public ActiveStatus:  boolean = false;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string = '';
  public DepartmentID: number = 0;
  public FileTypeID: number = 0;
  public ListTypeName: number = 0;

}

export class  SignedCopyOfResultSearchModel {
  public SignedCopyOfResultID: number = 0;
  public CampusPostID: number = 0;
  public HRID: number = 0;
  public CompanyID: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
  public CreatedBy: number = 0;
  public RoleID: number = 0;

}


export class EligibleStudentListMasterSearchModel {
  public Name: string = '';
  public Status: string = '0';
  public ModifyBy: number = 0
  public RoleID: number = 0
  public DepartmentID: number = 0;
  public InstituteID:number=0;
  public PageSize: number = 50
  public PageNumber: number = 1
  public AcademicYearID: number = 0
  public StreamID: number = 0

  public SortOrder: string = '';
  public SortColumn: string = '';
}


export class PlacementStudentListSearchModel {
  public Name: string = '';
  public Status: string = '';
  public ModifyBy: number = 0
  public RoleID: number = 0
  public DepartmentID: number = 0;
  public InstituteID:number=0;
  public FinancialYearID:number=0;
  public EndTermID:number=0;
  public PageSize: number = 50
  public PageNumber: number = 1

  public SortOrder: string = '';
  public SortColumn: string = '';
  public action:string='';
}



// --------------------------------ADD-SELF-EMPLOYEMENT------------------------------------------

export class StudentEmploymentDetailsModel {
  public AID: number = 0;
  public StudentID: number = 0;
  public InstituteID: number = 0;
  public EnrollmentNo?: string = '';

  public CompanyType: string = '';           // self / firm
  public CompanyName: string = '';
  public StateID: number = 0;
  public DistrictID: number = 0;
  public CompanyAddress: string = '';

  public JobType: string = '';               // fulltime / parttime
  public Experience: string = '';            // current / past

  public WorkingFromDate: string = '';       // DATE - stored as string in Angular
  public WorkingToDate: string = '';

  public SalaryType: string = '';            // stipend / ctc / salary
  public SalaryAmount: number = 0;

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;

  public RTS: string = '';                   // datetime
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string = '';

  public DepartmentID: number = 0;
}