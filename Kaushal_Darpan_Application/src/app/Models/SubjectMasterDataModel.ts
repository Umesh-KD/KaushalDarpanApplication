import { SubjectList } from "./TimeTableModels";

export class SubjectMasterDataModel {

  public SubjectID: number = 0;
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public ParentID: number = 0;

  public SubjectName: string = '';
  public isParent: boolean = false
  public SubjectCode: string = '';
  public is_th: boolean = false
  public is_pr: boolean = false
  public is_ia: boolean = false
  public is_sca: boolean = false
  public max_th: number = 0
  public max_pr: number = 0
  public sca_grade: number = 0
  public max_ia: number = 0
  public SubjectType: number = 0;
  public SubjectRadio: boolean = false
  public ActiveDeactive: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public Modify: number = 0;
  public DepartmentID: number = 0
  public CourseType: number = 0
  public EndTermID: number = 0
  public Selected: boolean = false;
  public IsTheorySubject: boolean = false;
  public IsPracticalSubject: boolean = false;
  public IsSCASubject: boolean = false;
  public IsInternalAssisment: boolean = false;

  

  public SubjectCredits:number |null=null
}
export class SubjectSearchModel {
  public BranchID: number = 0
  public SemesterID: number = 0
  public DepartmentID: number = 0
  public SubjectID: number = 0
  public CourseType:number=0
}
export class ParentSubjectMap{
  public SubjectID: number = 0
  public SubjectList: SubjectList[]=[]
}
export class AssignHodBranch {
  public UserID: number = 0
  public UserAdditionalID:number=0
  public InstituteID: number = 0
  public CourseTypeID:number=0
  public Branchlist: BranchList[] = []
  public ModifyBy:number=0
  public RoleID:number=0
  public UserRole:number=0
}

export class BranchList {
  public StreamID: number = 0
  public StreamName:string=''
}
