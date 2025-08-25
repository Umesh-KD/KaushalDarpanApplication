export class BTERSeatIntakeDataModel {
  public SeatIntakeID: number = 0;
  public CollegeID: number = 0;
  public StreamID: number = 0;
  public Shift: string = '';
  public LastSession: number = 0;
  public RemarkID: number = 0;
  public StreamTypeID: number = 0;
  public UnitNo: string = '';
  public SanctionedID: number = 0;

  public DepartmentID: number = 0;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;

  public AcademicYearID: number = 0;
  public EndTermId: number = 0;
}

export class BTERSeatIntakeSearchModel {
  public DistrictID: number = 0;
  public CollegeTypeID: number = 0;
  public CollegeID: number = 0;
  public InstituteCategoryID: number = 0;
  public StreamID: number = 0;
  public StreamTypeID: number = 0;
  public RemarkID: number = 0;
  public Shift: string = '';
  public UnitNo: string = '';
  public SanctionedID: number = 0;
  public StatusID: number = 1;
  public EndTermId: number = 1;
}

export class BTERCollegeTradeSearchModel {
  public ManagementTypeId: number = 0;
  public CollegeID: number = 0;
  public CollegeCode: string = '';
  public CollegeStreamId: number = 0;
  public AllotmentMasterId: number = 0;
  public EndTermId: number = 0;
  public StreamID: number = 0;
  public FeePaid: number = 0;
  public ShiftID: number = 0;
  public TradeCode: number = 0;
  public StreamTypeId: string = '';
  public FeeStatus: number = 0;
  public ActiveStatus: number = 0;
  public PageSize: number = 10;
  public PageNumber: number = 0;
  public FinancialYearID: number = 0;
  public StreamFor: number = 0;
  public TotalSeatAvailable: number = 2;
  public Action: string = '';
  public StreamLevelId: string = '';
  public DepartmentID: number = 0;
  public CreateBy: number = 0;
  public IPAddress: string = '';
  public StreamCode: string = '';
  public AllotmentStatus: number = 0
}



