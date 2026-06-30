export class BterCertificateReportDataModel {
  public InstituteID: number = 0;
  public SemesterID: number = 0;
  public Eng_NonEng: number = 0;
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public RevisedType: number = 0;
  public ResultType: number = 0;
  public Action: string = '';
  public EnrollmentNo: string = '';
  public StudentID: number = 0;
 
}

export class BterDuplicateCertificateReportDataModel {
  public InstituteID: number = 0;
  public SemesterID: number = 0;
  public Eng_NonEng: number = 0;
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public RevisedType: number = 0;
  public ResultType: number = 0;
  public Action: string = '';
  public EnrollmentNo: string = '';
  public StudentID: number = 0;
  public Document_ID?: number = 0;
  public ReqId?: number = 0;
  public DocumentPath?: string = ''
  public DocumentFilename?: string = ''
}
