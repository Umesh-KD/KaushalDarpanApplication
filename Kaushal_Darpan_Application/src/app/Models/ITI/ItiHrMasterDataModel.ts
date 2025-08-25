export class ItiHrMasterDataModel {
  public HRManagerID: number = 0;
  public PlacementCompanyID: number = 0;
  public Name: string = '';
  public EmailId: string = '';
  public MobileNo: String = '';
  public ModifyBy: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public DepartmentID: number = 0;
}

export class ItiHrMasterSearchModel {
  public PlacementCompanyID: number = 0;
  public Name: string = '';
  public DepartmentID: number = 0;
  public Status: string = '';
  public ModifyBy: number = 0
  public RoleID: number = 0
}

export class ItiHrMaster_Action {
  public HRManagerID: number = 0;
  public Action: string = '0';
  public ActionRemarks: string = '';
  public ActionBy: number = 0;
  public DepartmentID: number = 0;
  public ModifyBy: number = 0
  public RoleID: number = 0
}



