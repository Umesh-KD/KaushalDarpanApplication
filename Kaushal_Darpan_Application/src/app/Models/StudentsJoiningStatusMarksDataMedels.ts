export class StudentsJoiningStatusMarksDataMedels {

  public ReportingId: number = 0;
  public AllotmentId: number = 0;
  public EndTermID: number = 0;
  public AcademicYearID: number = 0;
  public ReportingStatus: string = '';
  public ReportingRemark: string = '';
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public IPAddress: string = '';
  public Remark: string = '';
  
}

export class StudentsJoiningStatusMarksSearchModel {
  public AllotmentId: number = 0;
  public AllotmentMasterId: number = 0;
  public ApplicationID: number = 0;
  public CollegeId: number = 9;
  public TradeId: number = 0;
  public TradeSchemeId: number = 0;
  public PageNumber: number = 0;
  public PageSize: number = 0;
  public TradeLevel: number = 0
  public FinancialYearID: number = 0
  public ReportingStatus:string=''
  public TradeCode:string=''
}
