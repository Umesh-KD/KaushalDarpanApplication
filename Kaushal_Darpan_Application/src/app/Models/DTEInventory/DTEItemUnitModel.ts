export class DTEItemUnitModel {
  public UnitId: number = 0;
  public UnitName: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
}
export class DashboardRequestModel {
  public Action: string = '';
  public RoleID: number = 0;
  public DepartmentID: number = 0;
  public Status: number = 0;
  public UserID: number = 0;
  public InstituteID: number = 0;
  public CategoryId: number = 0;
  public EquipmentId: number = 0;
}
