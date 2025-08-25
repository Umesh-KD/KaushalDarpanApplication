export class RoomDetailsDataModel {
  public GuestRoomDetailID: number = 0; 
  public GuestHouseID: number = 0;
  public RoomTypeID: number = 0;
  public RoomNo: number = 0;
  public StudyTableFacilities: number = 0;
  public AttachedBathFacilities: number = 0;
  public FanFacilities: number = 0;
  public CoolingFacilities: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
}

export class RoomExcelDetailsModel {
  public SrNo: number = 0;
  public GuestRoomDetailID: number = 0;
  public GuestHouseID: number = 0;
  public RoomTypeID: string = '';
  public RoomNo: number = 0; 
  public StudyTableFacilities: string = '';
  public FanFacilities: string = '';
  public CoolingFacilities: string = '';
  public AttachedBathFacilities: string = '';
  public IPAddress: string = '';
}
