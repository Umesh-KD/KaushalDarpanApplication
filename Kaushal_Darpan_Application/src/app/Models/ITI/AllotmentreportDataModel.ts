export class AllotmentReportingModel {
  public ReportingId: number = 0;
  public AllotmentId: number = 0;
  public AllotmentMasterId: number = 0;
  public ShiftUnitID: number = 0;
  public ApplicationID: number = 0;
  public CollegeTradeId: number = 0;
  public JoiningStatus?: string='';
  public ReportingRemark?: string='';
  public GenderNm?: string='';
  public DOB?: string='';
  public TradeName?: string='';
  public AllotedGender?: string='';
  public AllotedCategory?: string='';
  public fullAddress?: string='';
  public MobileNo?: string='';
  public Email?: string='';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy?: number=0;
  public ModifyBy?: number=0;
  public ModifyDate: Date = new Date();
  public IPAddress?: string='';
  public StudentName?: string='';
  public FatherName?: string = '';
  public CasteCategory: string = '';
  public PreferenceCategory: string = '';
  public IsRajasthani: string = '';
  public ApplicationNo: string = '';
  public IsVoterIDAvailable: boolean = false;
  public AllotmentDocumentModel: AllotmentDocumentModel[] = [];
  public CheckStatus: number = 0;
  public AllotedPriority: number = 0;
  public AcademicYearID: number = 0;
  public ApplyUpward: boolean = false;
}

export class AllotmentDocumentModel {
  public DocumentDetailsID: number = 0;
  public DocumentMasterID: number = 0;
  public TableName: string = '';
  public ColumnName: string = '';
  public Remark: string = '';
  public DisplayName: string = '';
  public FileName: string = '';
  public FolderName: string = '';
  public Dis_FileName: string = '';
  public GroupNo: number = 0;
  public DocumentStatus: boolean = false
/*  public ShowRemark :Boolean*/
}
