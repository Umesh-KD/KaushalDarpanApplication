export class RoomDetailsDataModel {
  public HSRoomID: number = 0;
  public HostelID: number = 0;
  public RoomTypeID: number = 0;
  public RoomNo: null = null;
  public StudyTableFacilities: number = 0;
  public AttachedBathFacilities: number = 0;
  public FanFacilities: number = 0;
  public CoolingFacilities: number = 0;

  //public StudyTableFacilities: boolean = true;
  //public AttachedBathFacilities: boolean = true;
  //public FanFacilities: boolean = true;
  //public CoolingFacilities: boolean = true;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
}

export class RoomExcelDetailsModel {
  public SrNo: number = 0;
  public HSRoomID: number = 0;
  public HostelID: number = 0;
  public RoomType: string = '';
  public RoomNo: number = 0; 
  public StudyTableFacilities: string = '';
  public FanFacilities: string = '';
  public CoolingFacilities: string = '';
  public AttachedBathFacilities: string = '';
  public IPAddress: string = '';
}
