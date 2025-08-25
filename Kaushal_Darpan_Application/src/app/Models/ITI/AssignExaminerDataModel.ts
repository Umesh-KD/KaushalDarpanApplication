export class ItiAssignExaminerSearchModel {
  public DepartmentID: number = 0
  public CenterID: number = 0
  public EndTermID: number = 0
  public Eng_NonEng: number = 0
  public DistrictID: number = 0
  public InstituteID: number = 0
  public RoleID: number = 0
  public Userid :number =0
}


export class ITIPracticalExaminerSearchFilters {
  public CenterID: number = 0
  public StudentExamID: number = 0
  public ExamType: number = 0
  public SemesterID: number = 0
  public Name?: string;
  public CenterCode?: string;
  public CenterName?: string;
  public ExaminerName?: string = '';
  public ExaminerSSOID?: string = '';
  public Action?: string;
  public SSOID?: string;
  public UserID: number = 0
  public InstituteID: number = 0
  public EndTermID: number = 0
  public FinancialYearID: number = 0
  public Eng_NonEng: number = 0
  public DepartmentID: number = 0


}


export class ITITheoryExaminer {
  public CenterID: number = 0
  public StreamID: number = 0
  public AppointExaminerID: number = 0
  /*  public StudentExamID: number = 0*/
  public BundleID: number = 0
  public SemesterID: number = 0
  public SubjectID: number = 0
  /*  public CenterCode?: string='';*/
  /*  public Name?: string;*/
  public RollNoFrom?: string = '';
  public RollNoTo?: string = '';
  public ExaminerCode?: string = '';
  public ExaminerID: number = 0;
  public Action?: string = '';
  public SSOID?: string = '';
  public UserID: number = 0
  public InstituteID: number = 0
  public EndTermID: number = 0
  public FinancialYearID: number = 0
  public Eng_NonEng: number = 0
  public DepartmentID: number = 0
  public StudentList: any[] = []

}
export class ITIExaminerDataModelSearchFilters {

  public CenterID: number = 0

  public EndTermID: number = 0

  /*public SubjectCode?: string;*/

  public SemesterID: number = 0

  public Eng_NonEng: number = 0


}

