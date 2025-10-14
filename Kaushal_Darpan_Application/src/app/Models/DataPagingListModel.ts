export class DataPagingListModel
{
  public PageNumber: number = 0;
  public PageSize: number = 0;
  public InstituteID: number = 0;
  public SemesterID: number = 0;
  public TotalRecord: number = 0;
  public TotalPages: number = 0;
  public PageFrom: number = 0;
  public PageTo: number = 0;
  public StudentIds: string = '';
  public StudentExamIDs: string = '';
  public DepartmentID: number = 0;
  public Eng_NonEng: number = 0;
  
}




export class NCVTChunkInfoDataModelDataPagingList
{
  public IsSelected: boolean = false;
  public PageNumber: number = 0;
  public PageSize: number = 0;
  public RowCount: number = 0;
  public MinAID: number = 0;
  public MaxAID: number = 0;
  public AIDS: String = '';
  public TotalRecord: String = '';
  public TotalPage: String = '';
 }
