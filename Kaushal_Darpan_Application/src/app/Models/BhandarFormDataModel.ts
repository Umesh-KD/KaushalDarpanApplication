export class AddBhandarFormDataModel {
  public MoharID: number = 0
  public BhandarID: number = 0
  public EndtermID: number = 0
  public ShiftID: number = 0
  public CenterID: number = 0
  public SemesterID: number = 0
  public UserName: string = ''
  public ExamDate: string = ''

  public Name: string = ''
  public ExamNo: string = ''
  public StudentNoNo: string = ''
  public FromDutyTime: string = ''
  public ToDutyTime: string = ''
  public Size: string = ''
  
  public BhandarDetailsModel:any=[]
  public BhandarStudentModel:any=[]
}
export class BhandarDetailsModel {
  public BhandarID:number=0
  public Name: string = ''
  public ExamNo: string = ''
  public StudentNoNo: string = ''
public  FromDutyTime:string=''
public  ToDutyTime:string=''
public  Size:string=''
}
