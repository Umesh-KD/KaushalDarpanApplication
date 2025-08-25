import { RequestBaseModel } from "./RequestBaseModel";

export class CopyCheckerRequestModel extends RequestBaseModel {
  public SSOID: string = '';
  public ExaminerCode: string = '';
  public GroupCodeID: number = 0
}

export class ExaminerDashboardModel {
  public DepartmentID: number = 0
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public InstituteID: number = 0;
  public InvigilatorAppointmentID: number = 0;
  public SSOID: string = '';

}
