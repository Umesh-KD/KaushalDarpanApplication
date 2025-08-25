import { DocumentDetailList, HighestQualificationModel, LateralEntryQualificationModel, SupplementaryDataModel } from "./ApplicationFormDataModel"
import { DocumentDetailsModel } from "./DocumentDetailsModel"
import { RequestBaseModel } from "./RequestBaseModel"
import { VerificationDocumentDetailList } from "./StudentVerificationDataModel"
export class DocumentScrutinyDataModel {
  public ApplicationID: number = 0
  public VerifierID: number = 0
  public ENR_ID: number = 0;
  public PrefentialCategoryType: number = 0;
  public SSOID: string = ''
  public StudentName: string = ''
  public FatherName: string = ''
  public MotherName: string = ''
  public Email: string = ''
  public DOB: string = ''
  public Gender: number = 0
  public MobileNumber: string = ''
  public CasteCertificateNo: string = ''
  public Apaarid: string = ''
  public CertificateGeneratDate: string = ''
  public CategoryA: number = 0
  public DepartmentID: number = 0
  public ModifyBy: number = 0
  public coursetype: number = 0
  public JanAadharNo: string = '';
  public JanAadharMemberID: string = '';
  public IsRajasthani: boolean = false
  public DirectAdmission: number = 0
  public IsEws: number = 0
  public RoleID: number = 0

  public TradeLevel: number = 0
  public TradeID: number = 0
  public InstituteID: number = 0
  public DirectAdmissionTypeID: number = 0
  public TspDistrictID: number = 0

  public BranchID: number = 0
  public AadharNo: string = ''
  public DepartmentName: string = ''



  public StudentNameHindi: string = ''

  public FatherNameHindi: string = ''
  public MotherNameHindi: string = ''


  public WhatsNumber: string = ''
  public LandlineNumber: string = ''
  public IndentyProff: number = 0
  public DetailID: string = ''
  public Maritial: number = 0
  public Religion: number = 0
  public Nationality: number = 0
  public CategoryAbyChecker?: number = 0
  public CategoryB: number = 0
  public CategoryC: number = 0
  public CategoryE: number = 0
  public Prefential: number = 0

  public IsPH: string = ''
  public IsKM: string = ''

  public IsFinalSubmit: number = 0
  public IsMinority: boolean = false
  public CourseType: number = 0
  public IsDevnarayan: number = 0

  public TSPTehsilID: number = 0
  public subCategory: number = 0
  public DevnarayanTehsilID: number = 0
  public DevnarayanDistrictID: number = 0
  public IsTSP: boolean = false
  public IsSaharia: boolean = false
  public EWS: number = 0
  public CategoryD: number = 0
  public IsMBCCertificate: number = 0
  public Status: number = 0
  public QualificationID: number = 0
  public StateID: number = 0
  public BoardID: number = 0
  public BoardStateID: number = 0
  public BoardExamID: number = 0
  public PassingID: string = ''
  public RollNumber: string = ''
  public MarkType: number = 0
  public AggMaxMark: number = 0
  public Percentage: string = ''
  public AggObtMark: number = 0
  public SupplementaryDataModel: SupplementaryDataModel[] = []
  public status:number=0
  public Remark:string=''
  public VerificationDocumentDetailList: VerificationDocumentDetailList[] = []
  public DocumentPushModel: DocumentPushModel[] = []

  public LateralEntryQualificationModel: LateralEntryQualificationModel[] = []
  public IsSupplement: boolean = false

  public ApplicationNo:string=''
  public Folder: string = ''

  public ActionRemarks:string=''

  public LateralCourseID: number = 0
  public HighestQualificationModel: HighestQualificationModel[] = []
  public RemarkModel: RemarkModel[] = []
  public CommonRemark: string = ''
}





export class RemarkModel {
  public  DocumentMasterID:number=0
  public DisFileName:string=''
}

export class RejectModel {
  public ApplicationID: number = 0
  public Action: number = 0
  public Remark: string = ''
  public ModifyBy: number = 0
  public DepartmentID: number = 0
  public MeritId? : number = 0
}

export class DocumentCategoryDataModel {
  public Dis_CategoryAName: string = '';
  public CategoryAProfilePhoto: string = ''
  public Dis_CategoryBName: string = '';
  public CategoryBProfilePhoto: string = ''
  public Dis_CategoryCName: string = '';
  public CategoryCProfilePhoto: string = ''
  public Dis_PrefentialName: string = '';
  public PrefentialProfilePhoto: string = ''
  public Dis_MotherCertificateName: string = ''
  public MotherCertificateProfilePhoto: string = ''

}

export class DocumentPushModel {
  public DocumentDetailsID: number = 0
  public DocumentMasterID: number = 0
  public TransactionID: number = 0;

  public Status: number = 0;
  public Remark: string = '';
  public FileName: string = '';
  public DisFileName: string = '';


  public ModifyBy: number = 0;

}



export class DTEDocumentModel {
  public Tenth2Year_ITI: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public TenthPercentage: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public TenthSupplementary: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public TenthCV: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public TwelvthSupplementary: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public AadharPhoto: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public AffidavitCertificate: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public ApplicantName: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryA: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryA_EWS: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryA_MBC: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryA_OBC: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryA_SC: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryA_ST: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryB: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryB_11: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryB_12: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryB_13: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryB_14: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryB_15: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryB_16: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryB_17: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryB_18: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryB_19: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryC: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryC_KM: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryC_PH: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public CategoryD: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public DevnarayanCertificate: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public Diploma_Engineering: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public DOB: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public DVoc: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public Gender: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public Graduation: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public IncomeCertificate: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public Marksheet: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public Marksheet12: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public Minority: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public MotherDepCertificate: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public MotherDependent: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public PostGraduation: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public PrefCategory_1: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public PrefCategory_5: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public PrefCategory_6: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public PrefCategory_7: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public Senior_Secondary: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public StudentPhoto: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public StudentSign: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public TFWSCertificate: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public TSPAreaCertificatePhoto: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public NativeCertificate: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public HigherMarksheet: VerificationDocumentDetailList = new VerificationDocumentDetailList();

  public OtherDocument: VerificationDocumentDetailList = new VerificationDocumentDetailList();
  public SportsQuotaCertificate: VerificationDocumentDetailList = new VerificationDocumentDetailList();
}

export class CorrectMerit_ApplicationSearchModel {
  public ApplicationID: number = 0;
  public MeritID: number = 0;
}

export class CorrectMeritApproveDataModel extends RequestBaseModel
{
  public ApplicationID?: number = 0;
  public MeritId?: number = 0;
  public AcademicYearID?: number = 0;
  public status?: number = 0;
  public ModifyBy?: number = 0;
  public ApplicationNo?: string = '';
  public Remark?: string = '';
  public IPAddress?: string = '';
}
