import { RequestBaseModel } from "../RequestBaseModel";

export class StudentRequestDataModal {
  public InstituteID: number = 0;
  public SemesterId: number = 0;
  public BrachId: number = 0;
  public HostelID: number = 0;
  public EndTermID: number = 0;
  public DepartmentID: number = 0;
  public ReqId: any[] = [];
  public RoleID: number = 0;
  public status?: number = 0;
  
  public Action: string = '';
  public AllotmentStatus: number = 0;
}

export class SearchRequestRoomAllotment {
  public InstituteID: number = 0;
  public HostelID: number = 0;
  public EndTermID: number = 0;
  public DepartmentID: number = 0;
  public ApplicationId: number = 0;
  public SemesterId: number = 0;
  public BrachId: number = 0;
  public AffidavitDoc: number = 0;
  public AllotmentStatus: number = 0;
  public Action: string = '';
}

export class StudentRequestDataSearchModal {
  public InstituteID: number = 0;
  public SemesterId: number = 0;
  public BrachId: number = 0;
  public HostelID: number = 0;
  public EndTermID: number = 0;
  public DepartmentID: number = 0;
  public ReqId: any[] = [];
  public RoleID: number = 0;

  public Action: string = '';
  public AllotmentStatus: number = 0;


  public PageNumber: number = 0;
  public PageSize: number = 0;
  public SearchText: string = '';
}

export class DeallocateRoomDataModel extends RequestBaseModel {
  public AllotSeatId?: number = 0
  public ReqId?: number = 0
  public UserID?: number = 0
  public Action?: string = ''
  public Remark?: string = ''
}

export class StudentDetailDataModel_Hostel extends RequestBaseModel {
  public ApplicationNo: string = ''
  public EnrollmentNo?: string = ''
  public HostelID?: number = 0
  public AffidavitPhoto?: string = ''
  public Dis_AffidavitPhoto?: string = ''
}
