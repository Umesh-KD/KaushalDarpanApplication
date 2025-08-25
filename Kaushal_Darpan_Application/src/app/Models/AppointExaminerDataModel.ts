export class AppointmentExaminerDataModel {
  public AppointExaminerID: number = 0;
  public CourseID: number = 0;
  public SubjectID: number = 0;
  public SemesterID: number = 0;
  public RollNumberFrom: string = '';
  public RollNumberTo: string = '';
  public ExaminerID: number = 0
  public GroupCode: string = ''
  public SSOID: string = ''
  /*     public RoomNumber: string = '';*/
  /*   public Date: string = '';*/
  /*   public InvigilatorSSOID: InvigilatorSSOIDList[] = [];*/

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0
  public DepartmentID: number = 0
}

export class AppointExaminerSearchModel {
  public DepartmentID: number = 0
}
