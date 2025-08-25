import { RequestBaseModel } from "./RequestBaseModel";

export class StudentCenteredActivitesModels {

  public BranchID: number = 0;
  public StudentExamPaperMarksID: number = 0;
  public SemesterID: number = 0;
  public StudentID: number = 0;
  public StreamID: number = 0;
  public ObtainedTheory: number = 0;
  public IsPresentTheory: number = 0;
  public IsPresentStudentCenteredActivity: number = 1;
  public ObtainedStudentCenteredActivity: number = 0;
  public SubjectID: number = 0;
  public RollNo: string = '';
  public InstituteID: number = 0;
  public InstituteName: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public Marked?: boolean = false;
  public UserID: number = 0;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public AdmissionCategoryID: number = 0;
  public IsSCAChecked: boolean = false;
  public UFMDocument: string = '';
  public Dis_UFMDocument: string = '';
  public isFinalSubmit: boolean = false
  public IsDetain: boolean = false
  public rowclass:string=''

}

export class StudentCenteredActivitesSearchModel extends RequestBaseModel {
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public StudentID: number = 0;
  public SubjectID: number = 0;
  public MarkEnter: number = 0;
  public RollNo: string = '';
  public InstituteID: number = 0;
  public UserID: number = 0;
  public InstituteName: string = '';
  public AdmissionCategoryID: number = 0;
  public Dis_UFMDocument: string = '';
  public UFMDocument: string = '';
}

export class DTEApplicationDashboardModel {
  public ApplicationID: number = 0;
  public DepartmentID: number = 0;
  public ModifyBy: number = 0;
  public UserID: number = 0;
  public EndTermID: number = 0;
  public InstituteID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public Menu?: string = '';
  public Status: number = 0;
  public FinancialYearID: number = 0;
  public HostelID: number = 0;
  public GuestRoomID: number = 0;
  
}


