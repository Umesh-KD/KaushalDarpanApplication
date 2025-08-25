import { RequestBaseModel } from "../RequestBaseModel";

export class RequestSearchModel {
 
  public RequestId: number = 0;
  public RequestType: number = 0;
  public UserId: number = 0;
  public UserName: string = '';
  public SSOID: string = '';
  public StatusId: number = 0;
  public PageNumber: number = 0;
  public PageSize: number = 0;
  public SearchText: string = '';
  public PostID: number = 0;
  public OfficeID: number = 0;
  public LevelID: number = 0;
  public DepartmentID: number = 0; 
  public DesignationID: number = 0;
  public InstituteID: number = 0;
  public RequestRemarks: string = '';
  public OrderNo: string = '';
  public OrderDate: string = '';
  public JoiningDate: string = '';
  public RequestDate: string = '';
  public CreatedBy: number = 0;
  public IPAddress: string = '';
  public  Action: string = '';
  public ServiceRequestId: number = 0;
  public AttachDocument_fileName: string = '';
  public AttachDocument_file: string = '';
  public NodalStateID: number = 0;
  public NodalDistrictID: number = 0;
  public DivisionID: number = 0;
  public StaffTypeID: number = 0;
  public ReqRoleID: number = 0;
   

}


/*-----------Bter Em---------------*/
export class BterRequestSearchModel {

  public RequestId: number = 0;
  public RequestType: number = 0;
  public UserId: number = 0;
  public UserName: string = '';
  public SSOID: string = '';
  public StatusId: number = 0;
  public PageNumber: number = 0;
  public PageSize: number = 0;
  public SearchText: string = '';
  public PostID: number = 0;
  public OfficeID: number = 0;
  public LevelID: number = 0;
  public DepartmentID: number = 0;
  public DesignationID: number = 0;
  public InstituteID: number = 0;
  public RequestRemarks: string = '';
  public OrderNo: string = '';
  public OrderDate: string = '';
  public JoiningDate: string = '';
  public RequestDate: string = '';
  public CreatedBy: number = 0;
  public IPAddress: string = '';
  public Action: string = '';
  public ServiceRequestId: number = 0;
  public AttachDocument_fileName: string = '';
  public AttachDocument_file: string = '';
  public NodalStateID: number = 0;
  public NodalDistrictID: number = 0;
  public DivisionID: number = 0;
  public StaffTypeID: number = 0;
  public ReqRoleID: number = 0;
  public EmployeeNumber: string = '';
  public EmployeeDesignation: string = '';

  public IsPensionable: boolean = false;
  public NumberOfPensionable: string = '';


}


export class JoiningLetterSearchModel {

  public UserID: number = 0;

}
export class RelievingLetterSearchModel {

  public UserID: number = 0;

}


export class SanctionOrderModel {
  public SanctionOrderID: number = 0;
  public AttachDocument: string = '';
  public AttachDocumentUrl: string = '';
  public OrderNo: string ='';
  public DepartmentID: number = 0;
  public CreatedBy: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
}
