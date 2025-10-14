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
 
  THTEAppID: number = 0;
  StaffID: number = 0;
  SSOID: string = '';
  TeacherName: string = '';
  DOB: string = '';
  JoiningDate: string = '';
  AppliedCourse: number = 0;
  AppliedInstitute: string = '';
  PHDStatus: number = 0;
  PHDStatusSt: string = '';
  AppliedInstituteDistance: number = 0;
  AppliedInstituteCourseCategory: number = 0;
  AppliedInstituteSubCategory: number = 0;
  Remark: string = '';
  CreatedBy: number = 0;
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

export class THTE_DDL  {
  Id: number = 0;
  Name?: string = '';
}

export class THTE_ApplicationSearchModel {
  public Id: number = 0;
  public THTEAppID: number = 0;
  public Name: string = '';
  public StaffID: number = 0;
}



