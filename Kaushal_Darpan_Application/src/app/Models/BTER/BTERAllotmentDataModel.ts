export class BTERAllotmentdataModel {
  public AllotmentId: number = 0;
  public TradeLevel: number = 0
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;
  public DepartmentID: number = 0;
  public AcademicYearID: number = 0;
  public EndTermId: number = 0;
  public Id: number = 0;
  public StreamTypeID: number = 0;
  public CreatedBy: number = 0;
  public IPAddress: string = '';
  public IsGenerateSecondAllotment: boolean = false;

}
export class BTERSearchModel {
  public AllotmentId: number = 0;
  public StreamTypeID: number = 0;
  public AcademicYearID: number = 0;
  public EndTermId: number = 0;
  public DepartmentID: number = 0;
  public AllotmentMasterId: number = 0;
  public UserID: number = 0;
  public CollegeID: number = 0;
  public TradeID: number = 0;

  public InstituteID: number = 0;
  public StInstituteID: number = 0;
  public ApplicationID: number = 0;
  public PageNumber: number = 0;
  public PageSize: number = 0;
  public IsPH: number = 0
  public action: string = ''
  public FilterType: string = ''
  public SearchText: string = ''
  public TradeLevel: number = 0
  public ReportingStatus: number = 0


  public CollegeId: number = 0;
  public StreamID: number = 0
  public FeePaid: number = 0
  public ShiftId: number = 0
  public CollegeCode: string = ''
  public StreamCode: string = ''
  public TradeCode: string = ''
  public AllotmentStatus: number = 0
  public Age: number = 0
  public Gender: number = 0
  public DistrictID: number = 0
  public ManagementTypeID: number = 0
  public RoleID: number = 0
}

export class BTERAllotmentCounterDataModel {
  public AllotmentId: number = 0;
  public Type: String = '';
  public AllotmentType: String = '';
  public CompleteTime: String = '';
  public TotalApplication: number = 0;
  public TotalSeats: number = 0;
  public TotalRuningCount: number = 0;
  public TotalAlloted: number = 0;
}


export class BTERSeatMetrixdataModel {
  public AllotmentId: number = 0;
  public CollegeId: number = 0;
  public Name: String = '';
  public AllotmentType: String = '';
  public OBC: number = 0;
  public OBCFemale: number = 0;
  public GEN: number = 0;
  public GENFemale: number = 0;
  public SC: number = 0;
  public SCFemale: number = 0;
  public ST: number = 0;
  public STFemale: number = 0;
  public TSP: number = 0;
  public TSPFemale: number = 0;
  public SAH: number = 0;
  public SAHFemale: number = 0;
  public MIN: number = 0;
  public MINFemale: number = 0;
  public OMIN: number = 0;
  public OMINFemale: number = 0;
  public EWS: number = 0;
  public EWSFemale: number = 0;
  public MBC: number = 0;
  public MBCFemale: number = 0;
  public DEV: number = 0;
  public DEVFemale: number = 0;
  public PH: number = 0;
  public EX: number = 0;
  public TotalSeats: number = 0;
}

export class BTERStudentSeatAllotmentdataModel {
  public AllotmentId: number = 0;
  public ApplicationID: number = 0;
  public CollegeId: number = 0;
  public Name: String = '';
  public AllotmentType: String = '';
  public TradeName: String = '';
  public CategoryName: String = '';
  public TradeSchemeId: number = 0;
  public StudentGender: String = '';
  public AllotedCategory: String = '';
  public AllotedGender: String = '';
  public AllotedPriority: number = 0;
}
