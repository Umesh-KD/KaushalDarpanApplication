import { extend } from "highcharts";
import { RequestBaseModel } from "./RequestBaseModel";
import { ResponseBaseModel } from "./ResponseBaseModel";

export class GroupCodeAllocationSearchModel extends RequestBaseModel {
  public SemesterId: number = 0;
  public PartitionSize: number = 0;
  public CommonSubjectYesNo: number = 0;
}
export class GroupCodeAllocationAddEditModel extends ResponseBaseModel {
  public GroupCodeID: number = 0; // pk  
  public SemesterId: number = 0;
  public SemesterName: string = '';
  public GroupCode?: any = 0 || ''; // new generate
  public Total: number = 0;
  public StartValue: number = 0;//group code start
  public CommonSubjectID: number = 0;
  public CommonSubjectName: string = '';
  public SubjectCode: number = 0;
  public SubjectName: string = '';
}

// group code
export class GroupCodeAddEditModel extends ResponseBaseModel {
  public PageNumber: number = 0;
  public PartitionSize: number = 0;
  public GroupNo: number = 0;
  public Total: number = 0;
  public GroupCodeID: number = 0;//pk  
  public SemesterID: number = 0;
  public SemesterName: string = '';
  public CommonSubjectID: number = 0;
  public CommonSubjectName: string = '';
  public SubjectCode: number = 0;
  public SubjectName: string = '';
  public UpShiftPageNumber: number = 0;
  public StudentExamPaperMarksIDs: string = '';
  public StudentExamPaperRevaluationIDs?: string = '';
  public CenterCode: string = '';
  public IsDirectPicked: boolean = false;
}
// group code detail
export class GroupCodeDetailAddEditModel {
  public PageNumber: number = 0;
  public GroupCodeDetailID: number = 0;//pk
  public GroupCodeID: number = 0;//fk
  public StudentID: number = 0;
  public StudentExamID: number = 0;
  public StudentExamPaperID: number = 0;
  public StudentExamPaperMarksID: number = 0;
}

