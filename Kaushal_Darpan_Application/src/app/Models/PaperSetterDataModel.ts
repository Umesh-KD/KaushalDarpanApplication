import { RequestBaseModel } from "./RequestBaseModel"

export class TeacherForPaperSetterSearchModel extends RequestBaseModel {
  public SemesterID: number = 0
  public StreamID: number = 0
  public SubjectID: number = 0
  public UserID: number = 0
  public InstituteID: number = 0
  public CommonSubjectYesNo: number = 1
  public CommonSubjectID: number = 0
  public CommonSubjectDetailID: number = 0
}

export class PaperSetterDataModel extends RequestBaseModel {
  public PaperSetterID: number = 0
  public SemesterID: number = 0
  public ExaminerCode: string = ''
  public StreamID: number = 0
  public SubjectID: number = 0
  public InstituteID: number = 0
  public StaffID: number = 0
  public DesignationID: number = 0
  public Name: string = ''
  public AssignGroupCode: string = ''
  public SSOID: string = ''
  public IsAppointed: boolean = false
  public ModifyBy: number = 0
  public CreatedBy: number = 0
  public UserID: number = 0
  public ExamID: number = 0
  public GroupID: number = 0
  public CourseType: number = 0
  public ActiveStatus: boolean = true
  public DeleteStatus: boolean = false
}

export class PaperSetterSearchModel extends RequestBaseModel {
  public SemesterID: number = 0
  public StreamID: number = 0
  public SubjectID: number = 0
  public Name: string = ''
  public GroupCodeID: number = 0
  public ExamID: number = 0
  public CommonSubjectYesNo: number = 1
  public CommonSubjectID: number = 0
  public PaperSetterStatus: number = 0
  public StaffID?: number = 0
}

export class StaffForPaperSetterListDataModel {
  
  public SSOID: string = ''
  public Name: string = ''
  public DesignationName: string = ''
  public InstituteName: string = ''
  public DateOfJoining: string = ''
  public MobileNumber: string = ''
  public SubjectName: string = ''
  public Email: string = ''
  public SubjectCode: string = ''
  public StreamName: string = ''
  public QualificationName: string = ''
  
  public StaffID: number = 0
  public StaffUserID: number = 0
  public DesignationID: number = 0
  public InstituteID: number = 0
  public PaperSetterID: number = 0
  public SubjectID: number = 0
  public StreamID: number = 0
  public StaffSubjectId: number = 0

  public IsAppointed: boolean = false
  public Selected: boolean = true
  
  public GroupCodeID: number = 0
  public ExamID: number = 0
  public CommonSubjectYesNo: number = 1
  public CommonSubjectID: number = 0
}

export class AppointPaperSetterDataModel extends RequestBaseModel {
  public PaperSetterID: number = 0
  public PaperSetterStatus?: number = 0

  public SemesterID: number = 0
  public StreamID: number = 0
  public SubjectID: number = 0
  public ModifyBy: number = 0

  public CommonSubjectYesNo: number = 1
  public CommonSubjectID: number = 0

  public StaffDetails: StaffForPaperSetterListDataModel[] = []
}

export class VerifyPaperSetterDataModel{
  public PaperSetterID: number = 0
  public StaffID?: number = 0
  public UserID: number = 0
}