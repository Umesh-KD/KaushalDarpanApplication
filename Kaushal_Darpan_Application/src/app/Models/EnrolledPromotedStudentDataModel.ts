import { RequestBaseModel } from "./RequestBaseModel";
import { ResponseBaseModel } from "./ResponseBaseModel";

export class EnrolledPromotedStudentModel extends RequestBaseModel {
  ApplicationID: number = 0;
  ApplicationNo: string = '';
  MobileNo: string = '';
  StudentName: string = '';
  InstituteID: number = 0;
  StreamID: number = 0;
  SemesterID: number = 0;
  Selected: boolean = false;
  EnrollmentNo: string = '';
}
export class EnrolledPromotedStudentSaveModel extends ResponseBaseModel {
  StudentId: number = 0;
  StudentExamID: number = 0;
  Remark?: string = '';
}
