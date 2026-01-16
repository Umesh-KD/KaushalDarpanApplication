import { extend } from "highcharts";
import { RequestBaseModel } from "./RequestBaseModel";
import { ResponseBaseModel } from "./ResponseBaseModel";

export class GroupCodeAllocationSearchModel extends RequestBaseModel {
  public SemesterId: number = 0;
  public PartitionSize: number = 0;
  public CommonSubjectYesNo: number = 0;
  public schemeId: number = 0;
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
  public GroupCodeDetailID: number = 0;
  public GroupCodeID: number = 0;
  public StudentID: number = 0;
  public StudentExamID: number = 0;
  public StudentExamPaperID: number = 0;
  public StudentExamPaperMarksID: number = 0;
}


export class GroupCodeAllocationReportModel {
  public groupCodeID: number = 0;
  public semesterId: number = 0;
  public semesterName: string = '';
  public groupCode: number= 0;
  public total: number= 0;
  public startValue: number = 0;
  public commonSubjectID: number = 0;
  public commonSubjectName: string = '';
  public subjectCode: string = '';
  public subjectName: string = '';
  public action: string = '';
  public schemeid: number = 0;
  public isPresentTotal: number = 0;
  public centergroupcode: string = '';
  public endTerm: string = '';
  public examName: string = '';
}



