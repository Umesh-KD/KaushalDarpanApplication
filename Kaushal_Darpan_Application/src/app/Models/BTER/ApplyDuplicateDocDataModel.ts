import { RequestBaseModel } from "../RequestBaseModel";

export class ApplyDuplicateDocument extends RequestBaseModel {
  public ID: number = 0;
  public DocumentID: number = 0;
  public SemesterID: number = 0;
  public DepartmentTypeID: number = 0;
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
  // public SessionID?:number=0;
  public RequestEndTerm: number = 0;

  public FeesTypeID: number = 0;
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

export class DuplicateDoc_Action {
  public ID: number = 0;
  public StudentID: number = 0;
  public DocumentID: number = 0;
  public Action: string = '0';
  public ActionRemarks: string = '';
  public ActionBy: number = 0;
  public DepartmentID: number = 0;
  public ModifyBy: number = 0
  public RoleID: number = 0
  public SemesterId:number=0
  
  public CourseTypeID: number = 0; 
  public FianancialYearID:number=0
  public EndTermID:number=0
  public RequestEndTerm:number=0
}
