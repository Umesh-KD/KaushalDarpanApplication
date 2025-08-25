import { RequestBaseModel } from "./RequestBaseModel";

export class TimeTableDataModels {

  public TimeTableID: number = 0;
  public SemesterID: number = 0;
  public SubjectID: number = 0;
  public ExamDate: string = '';
  public StartTime: string = ''; 
  public SubjectCode: string = ''; 
  public EndTime: string = '';
  public ShiftID: number = 0;

  public EndTermID: number = 0;
  public FinancialYearID: number = 0;
  public IsYearly?: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0
  public ModifyBy: number = 0
  public CreatedBy: number = 0
  public DepartmentID: number = 0
  public InvigilatorID: number = 0
  public Eng_NonEng: number = 0
  public BranchSubjectDataModel: BranchSubjectDataModel[] = [];
}

export class BranchSubjectDataModel {
  public SubjectID: number = 0;
  public SubjectName: string = '';
  public PaperCode: string = '';
  public BranchID: number = 0;
  public BranchName: string = '';
  // public SemesterID: number = 0;
  // public SubjectCode?: string = '';
  // public SubjectCodeID?: number = 0;
}

export class TimeTableSearchModel extends RequestBaseModel {
  public SemesterID: number = 0
  public InstituteID: number = 0
  public ShiftID: number = 0
  public Action: string = '';
  public Status :number=0
}

export class TimeTableInvigilatorModel {
  public ID: number = 0
  public TimeTableID: number = 0
  public SemesterID: number = 0
  public InstituteID: number = 0
  public InvigilatorID: number = 0

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0
  public CreatedBy: number = 0
  public DepartmentID: number = 0
}



export class TimeTableValidateModel
{
  public TimeTableID: number=0;
  public SubjectCode?: string='';
  public SemesterID: number=0;
  // public StreamList?: StreamList[];
  public SubjectList?: SubjectList[];
}

export class StreamList
{
  public StreamID: number=0;
  public name?: string='';
}

export class SubjectList{
  public ID: number=0;
  public name?: string='';
}


//export interface TimeTableValidateModel {
//  timeTableID: number;
//  subjectCode?: string;
//  semesterID: number;
//  streamList?: StreamList[];
//}

//export interface StreamList {
//  streamID: number;
//  name?: string;
//}




