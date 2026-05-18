import { RequestBaseModel } from "./RequestBaseModel";

export class ScholarshipModel extends RequestBaseModel{
  public ScholarshipID: number = 0;
  public InstituteID: number = 0;
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public Amount:number |null=null
  public Category:number =0
  public TotalStudent: number | null = null
  public ModifyBy: number = 0;
  public Dis_DocName: string = '';
  public Document: string = '';

}
export class ScholarshipSearchModel extends RequestBaseModel {
  public SemesterID: number = 0
  public StreamID: number = 0;
  public InstituteID: number = 0;
}
export class ScholarshipOnBoardModel {

  NODALOFFICERNAME: string = '';
  NODALOFFICEREMAIL: string = '';
  NODALOFFICERMOBILE: string = '';
  NODALOFFICERAADHAAR: string = '';

  DESIGNATION1: string = '';
  NAME1: string = '';
  EMAILADDRESS1: string = '';
  MOBILENUMBER1: string = '';

  DESIGNATION2: string = '';
  NAME2: string = '';
  EMAILADDRESS2: string = '';
  MOBILENUMBER2: string = '';

  NODALOFFICERAADHAAR_REFNO: string = '';
  InstCode:string=''
  SSOID:string=''
}
