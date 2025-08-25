export class DownloadMarksheetSearchModel {
  public SemesterID: number = 0
  public InstituteID: number = 0
  public IsRevised: number = 0
  public IsBridge: number = 0
  public ResultTypeID: number = 0
  public RollNo: number = 0
  public DepartmentID: number = 0
  public StudentID: number = 0
  public EndTermID: number = 0
  public Eng_NonEngID: number = 0
  public MarksheetPath: string = ''
  public Marksheet: string = ''
  public IPAddress: string = ''
  public ExamType: number = 0

  public IsReval?: boolean = false
  public IsRWHResult?: boolean = false
  public IsLateral?: boolean = false
}


export class HostelWardenSomeDetailsModel {
  public txtWFatherContactNo: string = ''
  public txtWLocalGuardianName: string = ''
  public txtWLocalGuardianContactNo: string = ''
}


