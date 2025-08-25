import { RequestBaseModel } from "./RequestBaseModel";

export class DTEApplicationDashboardDataModel {
  public ApplicationID: number = 0;
  public DepartmentID: number = 0;
  public ModifyBy: number = 0;
  public UserID: number = 0;
  public RoleID: number = 0;
  public Eng_NonEng: number = 0;
  public EndTermID: number = 0;
  public Menu: string = '';
  public FinancialYearID:number=0
  public HostelID?: number = 0;
  public UrlStatus?: string = '';

}

export class DTEDashboardModel {
  public statusText: string = '';
  public statusTextHi: string = '';
  public totalCount: string = '';
  public redirectURL: string = '';


}
export class CollegeApplicationDashboardDataModel {
  public ApplicationID: number = 0;
  public DepartmentID: number = 0;
  public ModifyBy: number = 0;
  public UserID: number = 0;
  public RoleID: number = 0;
  public Eng_NonEng: number = 0;
  public EndTermID: number = 0;
  public Menu: string = '';
}

export class DownloadZipDocumentModel extends RequestBaseModel {
  public FinancialYear: string = '';
  public ApplicationIDs: number[] = [];

}
