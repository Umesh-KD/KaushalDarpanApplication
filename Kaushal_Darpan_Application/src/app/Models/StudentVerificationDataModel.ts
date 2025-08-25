export class StudentVerificationDataModel {
  public ApplicationID: number = 0
  public ApplicationNo:string=''
  public SSOID: string = ''
  public StudentName: string = ''
  public FatherName: string = ''
  public MotherName: string = ''
  public Email: string = ''
  public DOB: string = ''
  public Gender: string = ''
  public MobileNumber: string = ''
  public CasteCertificateNo: string = ''
  public CertificateGeneratDate: string = ''
  public CategoryA: number = 0
  public DepartmentID: number = 0
  public ModifyBy: number = 0
  public Dis_FileName: string = '';
  public TableName: string = '';
  public ColumnName: string = '';
  public FileName: string = '';

}
export class StudentVerificationSearchModel {
  public action:string=''
  public StudentName: string = '';
  public Status: number = 0;
  public ModifyBy: number = 0
  public RoleID: number = 0
  public DepartmentID: number = 0;
  public FinancialYearID:number=0
  public EndTermID:number=0
  public CourseTypeId:number=0
}
export class StudentVerification_Action {
  public ID: number = 0;
  public Action: string = '0';
  public ActionRemarks: string = '';
  public ActionBy: number = 0;
  public DepartmentID: number = 0;
  public ModifyBy: number = 0
  public RoleID: number = 0
}

export class StudentVerificationDocumentsDataModel {
  public ApplicationID: number = 0;
  public StudentName: string = '';
  public FatherName: string = '';
  public MotherName: string = '';
  public MobileNo: string = '';
  public Email: string = '';
  public ActionBy: number = 0;
  public VerificationDocumentDetailList: VerificationDocumentDetailList[] = [];
}

export class VerificationDocumentDetailList {
  public DocumentDetailsID: number = 0
  public DocumentMasterID:number=0
  public TransactionID: string = '';
  public ColumnName: string = '';
  public TableName: string = '';
  public Status: number = 0;
  public Remark: string = '';
  public FileName: string = '';
  public DisFileName: string = '';  
  public Folder: string = '';
  public DocumentID: number = 0;
  public ModifyBy: number = 0;
  public GroupNo: number = 0;
}

