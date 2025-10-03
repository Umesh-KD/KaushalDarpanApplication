
export class CounsellingAllotmentListModel {
 
  public TradeID: number = 0
  public CandidateID: number = 0
  // public CandidateCount:number=0;
  // public RoleID: number = 0
  // public DepartmentID: number = 0;
  // public InstituteID:number=0;
  public PageSize: number = 50
  public PageNumber: number = 1
  public TradeName :  string ='';
  public SortOrder: string = '';
  public SortColumn: string = '';
  public action: string = '';
}

export class CounsellingAllottedListSearchModel {
 
  public TradeID?: number = 0
  public CandidateID?: number = 0
  public PageSize?: number = 50
  public PageNumber?: number = 1
  public TradeName?:  string ='';
  public SortOrder?: string = '';
  public SortColumn?: string = '';
  public action?: string = '';
  public ApplicationNo?: string = '';
  public CandidateName?: string = '';
  public MobileNo?: string = '';
}


export class AddCollegeWiseScholarshipModel{
  public ID: number = 0;
  public StudentID  :number=0;
  public	SchemeID  :number=0;
  public SchemeName:string='';
  public	ScholarShipTypeID :number=0;
  public ScholarShipTypeName:string='';
  public ScholarShipAmount :number=0;
  public	ScholarShipDate  :string='';
  public	ScholarShipApprovalID  :string='';
  public ActiveStatus  :boolean=true;
  public DeleteStatus  :boolean=false;
  public CreatedBy :number=0;
  public ModifyBy :number=0;
  public InstituteID :number=0;
 public ScholarshipMode : string='';
}