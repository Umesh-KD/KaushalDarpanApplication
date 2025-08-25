export interface DashboardCardModel {
  "TotalText": string;
  "TotalTextHi": string;
  "TotalCount": number;
  "URL": string;
  "SRC": string;
  "Menu": string;
  "Status": number;
}



export interface StudentExamDetails {
  [x: string]: any;
  Selected: boolean;
  Status: number;
  MsgStatus: string;
  MsgText: string;
  StudentExamStatus: string;
  StudentID: number;
  InstituteID: number;
  ApplicationNo: string;
  StudentName: string;
  FatherName: string;
  EnrollmentNo: string;
  RollNo: number;
  MobileNo: number;
  InstituteName: string;
  BranchName: string;
  SemesterName: string;
  Division: string;
  Result: string;
  Percentage: string;
  DistrictName: string | null;
  EndTermID: number;
  StreamID: number;
  SemesterID: number;
  Dis_DOB: string; // Date of birth in string format, can be parsed into a Date object if necessary
  StudentType: number;
  ListType: string;
  CreatedDate: string;

}

export class NotifyStudentModel {
  public EndTermID: number = 0;
  public UserID: number = 0;
  public DepartmentID: number = 0;
  public AcademicYear: number = 0;
  public Action: string = '';
  public List: StudentExamDetails[] = [];
 
}
export class NotifyStudentList {
  public applicationID: number = 0;
  public stutus: number = 0;  // Note: "Stutus" should be corrected to "status" if it's a typo
  public streamID: number = 0;
  public endTermID: number = 0;
  public semesterID: number = 0;
  public applicationNo: string = '';
}

export class PlacementReportSearchData {
  public EndTermID: number = 0;
  public CourseType: number = 0;
  public DepartmentID: number = 0;
  public FromDate: string = '';
  public ToDate: string = '';
  public CollegeName: string = '';
  public BranchName: string = '';
}

