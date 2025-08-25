export class RoomAllotmentDataModel {
  public AllotSeatId: number = 0;
  public HostelID: number = 0;
  public ReqId: number = 0;
  public RoomTypeId: number = 0;
  public RoomNoId: number = 0;
  public HostelFeesReciept: string = '';
  public Dis_HostelFeesReciept: string = '';
  public Relation: number = 0;
  public ContactPersonName: string = '';
  public MobileNo: string = '';
  public EndTermId: number = 0;
  public Remark: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
  public InstituteId: number = 0;
  public FessAmount: number = 0;
  public AllotmentStatus: number = 0;
}



export interface RoomAvailability {
  RoomType: string;
  RoomCount: number;
  TotalSeats: number;
  AllocatedSeats: number;
  AvailableSeats: number;
}



