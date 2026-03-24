
export class CollegeWiseScholarshipSearchModel {
  public Name: string = '';
  public Enrollment: string = '';
  public Category:string='';
  public Status: string = '';
  public ModifyBy: number = 0
  public RoleID: number = 0
  public DepartmentID: number = 0;
  public InstituteID:number=0;
  public PageSize: number = 50
  public PageNumber: number = 1
  public ScholarshipMode :  string ='';
  public SortOrder: string = '';
  public SortColumn: string = '';
  public SchemeName: string='';
  public CourseType: number=0;
  public GenderName: string='';
  public GenderID: number=0;
}


// export class AddCollegeWiseScholarshipModel1 {
//   public ID: number = 0;
//   public StreamID: number = 0;
//   public SemesterID: number = 0;
//   public SubjectID: number = 0;
//   public SSOID: string = '';
//   public UserID: number = 0;
//   public StaffID: number = 0;
//   public SectionIDs: string = '';
//   public DisplayName: string = '';
//   public DepartmentID: number = 0;
//   public ActiveStatus: boolean = false;
//   public DeleteStatus: boolean = false;
//   public CreatedBy: number = 0;
//   public ModifyBy: number = 0;
//   public EndTermID: number = 0;
//   public RoleID: number = 0;
//   public InstituteID: number = 0;

//   public StreamName: string = "";
//   public SemesterName: string = "";
//   public SubjectName: string = "";
//   public SatffName: string = '';
//   public SectionsName: string = '';
 
// }


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

export class ScholarshipApiDataModel {
  public RequestType: string = '';
  public CollegeType: string = '';
  public RequestId: string = '';
  public InstituteID: number = 0;
  public COURSEID:string=''
  public collegeCode: string = '';
}

export class ScholarshipApiSearchDataModel {

  public CollegeType: string = '';

  public CollegeCode: string = '';

  public DepartmentID: number = 0

  public AcademicYear:number=0
}
