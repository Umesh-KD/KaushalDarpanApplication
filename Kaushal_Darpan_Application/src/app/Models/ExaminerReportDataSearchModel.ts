import { RequestBaseModel } from "./RequestBaseModel";

export class ExaminerReportDataSearchModel extends RequestBaseModel {
  public InstituteID: number = 0
  public Status: string = '';
  public PageNumber: number = 0
  public PageSize: number = 0
  public StaffID: number = 0

  public InstituteCode: string = '';
  public InstituteName: string = '';
  public Email: string = '';
  public ManagementType: number = 0
  public DistrictId: number = 0
  public SSOID: string = '';
  public ZoneID: number = 0
  public StreamID: number = 0
  public TehsilID: number = 0
  public ExamTypeID: number = 0
  public StreamTypeID: number = 0

}
