import { RequestBaseModel } from "../RequestBaseModel";

export class ITI_ExaminerDashboardModel {
    public EndTermID: number = 0
    public ExaminerID: number = 0
    public SSOID: string = ''
}

export class ITI_AppointExaminerDetailsModel extends RequestBaseModel {
/*    public EndTermID: number = 0*/
    public ExaminerID: number = 0
    public UserID: number = 0
  public Status: number = 0
  public SSOID: string = '';
}
