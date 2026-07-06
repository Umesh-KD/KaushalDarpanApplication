export interface CollegesWiseReportsModel {
  CollegeName: string;
  TotalStudents: number;
  FirstYear: number;
  SecondYear: number;
  ThirdYear: number;
  FourthYear: number;
  FifthYear: number;
  SixthYear: number;
  Examination: number;

}
export class MarksheetCorrectionHistoryModel {

  public StudentHistoryID: number = 0;
  public EnrollMentNo: string = '';
  public MarksheetID: number = 0;
  public StudentName: string = '';
  public FatherName: string = '';
  public MotherName: string = '';
  public DOB!: Date;
  public SelectedEndTermID: number = 0;
  public MarksheetType: number = 0;
  public MarksheetTypeName: string = '';
  public CreatedBy: number = 0;
  public CreatedSsoID: string = '';
  public CreatedDate!: Date;
}
