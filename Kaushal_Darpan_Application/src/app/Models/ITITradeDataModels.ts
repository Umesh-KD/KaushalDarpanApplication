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


}
