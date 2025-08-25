import { RequestBaseModel } from "./RequestBaseModel";

export class TheoryMarksDataModels {

  public BranchID: number = 0;
  public StudentExamPaperMarksID: number = 0;
  public StudentExamPaperRevaluationID?: number = 0;
  public SemesterID: number = 0;
  public RollNo: string = '';
  public StudentID: number = 0;
  public StreamID: number = 0;
  public ObtainedTheory: number | null = 0;
  public IsPresentTheory: number = 1;
  public SubjectID: number = 0;
  public MaxTheory: number = 0;
  public GroupCode: string = '';
  public CenterCode: string = '';
  public SubjectCode: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public Marked?: boolean = false;
  public UserID: number = 0;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public StudentName: string = '';
  public InstituteNameEnglish: string = '';
  public SemesterName: string = '';
  public Name: string = '';
  public SubjectName: string = '';
  public IsPresentInternalAssisment: number = 1;
  public ObtainedInternalAssisment: number = 0;
  public MaxInternalAssisment: number = 0;
  public MaxPractical: number = 0;
  public ObtainedPractical: number = 0;
  public IsPresentPractical: number = 1;
  public InternalPracticalID: number = 0;
  public IsChecked: boolean = false;
  public isFinalSubmit: boolean = false;
  public IsPracticalChecked: boolean = false
  public IsInternalAssesmentCheckecd: boolean = false
  public IsDetain: boolean = false
  public UFMDocument: string = '';
  public Dis_UFMDocument: string = '';
  public StudentExamPaperID: number = 0;
  public StudentExamID?: number = 0;
  public IsUFM: boolean = false;
  public rowclass: string = ''
}

export class TheoryMarksSearchModel extends RequestBaseModel {
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public StudentID: number = 0;
  public SubjectID: number = 0;
  public MarkEnter: number = 0;
  public UserID: number = 0;
  public UserAdditionalID: number = 0;

  public RollNo: string = '';
  public InternalPracticalID: number = 0;
  public GroupCodeID: number = 0;
  public InstituteID: number = 0;
  public IsConfirmed: boolean = false;
  public UFMDocument: string = '';
  public Dis_UFMDocument: string = '';
  public ExaminerCode: string = '';
  public SSOID: string = ''
  public SubjectType: string = ''
}


export class ITI_DispatchAdmin_ByExaminer_RptSearchModel {
  public Action: string = '';
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public Status: number = 0;
  public UserID: number = 0;
  public ExaminerID: number = 0;
}

export class ITIStateTradeCertificateSearchModel {
  public RollNo: string = '';
  public EnrollmentNo: string = '';
  public EndTermID: number = 0;
  public ExamYearID: number = 0;
  public StudentID: number = 0;
  public TradeScheme: number = 0;

}

export class ITIAddmissionReportSearchModel {
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public TradeLevelID: number = 0;
  public AcademicYearID: number = 0;
}

export class FinalAdmissionListRequestModel {
 public TradeLevelId: number = 0;
 public AllotmentStatus: number = 0;
 public EndTerms: number = 0;
 public FinancialYearID: number = 0;
}


export class ZoneDistrictSeatUtilizationRequestModel {
  public DistrictID: number = 0;
  public DivisionID: number = 0;
  public AcademicYearID: number = 0;
  public id: number = 0;
}


export class ZoneDistrictSeatUtilizationByGenderRequestModel {
  public DistrictID: number = 0;
  public DivisionID: number = 0;
  public AcademicYearID: number = 0;
  public Id: number = 0;
}

export class VacantSeatRequestModel {
  public AcademicYearID: number = 0;
  public TradeLevelID: number = 0;
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public ITICode: string = '';
  public CollegeId: number = 0;
}

export class ReportingStatusRequestModel {
  AcademicYearID: number = 0;
  TradeLevelID: number = 0;
  DivisionID: number = 0;
  DistrictID: number = 0;
  ITICode: string = '';
  CollegeId: number = 0;
}

export class StudentDataAgeBetween15And29RequestModel {
  AcademicYearID: number = 0;
  TradeLevelID: number = 0;
}

export class AllotmentReportCollegeRequestModel {
 public AcademicYearID: number = 0;
 public TradeLevelID: number = 0;
 public TradeTypeID: number = 0;
 public TradeId: number = 0;
}


export class AllotmentReportCollegeByAdminRequestModel {
  public AcademicYearID: number = 0;
  public TradeLevelID: number = 0;
  public TradeTypeID: number = 0;
  public TradeId: number = 0;
  public CollegeId: number = 0;
}




export class ITIAddmissionWomenReportSearchModel {
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public TradeLevelID: number = 0;
  public AcademicYearID: number = 0;
  public CourseTypeID: number = 0;
  public ITICode: string = '';
  public ITICollegeID: number = 0;
  public TradeCode: string = '';
  public ITITradeID: number = 0;
  public StatusID: number = 0;

}


export class DirectAdmissionReportRequestModel {
  public AcademicYearID: number = 0;
  public TradeLevelID: number = 0;
  public TradeTypeID: number = 0;
  public TradeId: number = 0;
  public CollegeId: number = 0;
}

export class IMCAllotmentReportRequestModel {
  public AcademicYearID: number = 0;
  public TradeLevelID: number = 0;
  public TradeTypeID: number = 0;
  public TradeId: number = 0;
  public CollegeId: number = 0;
  public StatusID: number = 0;
  public ReportingStatus: number = 0;
  public CollegeName: string = '';
}

export class StudentItiSearchmodel {
  public CollegeID: number = 0
  public EnrollmentNo:string=''
  public StudentName:string=''
  public TradeID: string = ''
  public Code:string=''
}
export class InternalSlidingReportRequestModel {
  public AcademicYearID: number = 0;
  public TradeLevelID: number = 0;
  public TradeTypeID: number = 0;
  public TradeId: number = 0;
  public CollegeId: number = 0;
}

export class SwappingReportRequestModel {
  public AcademicYearID: number = 0;
  public TradeLevelID: number = 0;
  public TradeTypeID: number = 0;
  public TradeId: number = 0;
  public CollegeId: number = 0;
}

export class SearchCenterSuperintendentAttendance {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public InstituteID: number = 0;
  public CenterAssignedID: number = 0;
  public ExamDate: string = ''
  public FromDate: string = ''
  public ToDate: string = ''
  public CSName: string = ''
}
export class ExaminerFeedbackDataModel extends RequestBaseModel {
  public ExaminerID?: number = 0
  public ExaminerCode?: string = ''
  public GroupCodeID?: number = 0
  public GroupCode?: string = ''
  public Feedback?: string = ''
  public UserID?: number = 0
}

