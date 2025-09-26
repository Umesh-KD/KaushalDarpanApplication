
export class CollegeWiseScholarshipSearchModel {
  public Name: string = '';
  public Status: string = '';
  public ModifyBy: number = 0
  public RoleID: number = 0
  public DepartmentID: number = 0;
  public InstituteID:number=0;
  public PageSize: number = 50
  public PageNumber: number = 1

  public SortOrder: string = '';
  public SortColumn: string = '';
}


export class AddScholarshipSectionModel {
  public ID: number = 0;
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public SubjectID: number = 0;
  public SSOID: string = '';
  public UserID: number = 0;
  public StaffID: number = 0;
  public SectionIDs: string = '';
  public DisplayName: string = '';
  public DepartmentID: number = 0;
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public EndTermID: number = 0;
  public RoleID: number = 0;
  public InstituteID: number = 0;

  public StreamName: string = "";
  public SemesterName: string = "";
  public SubjectName: string = "";
  public SatffName: string = '';
  public SectionsName: string = '';
 
}