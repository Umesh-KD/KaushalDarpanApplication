export class ITITradeDataModels {

  public TradeId: number = 0;
  public TradeName: string = '';
  public TradeTypeId: number = 0;
  public TradeLevelId: number = 0;
  public MinPercentageInMath: string = '';
  public MinPercentageInScience: string = '';
  public DurationYear: string = '';
  public NoOfSemesters: string = '';
  public NoOfSanctionedSeats: string = '';
  public MinAgeLimit: string = '';
  public TradeCode: string = '';
  public QualificationDetails: string = '';
  public IsMathsSciencecompulsory: boolean = false;
  public OnlyForWomen: boolean = false;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;
  public RoleId: number = 0;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public DepartmentID: number = 0;
  public IsAdmission: boolean = false;
  public Syllabuslink: string = '';

}

export class ITITradeSearchModel {
  public TradeId: number = 0;
  public TradeName: string = '';
  public TradeTypeId: number = 0;
  public TradeLevelId: number = 0;
  public DurationYear: string = '';
  public TradeCode: string = '';
  public ActiveStatus: boolean = true;
  public CourseTypeID?: number = 0;
  public IsAddmission: boolean = false;
  public action: string = ''


}
export class ITIPlanningBankGuarantee
{
  public BankGuaranteeID  :number =0
  public CollageId: number = 0
  public BankGuaranteeNumber: string = ''
  public BankName: string = ''
  public DateOfIssue: string = ''
  public Maturitydate: string = ''
  public Duration: string = ''
  public Amount :number =0
  public BankAgreementDocument: string = ''
  public Status  :number =0
  public Remarks: string = ''
 }



