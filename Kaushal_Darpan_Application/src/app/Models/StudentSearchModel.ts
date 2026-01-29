export class StudentSearchModel {
  public studentId: number=0;
  public StudentID: number=0;
  public roleId: number=0;
  public RoleID: number=0;
  public Status: number=0;
  public ServiceID: string ='0';
  public ssoId: string = '';
  public action?: string = '';
  public SemesterID: number = 0;
  public StreamID: number=0
  public ApplicationNo?: string = '';
  public DOB?: string = '';
  public CreateDate?: string = '';
  public MobileNumber?: string = '';
  public TransactionId: number = 0;
  public EndTermID: number = 0;
  public DepartmentID: number = 0;
  public DocumentMasterID: number = 0
  public FinancialYearID: number = 0
  public InstituteID: number = 0
  public ChallanNo?: number = 0;
  public TrasactionStatus: number = 0;
  public StudentExamID?: number = 0;
  public CourseTypeID: number = 0;
  public Receipt_Number?: string = '';


}

export class EmitraApplicationsearchModel {
  public ApplicationID: number = 0
  public DOB?: string = '';
  public MobileNumber?: string = '';
  public action:string=''
}

export class ReAssignTeacherDataModel {
  public Action: string = '';
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public StreamID: number = 0;
  public Section: any[] = []; // you can replace 'any' with a proper Section model if available
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public SemesterID: number = 0;
  public InstituteId: number = 0;
  public StaffID: number = 0;
  public SSOID: string = '';
  public CreatedDate: string = '';
  public From_Date: string = '';
  public To_Date: string = '';
  public ID: number = 0;
}


export class ReAssignTeacherSaveModel {
  public Action: string = '';
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public StreamID: number = 0;
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public SemesterID: number = 0;
  public StaffID: number = 0;
  public SSOID: string = '';
  public SSOIDBY: string = '';
  public CreatedDate: string = '';
  public From_Date: string = '';
  public To_Date: string = '';
  public AssignTeacherForSubjectID: number = 0;
  public rdID: number = 0;
  public ID: number = 0;
  public InstituteID: number = 0;
 
}



export class StudentItiResultModel {
  public ID: number = 0;
  public studentId: number = 0;
  public StudentID: number = 0;
  public roleId: number = 0;
  public RoleID: number = 0;
  public Status: number = 0;
  public ServiceID: string = '0';
  public ssoId: string = '';
  public action?: string = '';
  public SemesterID: number = 0;
  public StreamID: number = 0
  public ApplicationNo?: string = '';
  
  public CreateDate?: string = '';
  public MobileNumber?: string = '';
  public TransactionId: number = 0;
  public EndTermID: number = 0;
  public DepartmentID: number = 0;
  public DocumentMasterID: number = 0
  public FinancialYearID: number = 0
  public InstituteID: number = 0
  public ChallanNo?: number = 0;
  public TrasactionStatus: number = 0;
  public StudentExamID?: number = 0;
  public CourseTypeID: number = 0;
  public Receipt_Number?: string = '';

  public RollNo?: string = '';
  public DOB?: string = '';



}
