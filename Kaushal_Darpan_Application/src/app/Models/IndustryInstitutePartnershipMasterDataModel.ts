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
