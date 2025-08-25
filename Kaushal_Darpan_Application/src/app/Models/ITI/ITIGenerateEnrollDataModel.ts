import { RequestBaseModel } from "../RequestBaseModel";

export class ITIGenerateEnrollSearchModel extends RequestBaseModel {
  public InstituteID: number = 0
  public StreamID: number = 0
  public SemesterID: number = 0;
}



export class ITIGenerateEnrollData {
  public StudentID: number = 0
  public ApplicationID: number = 0
  public StudentName: string = ''
  public FatherName: string = ''
  public InstituteName: string = ''
  public SemesterName: string = ''
  public temp_Enrollment: string = ''
  public DOB: string = ''
  public InstituteID: number = 0
  public StreamName: number = 0
  public StreamID: number = 0
  public SemesterID: number = 0
  Marked: boolean = false
  public EndTermID: number = 0
  public ModifyBy: Number = 0



}
