import { RequestBaseModel } from "./RequestBaseModel";

export class InvigilatorAppointmentDataModel {
  public InvigilatorAppointmentID: number = 0;
  public CourseID: number = 0;
  public SemesterID: number = 0;
  public SubjectID: number = 0;
  public RollNumberFrom: string = '';
  public RollNumberTo: string = '';
  public RoomNumber: string = '';
  public Date: string = '';
  public InvigilatorSSOID: InvigilatorSSOIDList[] = [];
  public InstituteID : number = 0


  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0
  public RTS?: string = '';
  public CreatedBy: number = 0;
  public UserID: number = 0;
  public ModifyDate?: string = '';
  public IPAddress?: string = '';
  public DepartmentID: number = 0
  public EndTermID: number = 0
}

export class InvigilatorSSOIDList {
  public SSOID: string = '';
  public StaffID: number = 0
  public UserID: number = 0
  public Name?: string = ''
  public IsPrimary: boolean = false;
}

export class InvigilatorSearchModel extends RequestBaseModel {
  public action: string = ''
  public InstituteID: number = 0
  public ModifyBy: number = 0
  public UserID: number = 0
  public ExamDate?: string = ''
  public ShiftID?: number = 0
}

export class UnlockExamAttendanceDataModel extends RequestBaseModel {
  public action: string = ''
  public InstituteID: number = 0
  public UserID: number = 0
  public CenterSuperintendentID: number = 0
  public TimeTableID: number = 0
}