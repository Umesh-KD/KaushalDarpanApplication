export class UserMasterModel {
  public AID: number = 0;
  public UserID: number = 0;
  public Name: string = '';
  public LevelID: number = 0;
  public DesignationID: number = 0;
  public StateID: number = 0
  public DistrictID: number = 0
  public AadhaarID: string = '';
  public SSOID: string = '';
  public Email: string = '';
  public EmailOfficial: string = '';
  public State: string = '';
  public MobileNo: string = '';
  public Gender: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string = '';
  public Vertical: string = '';
  public DepartmentID:number=0
}

export class UserMenuRightsDataModel {
  public UserMenuRightID: number = 0;
  public MenuID: number = 0;
  public MenuName: string = '';
  public RoleID: number = 0;
  public UserID: number = 0;
  public LevelNo: number = 0;
  public ParentId: number = 0;
  public U_View: boolean = false;
  public U_Add: boolean = false;
  public U_Update: boolean = false;
  public U_Delete: boolean = false;
  public U_Print: boolean = false;

  public ModifyBy: number = 0;
}
export class AssignRoleRightsModel {
  public UserAdditionID: number = 0
  public UserID: number = 0//insert or update on behalf
  public InstituteID: number = 0
 /* public RoleID: number = 0;*/
  public ID: number = 0;
  public IsMainRole: number = 0;
  public Name: string = ''
  public SSOID: string = ''
  public Marked: boolean = false;
  public ModifiedBy: number = 0
  public IPAddress: string = ''
}

export class AssignRoleRightsDataModel {
  public UserAdditionID: number = 0
  public UserID: number = 0//insert or update on behalf
  public InstituteID: number = 0
 /* public RoleID: number = 0;*/
  public ID: number = 0;
  public IsMainRole: boolean = false;
  public Name: string = ''
  public SSOID: string = ''
  public Marked: boolean = false;
  public ModifiedBy: number = 0
  public IPAddress: string = ''
  public DepartmentID: number = 0
  public Eng_NonEng: number = 0
}



export class UserMasterSerchModel {
  public MenuId: number = 0;
  public MenuNameEn: string = '';
  public DepartmentID: number = 0;

}


export class UserPrincipMasterSerchModel {
  public MenuId: number = 0;
  public MenuNameEn: string = '';
  public DepartmentID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleId: number = 0;

}

export class PrincipleUpdateInstituteIDModel {
  public DepartmentID: number = 0;
  public ID: number = 0;
  public CourseType: number = 0;
  public RoleID: number = 0;
  public json_Data: string = '';

}
