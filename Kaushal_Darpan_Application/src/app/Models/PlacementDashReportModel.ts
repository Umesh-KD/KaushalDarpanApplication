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
export class PlacementDashboardModel {
  public DepartmentID:number=0
  public CollegeID: number = 0
  public EndTermID: number = 0
  public UserId: number = 0
  public RoleId: number = 0

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

