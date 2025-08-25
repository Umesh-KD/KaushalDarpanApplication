import { RequestBaseModel } from "./RequestBaseModel";

export class ITIExaminationStudentDataModel extends RequestBaseModel {
  public ApplicationNo: string = '';
  public EnrollmentNo: string = '';
  public Name: string = '';
  public InstituteID: number = 0;
  public ManagementTypeID: number = 0;
  public MobileNo: string = '';
  public BranchID: number = 0;
  public Year_SemID: number = 0;
  public FinacialYearID: number = 0
  public StudentTypeID: number = 0;
  public StudentStatusID: number = 0;
  public StudentFilterStatusId: number = 0;
  public ExamCategoryID: number = 0;
  public OptionalSubjectStatus: string = '0';
  public BridgeCourseID: string = '-1';
  public EligibilityStatus?: number = 0;
}

export class ITIExamination_UpdateEnrollmentNoModel {
  public StudentID: number = 0;
  public StudentExamID:number=0
  public EnrollmentNo: string = '';
  public InstituteID: number = 0;
  public StreamID: number = 0;
  public OrderNo: string = '';
  public OrderDate: string = '';
  public UpdatedDate: string = '';
  public CreatedBy: number = 0;
  public FolderName: string = ''
  public FileName:string=''
}

export class ITIExamination_UpdateOptionalSubjectModel {
  public StudentID: number = 0;
  public EnrollmentNo: string = '';
  public InstituteID: number = 0;
  public StreamID: number = 0;
  public OrderNo: string = '';
  public OrderDate: string = '';
  public UpdatedDate: string = '';
  public CreatedBy: number = 0;
}
export class ITIExaminationOptionalSubjectRequestModel extends RequestBaseModel {
  public StudentID: number = 0;
  public SubjectID: number = 0;
  public ParentSubjectID: number = 0;
  public StudentSubjectID: number = 0;
  public CreatedBy: number = 0;
} 
