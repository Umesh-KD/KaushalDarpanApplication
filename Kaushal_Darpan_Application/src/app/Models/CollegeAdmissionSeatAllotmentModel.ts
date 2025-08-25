import { RequestBaseModel } from "./RequestBaseModel"

export class ApplicationSearchDataModel extends RequestBaseModel {
  public SSOID: string = ''
  public JanAadharMemberID: string = ''
  public JanAadharNo: string = ''
  public ApplicationID: number = 0
  public EnrollmentNo: string = ''
  public Action: string = ''
}

export class SeatMatrixSearchModel {
  public InstituteID: number = 0;
  public CollegeTradeID: number = 0;
  public AllotedCategory: string = '';
  public TradeID: number = 0;
  public TradeLevel: number = 0;
  public ApplicationID?: number;
  public ApplicationNo?: number;
  public MobileNo: string = "";
  public action: string = ''
  public BranchID: number = 0
  public AcadmicYearID: number = 0
}

export class SeatAllocationDataModel {
  public InstituteID: number = 9;
  public ApplicationID?: number;
  public TradeID?: number;
  public SeatMetrixId?: number;
  public AllotedCategory: string = '';
  public SeatMetrixColumn: string = '';
  public MobileNo: string = "";
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;
  public UserID: number = 0;
  public CreatedBy: number = 0;
  public ShiftUnit: number = 0;
  public CollegeTradeID: number = 0;
  public TradeLevel: number = 0;
  public action : string = ''
}
