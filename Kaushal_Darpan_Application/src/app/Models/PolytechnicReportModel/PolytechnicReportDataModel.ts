import { RequestBaseModel } from "../RequestBaseModel";

export class PolytechnicReportDataModels {
  public InstituteID: number = 0;
  public InstituteCode: string = '';
  public InstituteNameEnglish: string = '';
  public InstituteNameHindi: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;

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
}

export class PolytechnicReportSearchModel extends RequestBaseModel {
  public InstituteID: number = 0
  public Status: string = '';
  public PageNumber: number = 0
  public PageSize: number = 0

  public InstituteCode: string = '';
  public InstituteName: string = '';
  public Email: string = '';
  public ManagementType: number = 0
  public DistrictId: number = 0
  public SSOID: string = '';
  public ZoneID: number = 0
  public StreamID: number = 0
  public TehsilID: number = 0
  public ExamTypeID: number = 0
  public StreamTypeID: number = 0

}


