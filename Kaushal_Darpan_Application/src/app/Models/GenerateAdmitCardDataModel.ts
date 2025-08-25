export class GenerateAdmitCardSearchModel {
  public InstituteID: number = 0
  public StreamID: number = 0
  public SemesterID: number = 0;
  public UserID: number = 0;
  public RoleID: number = 0;
  public DepartmentID: number = 0
  public Eng_NonEng: number = 0
  public EndTermID: number = 0  
  public StudentID: number = 0  
  public StudentExamID: number = 0
  public EnrollmentNo: string = ''
  public AdmitCard?: string = ''
  public AdmitCardPath?: string = ''
}



export class GenerateAdmitCardModel {

  public StudentID: number = 0
  public ApplicationID: number = 0
  public EnrollmentNo: string = ''
  public RollNumber: string = ''
  public StudentName: string = ''
  public FatherName: string = ''
  public InstituteName: string = ''
  public SemesterName: string = ''
  public StudentCategory: string = ''
  public InstituteCode: string = ''
  public DOB: string = ''
  public InstituteID: number = 0
  public StreamID: number = 0
  public SemesterID: number = 0
  Marked: boolean = false
  public EndTermID: number = 0
  public StreamName: number = 0
  public ModifyBy: number = 0


}


export class GetCollegeInformationReport {

 public AcademicYearID: number = 0;

}


export class GetEWSReport {

  public AcademicYearID: number = 0;
  public StreamID: number = 0;
  public InstituteID : number = 0;


}


export class GetUFMStudentReport {

  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;


}



export class GetSessionalFailStudentReport {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public SemesterID: number = 0;
}


export class GetRMIFailStudentReport {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public SemesterID: number = 0;
}

export class GetTheoryFailStudentReport {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public SemesterID: number = 0;
}

export class GetRevaluationStudentDetailReport {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public SemesterID: number = 0;
}

export class GetStudentExaminerDetailReport {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public SemesterID: number = 0;
}
