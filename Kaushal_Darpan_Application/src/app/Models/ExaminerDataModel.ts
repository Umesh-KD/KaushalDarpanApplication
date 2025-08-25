import { RequestBaseModel } from "./RequestBaseModel"

export class TeacherForExaminerSearchModel extends RequestBaseModel{
  public SemesterID: number = 0
  public StreamID: number = 0
  public SubjectID: number = 0
  public UserID: number = 0
  public InstituteID: number = 0
  public CommonSubjectYesNo: number = 1
  public CommonSubjectID: number = 0
  public IsYearly:number=-1
  public IsReval?:boolean=false
}

export class ExaminerDataModel extends RequestBaseModel {
  public ExaminerID: number = 0
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
  public CourseType:number=0
  public ActiveStatus: boolean = true
  public DeleteStatus: boolean = false
}

export class ExaminerSearchModel extends RequestBaseModel {
  public SemesterID: number = 0
  public StreamID: number = 0
  public SubjectID: number = 0
  public Name: string = ''
  public GroupCodeID: number = 0
  public ExamID: number = 0
  public CommonSubjectYesNo: number = 1
  public CommonSubjectID: number = 0
  public IsYearly: number = -1
}


export class ExaminerDashboardSearchModel extends RequestBaseModel
{
  
}
