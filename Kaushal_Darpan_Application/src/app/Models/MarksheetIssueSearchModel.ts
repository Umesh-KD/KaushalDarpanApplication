export class MarksheetIssueDataModels {
  public MarksheetIssueDataId: number = 0
  public SemesterID: number = 0
  public ResultTypeId: number = 0
  public ModifyBy: number = 0
  public CreatedBy: number = 0
  public IssuedDate: string = '';
  public IPAddress: string = '';
}


export class MarksheetIssueSearchModel {
  public ModifyBy: number = 0
  public RoleID: number = 0
  public SemesterID: number = 0;
}
