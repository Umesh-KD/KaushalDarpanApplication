export class ExaminerStaticReportFeedbackDataModel {
    public ExaminerStaticRptFeedbackID?: number = 0;
    public ExaminerID?: number = 0;
    public ExaminerCode?: string = '';
    public GroupCodeID?: number = 0;
    public SubjectID?: number = 0;
    public CommonRemarkForQueAns?: string = '';
    public IsMassCoping?: boolean = false;
    public Syllabus?: number = 0;
    public InstituteLevel?: number = 0;
    public TeachingByTeacher?: number = 0;
    public StudyOfStudent?: number = 0;
    public SuggestionForImprovement?: string = '';
    public Date?: string = '';
    public SignPhoto?: string = '';
    public Dis_SignPhoto?: string = '';
    public ExamName?: string = '';
    public ExaminerName?: string = '';
    public GroupCode?: string = '';
    public SubjectCode?: string = '';
    public InstituteName?: string = '';
    public ExaminerSignNo?: string = '';
    public UserID?: number = 0;
    public CourseType?: number = 0;
    public DepartmentID?: number = 0;
    public CenterID?: number = 0;
    public MassCopyDocument?: string = '';
    public Dis_MassCopyDocument?: string = '';
}

export class ExaminerStaticReportSearchModel {
    public CenterCode?: string = '';
    public GroupCode?: string = '';
    public SubjectCode?: string = '';
    public InstituteID?: number = 0;
    public SemesterID?: number = 0;
    public EndTermID?: number = 0;
    public DepartmentID?: number = 0;
    public Eng_NonEng?: number = 0;
    public RoleID?: number = 0;
    public SSOID?: string = '';
    public Action?: string = '';
}