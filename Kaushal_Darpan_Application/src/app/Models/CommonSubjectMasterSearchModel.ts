import { RequestBaseModel } from "./RequestBaseModel";

export class CommonSubjectMasterSearchModel extends RequestBaseModel{
  public CommonSubjectName: string = '';
  public SemesterID: number = 0;
  public SubjectID: number = 0;
}
