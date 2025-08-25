import { RequestBaseModel } from "./RequestBaseModel";

export class ITIStudentCenteredActivitesModels {

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
}

export class ItiStudentCenteredActivitesSearchModel extends RequestBaseModel {
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public StudentID: number = 0;
  public SubjectID: number = 0;
  public MarkEnter: number = 0;
  public RollNo: string = '';
  public InstituteID: number = 0;
  public InstituteName: string = '';
  public AdmissionCategoryID: number = 0;
}
