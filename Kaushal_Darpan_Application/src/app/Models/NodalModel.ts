export class NodalModel {
  public NodalId: number = 0;
  public SSOID: string = '';
  public Name: string = '';
  public MobileNo: string = '';
  public Email: string = '';
  public IsEdit_Stu: boolean = false;
  public IsAdd_CollageFees: boolean = false;
  public DepartmentID: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public IPAddress?: string = '';
  public NodalModellist: NodalModel[] = [];
  public UserID: number = 0;
  public Marked: boolean = false;

}
interface NodalRecord {
  NodalId: number;
  SSOID: string;
  Name: string;
  MobileNo: string;
  Email: string;
  IsAdd_CollageFees: boolean;
  IsEdit_Stu: boolean;
  CreatedBy: number;
}
interface ResponseData {
  State: number;
  Message: string;
  ErrorMessage: string | null;
  Data: Array<any>; 
  RedirectUrl: string | null;
}
export class Nodallist {
  public NodalId: number = 0;
  public SSOID: string = '';
  public Name: string = '';
  public MobileNo: string = '';
  public Email: string = '';
  public IsEdit_Stu: boolean = false;
  public IsAdd_CollageFees: boolean = false;
  public DepartmentID: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public IPAddress?: string = '';
}

export class SearchNodalModel {
  public SSOID: string = '';
  public Name: string = '';
  public MobileNo: string = '';
}
