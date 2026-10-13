
export class DesignationMasterDataModel {
  public DesignationID: number = 0;
  public DesignationNameEnglish: string = '';
  public DesignationNameHindi: string = '';
  public DesignationNameShort: string = '';
  public UserID: number = 0;
  public Gaz_NonGaz: number = 0;
  public ActiveStatus: boolean = true;
  public ActiveDeactive: string = '';
  public DeleteStatus: boolean = false;
  public IsActive: boolean = true;
  public StaffTypeID: Number = 0;
  public Remark: string = '';
}

export class DesignationMasterSearchModel {
  public DesignationID: number = 0;
  public DesignationNameEnglish: string = '';
  public StaffTypeID: Number = 0;
  public IsActive: boolean = true;
  public UserID: number = 0;
  public Gaz_NonGaz: number = 0;
}

export class QueryRequestModel {
  public RequestID: number = 0;
  public RequesterName: string = '';
  public DepartmentName: string = '';
  public RequestType: string = '';
  public RequestDescription: string = '';
  public Priority: string = 'Medium';
  public Status: string = 'Pending';
  public UserID: number = 0;
  public CreatedBy: number | null = null;
  public ModifiedBy: number | null = null;
  public IPAddress: string = '';
}