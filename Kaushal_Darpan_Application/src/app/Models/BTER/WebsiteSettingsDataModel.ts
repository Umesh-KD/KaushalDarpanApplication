import { RequestBaseModel } from "../RequestBaseModel";

export class WebsiteSettingDataModel extends RequestBaseModel{
    public WS_ID: number = 0
    public TypeID: number = 0
    public Title: string = ''
    public Start_Date: string = ''
    public End_Date: string = ''
    public FileName: string = ''
    public Dis_FileName: string = ''
    public CourseSubTypeID: number = 0
    public ActiveStatus: boolean = false
    public UserID: number = 0
    public IPAddress: string = ''
  public ViewTypeIDs: string = ''
    public DepartmentSubID: number = 0;
    public DUTC_ID?: number = 0
  public IsActive?: boolean = false
  public IsPrivate?: boolean = false

  public LevelID?: number = 0
  public CreatedByRoleID?: number = 0
  public DocCategoryID?: number = 0
  public StaffTypeID?: number = 0
  public DesignationID?: string = ''
}
