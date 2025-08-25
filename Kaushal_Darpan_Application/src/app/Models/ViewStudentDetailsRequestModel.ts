import { RequestBaseModel } from "./RequestBaseModel";

export class ViewStudentDetailsRequestModel extends RequestBaseModel {
  public StudentID: number = 0;
  public StudentFilterStatusId: number = 0;
  public ApplicationID: number = 0;
  public StudentExamID: number = 0;
}
