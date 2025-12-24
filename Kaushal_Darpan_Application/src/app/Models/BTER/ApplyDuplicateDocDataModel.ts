export class ApplyDuplicateDocument {
  public ID: number = 0;
  public DocumentID: number = 0;
  public SemesterID: number = 0;
  public DepartmentID: number = 0;
  public FeeAmount: number = 0;
  public ServiceID: number = 5442;
  public StudentID: number = 0;
  public CourseTypeID: number = 0;
  public ApplicationID: number = 0;
  public UniqueServiceID: number = 2;
  public MobileNo: string = '';
  public StudentName: string = '';
  public ApplicationNo: string = '';
  public InstituteID: number = 0;
  public createdBy: number = 0;
  public modifyBy: number = 0;
  public IsPayment: boolean = false;
  public IsActive: boolean = false;
  public IsDelete: boolean = false;

  public ConfigurationTypeID?: number =0;
}


export class DuplicateDocumentSearch {
  public ID: number = 0;
  public DocumentID: number = 0;
  public SemesterID: number = 0;
  public DepartmentID: number = 0;
  public FeeAmount: number = 0;
  public ServiceID: number = 5442;
  public StudentID: number = 0;
  public CourseTypeID: number = 0;
  public ApplicationID: number = 0;
  public UniqueServiceID: number = 2;
  public MobileNo: string = '';
  public StudentName: string = '';
  public ApplicationNo: string = '';
  public InstituteID: number = 0;
  public createdBy: number = 0;
  public modifyBy: number = 0;
  public IsPayment: boolean = false;
  public IsActive: boolean = false;
  public IsDelete: boolean = false;

  public ConfigurationTypeID?: number =0;

  public Name:string=''
  public PageSize: number = 50
  public PageNumber: number = 1

  public SortOrder: string = '';
  public SortColumn: string = '';

  public action:string='';
  public Eng_NonEng:number=0;
}