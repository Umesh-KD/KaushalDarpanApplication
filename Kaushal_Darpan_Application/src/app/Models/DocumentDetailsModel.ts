export class DocumentDetailsModel {
  public DocumentDetailsID: number = 0;  // pk
  public DocumentMasterID: number = 0;  // fk
  public TransactionID: number = 0;  // other inserted table pk
  public TableName: string = '';
  public ColumnName: string = '';
  public DisplayColumnNameEn: string = '';
  public DisplayColumnNameHi: string = '';
  public FolderName: string = '';
  public FileName: string = '';
  public Dis_FileName: string = '';
  public ModifyBy: number = 0;
  public IsMandatory: boolean = false;
  public FileExtention: string = '';
  public MinFileSize: string = '';
  public MaxFileSize: string = '';
  public SortOrder: number = 0;
  public GroupNo: number = 0;
  public Remark?: string = ''
  public SubRemark?: string = ''
  // for handling old
  public CommonRemark:string=''
  public OldFilePath: string = ''
  public validationError: string = '';
  public OldFileName?: string = '';
  public Status?: number = 0
}

export class Counselling_DocumentDetailsModel {
    public CandidateDocumentID?: number = 0;
    public DocumentMasterID?: number = 0;
    public CandidateID?: number = 0;
    public TableName?: string = '';
    public ColumnName?: string = '';
    public DisplayColumnNameEn?: string = '';
    public DisplayColumnNameHi?: string = '';
    public FolderName?: string = '';
    public FileName?: string = '';
    public Dis_FileName?: string = '';
    public ModifyBy?: number = 0;
    public IPAddress?: string = '';
    public IsMandatory?: boolean = false;
    public GroupNo?: number = 0;
    public SortOrder?: number = 0;
    public MaxFileSize?: string = '';
    public MinFileSize?: string = '';
    public FileExtention?: string = '';
    public Remark?: string = '';
    public OldFileName?: string = '';
    public Status?: number = 0;
    public AcademicYearID?: number = 0;
}

export class ITIPaperUploadSearchModel {
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public SemesterID: number = 0;
  public TradeID: number = 0;
  public Action: string = '';
  public PaperID: number = 0;
  public PaperUploadID: number = 0;
  public PaperDate: string = '';
  public IsPaperDownload: number = 0;
  public CenterID: number = 0;
  public PaperCode: string = '';
  public IsPresentAbsent: number = -1;
}
