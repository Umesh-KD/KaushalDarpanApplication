import { RequestBaseModel } from "./RequestBaseModel";

export class AdminUserDetailModel {
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
  public IsCitizenQueryUser?: boolean = false;
  public QueryType?: number = 0;
  public CourseType: number = 0;
  public UserRole: number = 0
}

export class AdminUserSearchModel extends RequestBaseModel {
  public UserID: number = 0;
  public UserAdditionID: number = 0;
  public ProfileID: number = 0;
  public InstituteID: number = 0;
  public Name: string = '';
  public Email: string = '';
  public MobileNo: string = '';
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string = '';
  public UserRole:number=0
 
}
export class StreamMasterForHodModel extends RequestBaseModel {
  public StreamType: number = 0;
  public UserAdditionID: number = 0; 
  public InstituteID: number = 0; 
}
