export class HiringRoleMasterDataModel {
  public ID: number = 0;
  public Name: string = '';
  public UserID: number = 0;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public ActiveStatus: boolean = true;
  public ActiveDeactive: string = '';
  public DeleteStatus: boolean = false;
}

export class SanctionOrderDataModel {
  public SanctionID: number = 0;
  public Name: string = '';
  public RoleID: number = 0;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public ActiveStatus: boolean = true;
  public ActiveDeactive: string = '';
  public DeleteStatus: boolean = false;
  public DepartmentID:number=0
  public ParentID:number=0
}

export class AnnouncementTypeMasterModel {

  public ID: number = 0;
  public Name: string = '';
  public IsActive: boolean = true;
  public  CreatedBy: number = 0;
  public UpdatedBy: number = 0;

 
}
