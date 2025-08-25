export class AllotmentConfigurationModel {
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
}

export class ListAllotmentConfigurationModel {
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
}

export class SessionConfigModelModel {
  public FinancialYearID: number = 0
  public FinancialYearName: string = ''
  public ActiveStatus: number = 0
  public CreatedBy: number = 0
  public IPAddress: string = ''
  public IsCurrentFY: boolean = false;
  public DepartmentID: number = 0
  public CourseTypeID: number = 0
  public Action: string = ''
}
