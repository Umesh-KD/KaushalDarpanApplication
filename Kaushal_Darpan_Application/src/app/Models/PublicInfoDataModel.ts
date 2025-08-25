export class PublicInfoDataModel {
  public PublicInfoId: number = 0;
  public DepartmentId: number = 0;
  public CourseTypeId: number = 0;
  public AcademicYearId: number = 0;
  public PublicInfoType: number = 0;
  public DescriptionEn: string = "";
  public DescriptionHi:string = "";
  public LinkUrl: string = "";
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0; 
  public IPAddress: string = "";
  public PageNumber: number = 0;
  public PageSize: number = 0;
  public SortOrder: string = "";
  public SortColumn: string = "";
  public Actoin: string = "";
  public FileName: string = "";
  public Dis_FileName: string = "";
}

export class CommonVerifierApiDataModel {
  public VerifierID: number = 0
  public Name: string = ''
  public SSOID: string = ''
  public Email: string = ''
  public MobileNumber: string = ''
  public Remark: string = ''
  public appName: string = ''
  public password: string = ''

  public ActiveStatus: boolean = true
  public DeleteStatus: boolean = false
  public ModifyBy: number = 0
  public CreatedBy: number = 0
  public DepartmentID: number = 0
  public RoleID: number = 0
  public CourseType: number = 0
  public ShowAllApplication: boolean = false;

}

