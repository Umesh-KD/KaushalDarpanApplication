import { RequestBaseModel } from "../RequestBaseModel";

export class ITICampusDetailsWebSearchModel {
  public DepartmentID: number = 0;
}

export class ITIAllPostSearchModel extends RequestBaseModel {
  // public DepartmentID: number = 0;
  public DistrictID:number=0;
  public BranchId:string='';
  public StartDate:string='';
  public EndDate:string='';
  public AppointmentLocation:string='';
  public CampusLocation:string='';
}
export class ITIDynamicUploadContentListsModal {
  public DepartmentID: number = 0;
  public DynamicUploadTypeID: number = 0;
  public DepartmentSubID: number = 0;
  public Key: string = '';
}
