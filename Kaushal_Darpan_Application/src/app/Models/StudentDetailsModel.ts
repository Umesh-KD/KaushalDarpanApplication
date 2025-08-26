export class StudentDetailsModel {
  public StudentID: number = 0;
  public ApplicationID: number = 0;
  public EnrollmentNo: string = '';
  public StudentName: string = '';
  public FatherName: string = '';
  public MotherName: string = '';
  public Gender?: string = '';
  public MobileNo: string = '';
  public Email?: string = '';
  public StreamName: string = '';
  public Semester: string = '';
  public FeeAmount: string = '';
  public EnrollFeeAmount?: string = '';
  public LastDate?: string = '';
  public FeeStatus: string = '';
  public RoleName: string = '';
  public SemesterID: number = 0;
  public StudentExamID: number = 0;
  public RollNo?: string = '';
  public EndTermName: string = '';
  public ExamStudentStatus: number = 0;
  public StudentSemesterID: number = 0;
  public CurrentSemesterID: number = 0;
  public ServiceID: number = 0;
  public ID: number = 0;
  public ExamFee: number = 0;
  public InstituteName: string = '';
  public StrStudenetStatus: string = '';
  public IsSelected: boolean = false;
  public AdmitCard: string = '';
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public DepartmentName: string = '';
  public TransactionID: number = 0;
  public FinancialYearID: number = 0;
  public CourseType: number = 0;
  public EndTermID: number = 0;
  public ModuleID: number = 0;
  public InstituteID: number = 0;
  public PRN: string = '';
  public PaidAmount?: number = 0;
  public IsRequestedForEnrCancel: number = 0;
  public IsShowAdmitCard: boolean = false;
  public DownloadExaminationForm: boolean = false;
  public Status: number = 0;

  public ServiceType?: string = '';

}


export class StudentEnrolmentCancelModel {
  public StudentID: number = 0;
  public NextRoleId: number = 0;
  public EnrollmentNo: string = '';
  public SemesterID: number = 0;
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public ActionId: number = 0;
  public InstituteID: number = 0;
  public CourseType: number = 0;
  public Status: number = 0;
  public UserId: number = 0;
  public RoleID: number = 0;
  public IsRequestedForEnrCancel: number = 0;

 
  public Remark: string = '';
  public StudentName: string = '';
  public FatherName: string = '';
  public MotherName: string = '';
  public StreamName: string = '';
  public InstituteName: string = '';
  public DOB: string = '';
  public Action: string = '';
  public ENRCancelDoc: string = '';
  public Dis_ENRCancelDoc: string = '';


}
