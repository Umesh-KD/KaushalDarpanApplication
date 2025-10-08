import { RequestBaseModel } from "./RequestBaseModel";
import { ResponseBaseModel } from "./ResponseBaseModel";

export class TeacherHigherEducationApplicationRequestModel extends RequestBaseModel {
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
export class TeacherHigherEducationApplicationSaveModel extends ResponseBaseModel {
  StaffID: number = 0;
  SSOID: string = '';
  TeacherName: string = '';
  DOB: string = '';
  JoiningDate: string = '';
  AppliedCourse: number = 0;
  AppliedInstitute: number = 0;
  PHDStatus: number = 0;
  AppliedInstituteDistance: number = 0;
  AppliedInstituteCategory: number = 0;
  AppliedInstituteSubCategory: number = 0;
  Remark: string = '';
}

export class TeacherHigherEducationApplicationVerificationModel extends RequestBaseModel {
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
export class TeacherHigherEducationApplicationVerificationSaveModel extends ResponseBaseModel {
  StudentId: number = 0;
  StudentExamID: number = 0;
  Remark?: string = '';
}
