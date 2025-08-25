export class UserRequestModel {
  public AID: number = 0;
  public UserID: number = 0;
  public AadhaarID: string = '';
  public SSOID: string = '';
  public Name: string = '';
  public DesignationID: number = 0;
  public DistrictID: number = 0
  public InstituteID: number = 0
  public DivisionID: number = 0
  public Email: string = '';
  public MobileNo: string = '';
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string = '';
  public UserStatus: string = '';
  public RoleID: number = 0;
}
export class UserSearchModel {
  public UserStatus: string = '';
}

