export class RevaluationModel {
  public RollNo?: number = 0
  public StudentID?: number = 0
  public RoleID?: number = 0
  public EndTermID?: number = 0
  public DOB?: string = ''
  public EnrollmentNo?: string = ''
}
export class StudentDetailsByRollNoModel {
  public StudentID: number = 0
  public StudentExamID: number = 0
  public SemesterId: number = 0
  public SubjectID: number = 0
  public EndTermID: number = 0
  public ServiceID: number = 0
  public MobileNo?: string = '';
  public EnrollmentNo: string = ''
  public StudentName: string = ''
  public FatherName: string = ''
  public InstituteNameEnglish: string = ''
  public DOB: string = ''
  public Name: string = ''
  public Year: string = ''
  public StudentType: string = ''
  public RollNo?: number = 0
  public DepartmentID: number = 0
  public CourseTypeID: number = 0
  public IsSelected: boolean = false;
  public IsReval: boolean = false;
  public Payment: number = 0

}


export class ITIRevaluationModel {
  public RollNo?: number
  public DOB: string = ''
}

export class SaveStudentDetailsModel {
  public StudentID: number = 0
  public StudentExamID: number = 0
  public SemesterId: number = 0
  public PaymentAmount: number = 0
  public EndTermID: number = 0
  public DOB: string = ''
  public Year: string = ''
  public StudentType: string = ''
  public Remarks: string = ''
  public RollNo?: number = 0
  public DepartmentID: number = 0
  public CourseTypeID: number = 0
  public IsSelected: boolean = false;
  public IsReval: boolean = false;
  public ItemList: ItemsDetails[] = [];

  public RevalRequestID:number=0;
  public PaymentStatus:boolean=false;
  public RevalStatus:number=0;

}


export class ItemsDetails {
  public StudentExamPaperMarksID: number = 0;
  public OldMarks: number = 0;
  public NewMarks: number = 0;
  public Reason: string = '';
  public Remarks: string = '';
}

export class RVLStudentRevalRequestModel {
  public RevalRequestID: number = 0;
  public StudentExamID: number = 0;
  public ActionID: number = 0;
  public RevalStatus: number = 0;
  public StudentID: number = 0;
  public NewMarks: number = 0;
  public RollNo: string = '';
  public ApplicationNo: string = '';
  public Remarks: string = '';
  public PaymentAmount: number = 0;
}
export class StudentRevalRequestModel {
  
  public RollNo: string = '';
  public ApplicationNo: string = '';
  
}


export class ITIRevalRequestStudentDetailsModel {
  public RollNo?: string='';
  public DOB: string = '';
  public RevalReqID?:number=0;
  public ActionBy?:number=0;
  public Name?:string='';


  public PageSize: number = 50;
  public PageNumber: number = 1;
  public SortOrder: string = '';
  public SortColumn: string = '';

  public StudentOptionList: StudentOptionItem[] = [];
  public action :string='';
}


export class RVLstudentListModel {
  public RevalRequestID: number = 0;
  public StudentExamID: number = 0;
  public ActionID: number = 0;
  public RevalStatus: number = 0;
  public StudentID: number = 0;
  public NewMarks: number = 0;
  public RollNo: string = '';
  public ApplicationNo: string = '';
  public Remarks: string = '';
  public PaymentAmount: number = 0;
}

export class StudentOptionItem {
  public RequestSubjectID: number=0;
  public StudentExamPaperMarksID: number=0;
  public UploadedCopy?: string='';  // Can be filename or null
  public Remarks:string='';
  // public RevalRequestID:number=0;
}

export class UploadTrainee_LogsModel{
  public RequestID:string='';
  public log_id:string='';
}

export class RevalationReportsearchModel {
  public EnrollmentNo:string='';
  public ResultDate:string='';
  public RollNumber:string='';
  public SubjectCode:string='';
  public RevaluationTxnNo:string='';
  public RevaluationChallan:string='';
  public SemesterID:number = 0;
}




