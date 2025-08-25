import { QualificationViewDetails } from "./ItiApplicationPreviewDataModel";

export class StudentMeritInfoModel {

  public ApplicationID: number = 0;
  public AllotmentMasterId: number = 0;
  public ApplicationNo: string = ''
  public StudentName: string = '';
  public Gender: string = '';
  public categoryName: string = '';
  public TenthPer: string = '';
  public MaxMarks: string = '';
  public MarksObt: string = '';
  public Class: number = 0;
  public CategoryId: number = 0;
  public MeritNo: number = 0;
  public IsPH: boolean = false
  public IsKM: boolean = false
  public IsWID: boolean = false
  public IsRajDOMICILE: boolean = false
  public IsSingleMotherDependent: boolean = false
  public IsTSP: boolean = false
  public IsExServicemen: boolean = false
  public ExServicemenId: boolean = false
  public DOB: string = '';
  public IsApply: boolean=false
  public PrefentialCategory:string=''
 
  public status: number = 0;  
  public Action: number = 0;
  public MeritId: number = 0;
  public IsEdit: boolean = false;

  public CourseTypeID: number = 0;
  public DepartmentID: number = 0;
  public MobileNo: number = 0;
  public CategoryMeritNo: number = 0;
  
  public QualificationViewDetails: QualificationViewDetails[] = [];
  public RecheckDocumentModel: RecheckDocumentModel[]=[]

}

export class RecheckDocumentModel {
  public DocumentDetailsID: number = 0;  // pk
  public DocumentMasterID: number = 0;  // fk
  public MeritId: number = 0;  // fk
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
  public status: number = 0
  public Isselect: boolean=false
}


