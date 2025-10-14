import { QualificationViewDetails } from "../ItiApplicationPreviewDataModel";

export class ITIStudentMeritInfoModel {

  public ApplicationID: number = 0;
  public AllotmentMasterId: number = 0;
  public ApplicationNo: string = ''
  public StudentName: string = '';
  public Gender: string = '';
  public categoryName: string = '';
  public TenthPer: string = '';
  public MaxMarks: string = '';
  public MarksObt: string = '';
  public Class: number = 0;
  public CategoryId: number = 0;
  public MeritNo: number = 0;
  public IsPH: boolean = false
  public IsKM: boolean = false
  public IsWID: boolean = false
  public IsRajDOMICILE: boolean = false
  public IsSingleMotherDependent: boolean = false
  public IsTSP: boolean = false
  public IsExServicemen: boolean = false
  public ExServicemenId: boolean = false
  public DOB: string = '';
  public IsApply: boolean = false
  public PrefentialCategory: string = ''

  public status: number = 0;
  public Action: number = 0;
  public MeritId: number = 0;
  public IsEdit: boolean = false;

  public CourseTypeID: number = 0;
  public DepartmentID: number = 0;

  public QualificationViewDetails: QualificationViewDetails[] = [];
/*  public RecheckDocumentModel: RecheckDocumentModel[] = []*/

}export class ItiCollegeModel
{
    public CollegeID: number = 0
}

export class ITICollegeSearchModel
{
    public SearchText: string = ''
    public DivisionId: number = 0
    public DistrictId: number = 0
    public PageNumber: number = 0;
    public PageSize: number = 0;
  
  
}
export class bterCollegeSearchModel
{
    public SearchText: string = ''
    public DivisionId: number = 0
    public DistrictId: number = 0
    public PageNumber: number = 0;
    public PageSize: number = 0;
}
