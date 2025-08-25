export class SeatIntakeDataModel {
  public SeatIntakeID: number = 0;
  public CollegeID: number = 0;
  public TradeID: number = 0;
  public Shift: string = '';
  public LastSession: number = 0;
  public RemarkID: number = 0;
  public TradeSchemeID: number = 0;
  public UnitNo: string = '';
  public SanctionedID: number = 0;
  public TradeLevel: number = 0;
  public DepartmentID: number = 0;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;

  public OrderNo?: string = '';
  public OrderDate?: string = '';

  public AcademicYearID: number = 0;
}

export class SeatIntakeSearchModel {
  public DistrictID: number = 0;
  public CollegeTypeID: number = 0;
  public AcademicYearID: number = 0;
  public CollegeID: number = 0;
  public InstituteCategoryID: number = 0;
  public TradeID: number = 0;
  public TradeSchemeID: number = 0;
  public RemarkID: number = 0;
  public Shift:  string = '';
  public UnitNo: string = '';
  public SanctionedID: number = 0;
  public StatusID: number = 2;
  public MinPercentageInMath: string = '';
  public MinPercentageInScience: string = '';
  public OnlyForWomen: boolean = false;
  public CollegeCode: string = '';
  public TradeCode: string = '';
}

export class ITICollegeTradeSearchModel {
  public ManagementTypeId: number = 0;
  public DepartmentID: number = 0;
  public CreateBy: number = 0;
  public CollegeID: number = 0;
  public CollegeCode: string = '';
  public CollegeTradeId: number = 0;
  public TradeID: number = 0;
  public TradeCode: string = '';
  public TradeSchemeId: number = 0;
  public FeeStatus: number = 0;
  public ActiveStatus: boolean = true;
  public PageSize: number = 10;
  public PageNumber: number = 0;
  public FinancialYearID: number = 0;
  public EndTermId: number = 0;
  public Action: string = '';
  public TradeLevelId: string = '';
  public IPAddress: string = '';
  public TotalSeatAvailable: number = 2;
  public AllotmentMasterId: number = 1;
  public FeePaid: number = 1;
  public SeatStatus: number = 1;
  public MinPercentageInMath: string = '';
  public ReportingStatus: number = 0;
  public MinPercentageInScience: string = '';
}
export class SeatIntakePopUpSearchModel {
  public OrderDate: string = '';
  public OrderNo: string = '';

  public SeatIntakeID: number = 0;
  public AcademicYearID: number = 0;
  public CollegeID: number = 0;
  public InstituteCategoryID: number = 0;
  public TradeID: number = 0;
  public TradeSchemeID: number = 0;
  public RemarkID: number = 0;
  public Shift: string = '';
  public UnitNo: string = '';
  public SanctionedID: number = 0;
  public StatusID: number = 1;
  public MinPercentageInMath: string = '';
  public MinPercentageInScience: string = '';
  public OnlyForWomen: boolean = false;
}

//------BTER------//

export class BTERCollegeTradeSearchModel {
  public ManagementTypeId: number = 0;
  public DepartmentID: number = 0;
  public CreateBy: number = 0;
  public CollegeID: number = 0;
  public CollegeCode: string = '';
  public CollegeTradeId: number = 0;
  public TradeID: number = 0;
  public TradeCode: string = '';
  public TradeSchemeId: number = 0;
  public FeeStatus: number = 0;
  public ActiveStatus: boolean = true;
  public PageSize: number = 10;
  public PageNumber: number = 0;
  public FinancialYearID: number = 0;
  public EndTermId: number = 0;
  public Action: string = '';
  public TradeLevelId: string = '';
  public IPAddress: string = '';
  public TotalSeatAvailable: number = 2;
  public AllotmentMasterId: number = 1;
  public FeePaid: number = 1;
  public MinPercentageInMath: string = '';
  public MinPercentageInScience: string = '';
}

export class SanctionOrderModel {
  public SanctionOrderID: number = 0;
  public OrderNo: string = '';
  public AttachDocument: string = '';
  public AttachDocumentUrl: string = '';
  public DepartmentID: number = 0;
  public CreatedBy: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
}



