export class PapersMasterDataModels {
  public PaperID: number = 0;
  public FinancialYearID: number = 0;
  public EndTermID: number = 0;
  // public CommonSubjectID: number = 0; // Uncomment if needed
  public SubjectCode: string = '';
  public SemesterID: number = 0;
  public StreamSubjectCode: string = '';
  public SubjectCat: string = '';
  public SubjectID: number = 0;
  public SubjectName: string = '';
  public L: number = 0; // Lecture hours
  public T: number = 0; // Tutorial hours
  public P: number = 0; // Practical hours
  public Th: number = 0; // Theory marks
  public Pr: number = 0; // Practical marks
  public Ct: number = 0; // Class test marks
  public Tu: number = 0; // Tutorial marks
  public Prs: number = 0; // Practical sessional marks
  public Credit: number = 0;
  public Paper_ID: number = 0;
  public StreamID: number = 0;

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;

  public UserID: number = 0;

}

export class PaperMasterSearchModel {
  public DepartmentID: number = 0;
}
