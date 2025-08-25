export class Board_UniversityMasterModel {
  public ID: number=0;
  public Name: string='';
  public Code: string = '';
  public Remark: string = '';
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number =0;
  public ModifyBy: number =0;
  public ModifyDate: string = '';
  public IPAddress: string = '';
}  


export class Board_UniversityMasterSearchModel {

  public ID: number = 0;
  public Name: string = '';
  public Code: string = '';
  public ModifyBy: number = 0;
}
