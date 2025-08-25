export class CertificateDataModel {
  public MigrationID: number = 0;
  public ExamTypeID: number = 0;
  public EnrollmentNo: number = 0;
  public RevisedID: number = 0;
  public MigrationTypeID: number = 0;
  public ProvisionalTypeID: number = 0;
  public InstituteID: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;
}

export class CertificateSearchModel {
  public MigrationID: number = 0;
  public ExamTypeID: number = 0;
  public EnrollmentNo: number = 0;
  public RevisedID?: number = -1;
  public EndTermID: number = 0;
  public RWHResultID: number = 0;
  public MigrationTypeID: number = 0;
  public ProvisionalTypeID: number = 0;
  public InstituteID: number = 0;
  public UserID: number = 0;
  public ModifyBy: number = 0
  public RoleID: number = 0
  public DepartmentID: number = 0;
}
