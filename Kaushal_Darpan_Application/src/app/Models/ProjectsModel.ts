import { RequestBaseModel } from "./RequestBaseModel";

export class ProjectsModel extends RequestBaseModel {

  public ProjectID: number = 0;
  public ProjectName?: string = '';
  public Vendor?: string = '';
  public WorkorderNo?: string = '';
  public WorkorderDate: string = '';
  public UserID: number = 0;


}

export class ProjectsSearchModel {
  public ProjectID: number = 0;
  public ProjectName?: string = '';
  public Vendor?: string = '';
  public WorkorderNo?: string = '';
  public WorkorderDate: string = '';

}



