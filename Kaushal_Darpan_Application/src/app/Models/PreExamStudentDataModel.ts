import { RequestBaseModel } from "./RequestBaseModel";

export class PreExamStudentDataModel extends RequestBaseModel {
  public ApplicationNo: string = '';
  public EnrollmentNo: string = '';
  public Name: string = '';
  public InstituteID: number = 0;
  public ManagementTypeID: number = 0;
  public MobileNo: string = '';
  public BranchID: number = 0;
  public StreamID: number = 0;
  public Year_SemID: number = 0;
  public FinacialYearID: number = 0
  public StudentTypeID: number = 0;
  public StudentStatusID: number = 0;
  public StudentFilterStatusId: number = 0;
  public ExamCategoryID: number = 0;
  public OptionalSubjectStatus: string = '0';
  public BridgeCourseID: string = '-1';
  public SessionType: number = 51;
  public IsYearly?:number = 0;
  public AdmittStatus?:string = '-1';
}

export class PreExam_UpdateEnrollmentNoModel extends RequestBaseModel {
  public StudentID: number = 0;
  public EnrollmentNo: string = '';
  public InstituteID: number = 0;
  public StreamID: number = 0;
  public OrderNo: string = '';
  public OrderDate: string = '';
  public UpdatedDate: string = '';
  public CreatedBy: number = 0;
  public Action: string = ''
  public StudentExamID: number = 0
  public IsUpdate: boolean=false
}

export class PreExam_UpdateOptionalSubjectModel {
  public StudentID: number = 0;
  public EnrollmentNo: string = '';
  public InstituteID: number = 0;
  public StreamID: number = 0;
  public OrderNo: string = '';
  public OrderDate: string = '';
  public UpdatedDate: string = '';
  public CreatedBy: number = 0;
}
export class OptionalSubjectRequestModel extends RequestBaseModel {
  public StudentID: number = 0;
  public RowJson: string = "";
  public CreatedBy: number = 0;
} 
export class AnnexureDataModel {
  public DepartmentID: number = 0;
  public Eng_NonEng: number = 0;
  public EndTermID: number = 0;
  public StudentExamType: number = 0;
  public InstitueID: number = 0;
      
} 
