export interface CollegesWiseExaminationRptsModel {
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

export class CollegesWiseExaminationRptSearchModel {
  public DepartmentID?: number = 0
  public EndTermID?: number = 0
  public AcademicYearID?: number = 0
  public CourseTypeID?: number = 0
  public InstituteID?: number = 0
  public SemesterID?: number = 0
  public BranchID?: number = 0
}
