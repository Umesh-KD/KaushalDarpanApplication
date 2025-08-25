export class PlacementStudentSearchModel {
  public CampusPostID: number = 0;
  public CampusWiseHireRoleID: number = 0;
  public InstituteID: number = 0;
  public BranchID: number = 0;
  public _10thPre: number = 0;
  public _12thPre: number = 0;
  public DiplomaPre: number = 0;
  public FinancialYearID: string = '';
  public NoOfBack: number = 0;
  public AgeFrom: number = 0;
  public AgeTo: number = 0;
  public DepartmentID: number = 0;
}
export class StudentConsentSearchModel {

  public StudentID: number = 0;
  public PostID: number = 0;
  public SSOID: string = '';
  public Status: string = '';
  public action: string = '';
  public CompanyID: number = 0;
  public CollegeID: number = 0;
  public DepartmentID: number = 0;
}
export class CampusStudentConsentModel {
  public ConsentID: number = 0;
  public PostID: number = 0;
  public StudentID: number = 0;
  public SSOID: string = '';
  public Remarks: string = '';

  public CreatedBy: number = 0;
  public ModifyBy: number = 0;

}
