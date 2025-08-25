export class ItiGetResultDataModel {
  public UserID : number = 0;
  public EndTermID :  number = 0;
  public FinancialYearID :  number = 0;
  public InstituteID :  number = 0;
  public InstituteId :  number = 0;
  public SemesterID :  number = 0;
  public ExamType :  number = 0;
  public TradeScheme :  number = 0;
}

export class ItiGetPassFailResultDataModel {
  public UserID: number = 0;
  public EndTermID: number = 0;
  public FinancialYearID: number = 0;
  public InstituteId: number = 0;
  public collegeID: number = 0;
  public Results: number = 0;
  public ExamType: number = 0;
  public TradeScheme: number = 0;
  public StudentType: number = 0;
  public EnrollmentNo: number = 0;
  public TradeId: number = 0;
}

export class ITIStateTradeCertificateSearchModel {
  public RollNo: string = '';
  public EnrollmentNo: string = '';
  public EndTermID: number = 0;
  public ExamYearID: number = 0;
  public StudentID: number = 0;
  public TradeScheme: number = 0;

}
