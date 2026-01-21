export class AddBhandarFormDataModel {
  public MoharID: string = ''
  public BhandarID: number = 0
  public EndtermID: number = 0
  public ShiftID: number = 0
  public ShiftID_choosen: number = 0
  public CenterID: number = 0
  public SemesterID: number = 0
  public UserID: number = 0
  public UserName: string = ''
  public ExamDate: string = ''

  public Name: string = ''
  public ExamNo: string = ''
  public StudentNo: string = ''
  public FromDutyTime: string = ''
  public ToDutyTime: string = ''
  public Size: string = ''
  public Remark: string = ''
  public DisFileName: string = ''
  public FileName: string = ''
  public IsOpen: boolean = false
  public BhandarDetailsModel:any=[]
  public BhandarStudentModel:any=[]
}
export class BhandarDetailsModel {
  public BhandarID:number=0
  public Name: string = ''
  public ExamNo: string = ''
  public StudentNo: string = ''
public  FromDutyTime:string=''
public  ToDutyTime:string=''
public  Size:string=''
}
