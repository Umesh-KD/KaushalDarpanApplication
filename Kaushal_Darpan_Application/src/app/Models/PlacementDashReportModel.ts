import { RequestBaseModel } from "./RequestBaseModel"

export class PlacementReportSearchModels {
  public Id: number = 0
  public Gender: string = ''
  public StudentName: string = ''
  public DepartmentID: number = 0
  public Eng_NonEng: number = 0
  public CollegeID: number = 0

  public InstituteID?:string=''
  public RoleID?: number = 0
  public TradeID?: String =''
  public CompanyID?: string = ''
}

export class PlacementReportHistorySearchModels {
  public Id: number = 0
  public Gender: string = ''
  public StudentName: string = ''
  public DepartmentID: number = 0
  public Eng_NonEng: number = 0
  public CollegeID: number = 0

  public InstituteID?: string = ''
  public RoleID?: number = 0
  public TradeID?: String = ''
  public CompanyID?: string = ''
  public StudentID: number = 0
  public PostID: number = 0
}
export class PlacementDashboardModel extends RequestBaseModel {
  public CollegeID: number = 0
  public UserId: number = 0
  public RoleId: number = 0
  public EventStatus:string = 'UP-Comming'

}


// ---------------------ITI DASHBOARD--------------------------

export class ITIPlacementReportSearchModels {
  public Id: number = 0
  public Gender: string = ''
  public StudentName: string = ''
  public DepartmentID: number = 0
  public Eng_NonEng: number = 0
  public CollegeID: number = 0
}
export class ITIPlacementDashboardModel {
  public DepartmentID:number=0
  public CollegeID: number = 0
  public EndTermID: number = 0
  public UserId: number = 0
  public RoleId: number = 0

}

export class ITIStudentAllotmentReportSearchModels extends RequestBaseModel{
  //public Id: number = 0
  //public Gender: string = ''
  public StudentName: string = ''
  public CollegeID: number = 0
  //public CompanyID?: string = ''
  public DGTCode?: string = ''
}
