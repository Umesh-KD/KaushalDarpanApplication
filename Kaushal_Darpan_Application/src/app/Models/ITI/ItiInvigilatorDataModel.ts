import { RequestBaseModel } from "../RequestBaseModel"

export class ItiInvigilatorDatAModel extends RequestBaseModel  {
  public InvigilatorID:number=0
  public RollNoFrom: string = ''
  public RollNoTo: string = ''
  public UserID: number = 0
  public InstituteID:number=0
  public StaffID:number=0
  public TimeTableID:number=0
}

export class ItiInvigilatorSearchModel extends RequestBaseModel {
  public TimeTableID:number=0
  public InstituteID: number = 0
  public InvigilatorID: number = 0
  public Action:string=''
}

export class ITITheorySearchModel {
  public SemesterID: number = 0
  public StreamID: number = 0
  public SubjectName: string = ''
  public InstituteID: number = 0
  public Action: string = ''
  public EndtermID:number=0
  public EngNong:number=0
 
}
