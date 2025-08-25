import { CommonSubjectDetailsMasterModel } from "./CommonSubjectDetailsMasterModel";
import { RequestBaseModel } from "./RequestBaseModel";

export class CommonSubjectMasterModel extends RequestBaseModel {
  public CommonSubjectID: number = 0;
  public CommonSubjectName: string = '';
  public SubjectCode: string = '';
  public SemesterID: number = 0;
  public ModifyBy: number = 0;
  public commonSubjectDetails: CommonSubjectDetailsMasterModel[] = [];
}
