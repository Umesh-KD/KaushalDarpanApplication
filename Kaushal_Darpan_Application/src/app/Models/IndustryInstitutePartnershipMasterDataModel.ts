import { RequestBaseModel } from "./RequestBaseModel"

export class IndustryInstitutePartnershipMasterDataModels {
  public ID: number = 0
  public Name: string = ''
  public Website: string = ''
  public StateID: number = 0
  public DistrictID: number = 0
  public RoleID: number = 0
  public Address: string = ''
  public CompanyPhoto: string = '';
  public Dis_CompanyName: string = '';
  public CompanyDocument: string = '';
  public Dis_DocName: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0
  public DepartmentID: number = 0
  public CreatedBy: number = 0
  public EventTypeID: number=0
  public CompanyID: number = 0
  public Logo: string = ''
  public Dis_Logo: string = ''
  public PlacementCompanyID?: number = 0
  public Selected?: boolean = false
  


  public EventID: number = 0 

  public ConcernPersonDetails: ConcernPersonDetailsDataModel[] = []
}

export interface IIndustryInstitutePartnershipMasterDataModel {
  ID: number
  Name: string
  Website: string
  StateID: number
  DistrictID: number
  Address: string
  CompanyPhoto: string
  Dis_CompanyName: string
  ActiveStatus: boolean
  DeleteStatus: boolean
  ModifyBy: number
   EventTypeID: number 
}

export class IndustryInstitutePartnershipMasterSearchModel {
  public Name: string = '';
  public Status: string = '0';
  public ModifyBy: number = 0
  public RoleID: number = 0
  public DepartmentID: number = 0;
  public EventTypeID: number = 0
  public CompanyStatus?: number = 0
}
export class IndustryInstitutePartnershipMaster_Action {
  public ID: number = 0;
  public Action: string = '0';
  public ActionRemarks: string = '';
  public ActionBy: number = 0;
  public DepartmentID: number = 0;
  public ModifyBy: number = 0
  public RoleID: number = 0
  public EventTypeID: number = 0
}


export class IndustryTrainingMaster {
  public IndustryTRID: number = 0;
  public IndustryID: number = 0;
  public EventTypeID: number = 0;
  public EventDate: string='';
  public SemesterID: number = 0;
  public Purpose: String = '';
  public TradeID: number = 0;
  public DepartmentID: number = 0;
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public IPAddress: string = '';

}


export class IndustryTrainingSearch {
  public IndustryTRID: number = 0;
  public IndustryID: number = 0;
  public EventTypeID: number = 0;
  public EventDate: String = '';
  public SemesterID: number = 0;
  public TradeID: number = 0;
  public DepartmentID: number = 0;
       
}

export class ConcernPersonDetailsDataModel {
  public HRManagerID: number = 0;
  public PlacementCompanyID: number = 0;
  public Name: string = '';
  public EmailId: string = '';
  public Designation: string = '';
  public MobileNo: String = '';
  public ModifyBy: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public DepartmentID: number = 0;
}

export class IIP_SearchModel extends RequestBaseModel {
  public CompanyID?: number = 0
}

export class IIP_EventDataModel extends RequestBaseModel {
  public EventName: string = ''
  public EventID: number = 0
  public CompanyID: number = 0
  public EventTypeID: number = 0
  public Event: number = 0
  public SemesterID: number = 0
  public EventStartDate: string = ''
  public EventEndDate: string = ''
  public EventForID: number = 0
  public UserID: number = 0
  public Branchlist: BranchList[] = []
  public Semesterlist: BranchList[] = []
  public FileUpload: string = '';
  public Dis_FileUpload: string = '';
  public EventLevelID:number = 0
  public Remark : string = '';
  public SSOID: string = '';
  public MobileNo: string = '';
  public Email: string = '';
  public Designation: string = '';
  public TrainingDuration: number = 0;
  public AreaOfDomain: string = '';
  InstituteID: number = 0;
DivisionID: number = 0;
}

export class BranchList {
  public StreamID: number = 0
  public StreamName:string=''
}
export class Semesterlist {
  public SemesterID: number = 0
  public SemesterName: string=''
}

export class CompanyEventSearchModel extends RequestBaseModel {
  public CompanyID: number = 0
  public EventID: number = 0
  public StaffID: number = 0
  public EventStatus: number = 0
  public StudentID: number = 0
  public InterestedStatus: number = 0
  public Remarks: string = ''
  public InstituteID: number=0
  public ApproveStatus: number=-1


}

export class EventConsentActionDataModel {
  public Remark: string = ''
  public Status: number = 0
}
export class EventConsentSearchModel {
  public EventID: number = 0
  public Event: number = 0
  public EventTypeID: number = 0
  public EventStatusID: number = 0
  public UserID: number = 0
  public RoleID: number = 0
  public InstituteID: number = 0
  public Action: string = ''
}
