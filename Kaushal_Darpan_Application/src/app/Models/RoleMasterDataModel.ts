import { RequestBaseModel } from "./RequestBaseModel";

export class RoleMasterDataModel {
  public RoleID: number = 0;
  public LevelID: number = 1;
  public DesignationID: number = 1;
  public RoleNameEnglish: string = '';
  public RoleNameHindi: string = '';
  public RoleNameShort: string = '';
  public UserID: number = 0;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public ActiveStatus: boolean = true;
  public ActiveDeactive: string = '';
  public DeleteStatus: boolean = false;
  public CourseTypeID: number = 1;
  public DepartmentID: number = 0;
  
}


export class UserRoleRightsDataModel {
  public MenuID: number = 0;
  public MenuName: string = '';
  public RoleID: number = 0;
  public LevelNo: number = 0;
  public ParentId: number = 0;
  public U_View: boolean = false;
  public U_Add: boolean = false;
  public U_Update: boolean = false;
  public U_Delete: boolean = false;
  public U_Print: boolean = false;
  public ModifyBy: number = 0;
}

export class RoleSearchModel {
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
}
export class RoleListRequestModel extends RequestBaseModel {
  public SSOID: string = '';
  public IsWeb: boolean = false;
}
