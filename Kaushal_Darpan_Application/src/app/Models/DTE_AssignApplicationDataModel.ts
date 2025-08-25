import { RequestBaseModel } from './RequestBaseModel';

export class AssignApplicationDataModel {
  public ID: number = 0;
  public FromApplicationNo: number | null = null;
  public ToApplicationNo: number | null = null;
  public VerifierID: number = 0;
  public Applied: number = 0;
  public Remark: string = '';
  public EndTermID: number = 0;
  public ApprovedCount: string = '';
  public RejectedCount: string = '';
  public PendingCount: string = '';
  public DeficiencyUploaded: string = '';

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public DepartmentID: number = 0;
  public CourseType: number = 0;
  public ShowAllApplication: boolean = false;
}

export class AssignApplicationSearchModel {
  public VerifierID: number = 0;
  public Application?: number;
  public DepartmentID: number = 0;
  public Eng_NonEng: number = 0;
  public EndTermID: number = 0;
}

export class SearchModelAssignedApplication {
  public CategoryA: number = 0;
  public CategoryB: number = 0;
  public CategoryC: number = 0;
  public Gender: number = 0;
  public CategoryD: number = 0;
  public ApplicationStatus: number = 0;
  public Name: string = '';
  public MobileNumber: string = '';
  public FromApplication: string = '';
  public ToApplication: string = '';
  public Action: string = '';
  public Eng_NonEng: number = 0;
  public AcademicYearID: number = 0;
  public VerifierID: number = 0;
}

export class RevertApplicationDataModel extends RequestBaseModel {
  public ApplicationID: number = 0;
  public UserID: number = 0;
}
