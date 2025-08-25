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
