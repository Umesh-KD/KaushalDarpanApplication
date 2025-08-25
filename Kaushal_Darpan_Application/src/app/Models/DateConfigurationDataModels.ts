export class DateConfigurationModel {
  public DateConfigID: number = 0
  public TypeID: number = 0
  public From_Date: string = ''
  public To_Date: string = ''
  public DepartmentID: number = 0
  public EndTermID: number = 0
  public CourseTypeID: number = 0
  public IsLateral: boolean = false
  public CourseSubTypeID: number = 0
  public ModifyBy: number = 0
  public RoleID: number = 0
  public FinancialYearID: number = 0
  public ConfigurationID: number = 0
  public FinancialYearName: string = ''
  public EndTermName: string = ''
  public SSOID: string = ''
}

export class SessionConfigModelModel
{
  public FinancialYearID: number = 0
  public FinancialYearName: string = ''
  public EndTermName: string = ''
  public ActiveStatus: number = 0
  public CreatedBy: number = 0
  public IPAddress: string = ''
  public IsCurrentFY: boolean = false;
  public DepartmentID: number = 0
  public CourseTypeID: number = 0
  public Action: string = ''
  public SSOID: string = ''
  public Month: string = ''
  public FYName: string = ''
  public ExamType: string = ''

}


export class UnPublishModel {
  public UnPubishBy: number = 0
  public UnPublishReason: string = ''
  public UnPubishAttachment: string = ''
  public UnPublishIPAddress: string = ''
  public AllotmentMasterId: number = 0
  public AcademicYearID: number = 0
  public CourseTypeId: number = 0
  public Action: string = ''
}
