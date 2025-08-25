import { RequestBaseModel } from "./RequestBaseModel";

export class CommonDDLSubjectMasterModel extends RequestBaseModel {
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public SubjectID: number = 0;
}
export class CommonDDLSubjectCodeMasterModel extends RequestBaseModel {
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public StudentExamID: number = 0;
  public SubjectType:number=0
}
