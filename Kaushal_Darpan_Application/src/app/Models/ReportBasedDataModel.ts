import { RequestBaseModel } from "./RequestBaseModel"

export class ReportBasedModel extends RequestBaseModel {
  public StudentID:number=0
  public ExamType:number=0
  public EnrollmentNo: string = ''
  public ApplicationNo: string = ''
  public StudentExamID: string = ''
  public Action: string = ''
  public SemesterID: number = 0
  public FileType: string = ''
}

export class AttendanceRpt13BDataModel extends RequestBaseModel {
  public ExamDate?: string = ''
  public ShiftID?: number = 0
  public ExamCategoryID?: number = 0
  public InstituteID?: number = 0
  public StudentExamType?: number = 0
  public StreamID?: number = 0
  public Status?: number = 0
  public SemesterID: number = 0
  public SubjectCode?: string = ''
  public RollNumber?: string = ''
  public SubjectID?: number = 0
  public UserID?: number = 0

}

export class AttendanceRpt23DataModel extends RequestBaseModel {
  public ExamDate?: string = ''
  public ShiftID?: number = 0
  public ExamCategoryID?: number = 0
  public InstituteID?: number = 0
  public StudentExamType?: number = 0
  public StreamID?: number = 0
  public Status?: number = 0
  public SemesterID: number = 0
  public SubjectID: number = 0
}
