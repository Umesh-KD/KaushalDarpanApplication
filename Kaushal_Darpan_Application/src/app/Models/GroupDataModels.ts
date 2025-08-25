export class GroupDataModels {

  public GroupID: number = 0;
  public SubjectID: number = 0;
  public ExamID: number = 0;
  public GroupCode: string = '';
  public CenterCode: string = '';
  public SubjectCode: string = '';

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public DepartmentID: number = 0
}

export class GroupSearchModel {
  public GroupCode: string = '';
  public SubjectCode: string = '';
  public CenterCode: string = '';
  public ExamID: number = 0
  public DepartmentID: number = 0
  public Eng_NonEng: number = 0
}
