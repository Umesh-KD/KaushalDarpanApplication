import { RequestBaseModel } from "./RequestBaseModel";

export class CampusDetailsWebSearchModel {
  public DepartmentID: number = 0;
}


export class DynamicUploadContentListsModal {
  public DepartmentID: number = 0;
  public DynamicUploadTypeID: number = 0;
  public DepartmentSubID: number = 0;
  public Key: string = '';
}

export class IIP_EventSearchModel extends RequestBaseModel {
  public EventID?: number = 0;
}