import { RequestBaseModel } from "./RequestBaseModel";

export class MarksheetLetterDataModel extends RequestBaseModel{
 // public ApplicationNo: string = '';
 //public EnrollmentNo: string = '';

}

export class MarksheetLetterSearchModel {
  public DepartmentID: number = 0;
  //public ApplicationID?: number = 0;
  //public StudentName: string = '';
  //public MobileNo: string = '';
  //public Gender: number = 0;
  public InstituteID?: number=0;
  public SemesterID: number = 0;
  public ExamTypeID: number = 0;
  public RWHResultID: number = 0;
  public EndTermID: number = 0;
  public AcademicYearID: number = 0;
  public Eng_NonEngID: number = 0;
  

}

export class BackPaperReportDataModel extends RequestBaseModel {
  
}




