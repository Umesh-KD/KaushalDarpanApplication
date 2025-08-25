import { RequestBaseModel } from "./RequestBaseModel";

export class ITITheoryMarksDataModels {

  public BranchID: number = 0;
  public StudentExamPaperMarksID: number = 0;
  public SemesterID: number = 0;
  public RollNo: string = '';
  public StudentID: number = 0;
  public StreamID: number = 0;
  public ObtainedTheory: number | null = 0;
  public IsPresentTheory: number = 1;
  public SubjectID: number = 0;
  public MaxTheory: number = 0;
  public GroupCode: string = '';
  public CenterCode: string = '';
  public SubjectCode: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public Marked?: boolean = false;
  public UserID: number = 0;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public StudentName: string = '';
  public InstituteNameEnglish: string = '';
  public SemesterName: string = '';
  public Name: string = '';
  public SubjectName: string = '';
  public IsPresentInternalAssisment: number = 1;
  public ObtainedInternalAssisment: number = 0;
  public MaxInternalAssisment: number = 0;
  public MaxPractical: number = 0;
  public ObtainedPractical: number = 0;
  public IsPresentPractical: number = 1;
  public InternalPracticalID: number = 0;
  public IsChecked: boolean = false;
  public IsFinalSubmit: boolean = false;
  public IsPracticalChecked: boolean = false
  public IsInternalAssesmentCheckecd: boolean = false
  public ExaminerID:number=0
}

export class ITITheoryMarksSearchModel extends RequestBaseModel {
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public StudentID: number = 0;
  public SubjectID: number = 0;
  public MarkEnter: number = 0;
  public RollNo: string = '';
  public InternalPracticalID: number = 0;
  public GroupCodeID: number = 0;
  public InstituteID: number = 0;
  public IsConfirmed: boolean = false;
  public ExaminerID: number = 0
  public AppointExaminerID: number = 0
}
export class CenterStudentSearchModel extends RequestBaseModel {
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public StudentID: number = 0;
  public SubjectID: number = 0;
  public MarkEnter: number = 0;
  public UserID: number = 0;
  public UserAdditionalID: number = 0;
  public CenterID :number=0
  public RollNo: string = '';
  public InternalPracticalID: number = 0;
  public GroupCodeID: number = 0;
  public InstituteID: number = 0;
  public IsConfirmed: boolean = false;
  public UFMDocument: string = '';
  public Dis_UFMDocument: string = '';
  public ExaminerCode: string = '';
  public SSOID: string = ''
  public SubjectType: string = ''
  public StudentName:string=''
}
