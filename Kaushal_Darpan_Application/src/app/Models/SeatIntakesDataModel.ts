export class SeatIntakesDataModel {

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
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public DepartmentID: number = 0

}

export class SeatIntakesSearchModel {
  public TradeId: number = 0;
  public TradeName: string = '';
  public TradeTypeId: number = 0;
  public TradeLevelId: number = 0;
  public DurationYear: string = '';
  public TradeCode: string = '';
  public ActiveStatus: boolean = true;

}


