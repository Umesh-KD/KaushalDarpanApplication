export class ITI_BGT_HeadMasterDataModel {
  // Personal Details

  public HeadName?: string = '';
  public HeadCode?: string = '';
  public HeadDescription?: string = '';

  // Additional Fields
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;

  public CreatedBy?: string = '';
  public ModifyBy: number = 0;

  public IPAddress: string = '0.0.0.0';

}


export class ITI_BGT_HeadMasterSearchModel {

  public Name?: string = '';
  public DepartmentID?: string = '';
  public Uid?: string = '';
  public roleID?: number = 0;
  public InstituteID: number = 0;
}
