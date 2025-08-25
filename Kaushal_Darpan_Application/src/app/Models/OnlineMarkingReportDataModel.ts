export class OnlineMarkingSearchModel {
  public IsPresentTheory: number = 2
  public GroupCode: number = 0
  public Eng_NonEng: number = 0
  public EndTermID: number = 0
  public CenterCode: number = 0
  public ModifyBy: number = 0
  public RoleID: number = 0
  public DepartmentID: number = 0;
  public PageNumber: number = 0;
  public PageSize: number = 0;
}

export class OnlineMarkingReportModel {
  public ExamName: string = ''
  public ExaminerName: string = ''
  public SubjectCode: number = 0
  public GroupCode: number = 0
  public ExaminerCode: number = 0
  public TotalStudent: number = 0
  public TotalAbsentStudent: number = 0
  public TotalPresentStudent: number = 0
}


export class StudentMarksheetSearchModel {
  public RollNo?: string = ''
  public DOB?: string = ''
  public EndTermID: number = 0
  public ExamYearID: number = 0
  public PassFailID: number = 0
  public TradeScheme: number = 0
}
