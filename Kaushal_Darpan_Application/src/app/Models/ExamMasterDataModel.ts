import { RequestBaseModel } from "./RequestBaseModel";

export class ExamMasterDataModel {
  public ExamMasterID: number = 0;
  public SessionYearID: number = 0;
  public SessionMonthID: number = 0 ;
  public ProgramTypeID: number = 0;
  public ExamTypeID: number = 0;
  public SemesterID: number = 0;
  public AdmissionCategoryID: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;
}

export class BlankReportModel extends RequestBaseModel {
  public BranchID: number = 0
  public SemesterID:number=0
  public ShiftID:number=0
  public CategoryID:number=0
  public SubjectID:number=0
  public ExamCategoryID:number=0
  public InstituteID: number = 0
  public SubjectCode: string = ''
  public ExamDate: string = ''
  public CenterID:number=0
  public UserID:number=0
  public DistrictID:number=0
}
