import { RequestBaseModel } from "./RequestBaseModel";

export class SetExamAttendanceSearchModel extends RequestBaseModel {
  SemesterID: number = 0
  SubjectID: number = 0
  StreamID: number = 0
  public InvigilatorAppointmentID: number = 0;
  public UserID: number = 0
  public ModifyBy: number = 0
  public SSOID: string = '';
  public ShiftID: number = 0
  public InstituteID:number=0
  public InternalPracticalID:number=0
  public TimeTableID :number=0
}

export class SetExamAttendanceModel {

  public StudentName: string = ''
  public StudentRollNo: string = ''
  public IsPresent: boolean = false
  public IsUFM: boolean = false
  public IsDetain: boolean = false
  public FinancialYearID: number = 0
  public InstituteID: number = 0
  public SemesterID: number = 0
  public Status: string = ''
  public StudentID: number = 0
  public SubjectID: number = 0
  public PaperID: number = 0
  public StreamID: number = 0
  public rowclass: string = ''
  public isFinalSubmit: boolean = false

  public Attendence_FileName: string = '';
  public Attendence_Dis_FileName: string = '';

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0
  public UserID: number = 0;
  public StudentExamPaperID: number = 0;
  public StreamName: string = '';
  public SubjectName: string = '';
  public StudentExamID: number=0

  public Dis_UFMDocument: string = ''
  public UFMDocument: string = ''

}
