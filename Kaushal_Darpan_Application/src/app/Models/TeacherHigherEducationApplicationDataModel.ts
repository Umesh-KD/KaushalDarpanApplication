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

export class PrincipleApplicationListSearchModel extends RequestBaseModel {
  public Id: number = 0;
  public THTEAppID: number = 0;
  public Name: string = '';
  public StaffID: number = 0;
  public status?: number = 0;
}

export class THTE_DropdownDataModel{
  public action?: string = ''
  public RoleID?: number = 0
}

// public class UpdateApplicationStatusDataModel_Principle
// {
//     public int? THTEAppID { get; set; }
//     public int? ModifyBy { get; set; }
// }

export class UpdateApplicationStatusDataModel_Principle {
  public THTEAppID?: number = 0;
  public ModifyBy?: number = 0;
  public status?: number = 0;
  public Remark?: string = '';
  public RoleID?: string = '';
}

export class UpdateApplicationStatusDataModel_Committee {
  public status?: number = 0;
  public Remark?: string = '';
  public RoleID?: number = 0;
  public ModifyBy?: number = 0;
  public CommitteeDocs?: string = '';
  public Dis_CommitteeDocs?: string = '';
  public ApplicationListData?: ApplicationListDataModel_THTE[] = [];
}

export class ApplicationListDataModel_THTE {
  public THTEAppID?: number = 0;
}

export class ApplicationGenrateOrderByDteListSearchModel extends RequestBaseModel {
    public Id: number = 0;
    public THTEAppID: number = 0;
    public Name: string = '';
    public StaffID: number = 0;
    public status?: number = 0;
    public THTEAppIDs?: string = '';
}