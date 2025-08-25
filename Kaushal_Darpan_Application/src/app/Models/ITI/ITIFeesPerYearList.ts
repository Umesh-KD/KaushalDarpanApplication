import { RequestBaseModel } from "../RequestBaseModel";

export class ITIFeesPerYearListModel {
  public AID: number = 0;
  public UserID: number = 0;
  public UserAdditionID: number = 0;
  public ProfileID: number = 0;
  public Name: string = '';
  public LevelID: number = 0;
  public DesignationID: number = 0;
  public StateID: number = 0
  public DistrictID: number = 0
  public AadhaarID: string = '';
  public SSOID: string = '';
  public RoleID: number = 0;
  public Email: string = '';
  public EmailOfficial: string = '';
  public State: string = '';
  public MobileNo: string = '';
  public Gender: string = '';
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string = '';
  public InstituteID: number = 0;
  public DepartmentID: number = 0;
}

export class ITIFeesPerYearListSearchModel extends RequestBaseModel {
  public TradeId: number = 0;
  public TradeName: string = '';
  public TradeSchemeId: number = 0;
  public ReportingStatus: number = 0;
  public FeeStatus: number = -1;
  public TradeCode: string = '';
  public ActiveStatus: boolean = true;
  public CourseTypeID?: number = 0;
  public CollegeId:number=0

}


export class CollegeLoginInfoSearchModel {
  public TradeId: number = 0;
  public TradeSchemeId: number = 0;
  public CollegeId: number = 0;
  public FinancialYearID: number = 0;
  public ReportingStatus: number = 0;
  public FeeStatus: number = 0;
  public CourseTypeID: number = 0;
  public ActiveStatus: boolean = true;
  public collegeIdsString: string = '';
  public Password: string = '';
  public TradeName: string = '';
  public TradeCode: string = '';
  public CollegeCode: string = '';
  public SSOID: string = '';
  public DepartmentID: number = 0;
  public ITItypeID: number = 0;
  public DistrictID: number = 0;

  }


