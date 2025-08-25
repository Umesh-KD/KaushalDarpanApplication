import { EnumVerificationAction } from "../Common/GlobalConstants";
import { EmitraFeeTransactionHistoryModule } from "../Views/Emitra/emitra-fee-transaction-history/emitra-fee-transaction-history.module";
import { DocumentDetailList } from "./ApplicationFormDataModel";
import { DocumentDetailsModel } from "./DocumentDetailsModel";

export class PreviewApplicationModel {
  public ApplicationID: number = 0;
  public ApplicationNo:string =''
  public StudentName: string = '';
  public StudentNameHindi: string = '';
  public FatherName: string = '';
  public FatherNameHindi: string = '';
  public MotherName: string = '';
  public MotherNameHindi: string = '';
  public AadharNo: string = '';
  public Gender: string = '';
  public ParentIncome: string = '';
  public ApplyScheme: string = '';
  public IsEWS: number = 0;
  public Residence: string = '';
  public ParentIncomeAMT: number = 0;
  public MaritalStatusName: string = '';
  public Religion: string = '';
  public DOB: string = '';
  public Email: string = '';
  public CategoryA: string = '';
  public CategoryB: string = '';
  public CategoryC: string = '';
  public PrefCategory: string = '';
  public MobileNo: string = '';
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public AddressLine3: string = '';
  public CorsAddressLine1: string = '';
  public CorsAddressLine2: string = '';
  public CorsAddressLine3: string = '';
  public StateName: string = '';
  public DistrictName: string = '';
  public BlockName: string = '';
  public Pincode: string = '';
  public CorsPincode: string = '';
  public CityVillage: string = '';
  public CorsCityVillage: string = '';
  public Age: string = ''
  public StudentPhoto: string = ''
  public SignaturePhoto: string = ''
  public MotherDepCertificate: string = ''
  public PrefCategoryPhoto: string = ''
  public AadharPhoto: string = ''
  public status: number = 0;
  public IsfinalSubmit: number = 0;
  public ApplicationFees: number = 0;
  public ServiceID: number = 0;
  public FormCommision: number = 0;
  public CourseTypeID: number = 0;
  public DepartmentID: number = 0;
  public UniqueServiceID: number = 0;
  public QualificationViewDetails: QualificationViewDetails[] = [];
  public SupplementaryDetailList: SupplementaryviewDetails[] = [];
  public OptionalViewDatas: OptionalViewData[] = [];
  public PendingDataModel: PendingDataModel[] = [];
  public DocumentDetailList: DocumentDetailsModel[] = [];

  public CategoryAId: number = 0;
  public PrefentialCategoryType: string = '';
  public PrefentialCategoryTypeId: number = 0;
  public PrefentialCategory: string = '';
  public PrefentialCategoryId: number = 0;
  public MaritialStatsu: number = 0;
  public GenderId: number = 0;
  public STSubCategory: string = '';
  public STSubCategoryId: number = 0;
  public IdentityProofType: string = '';
  public IndentyProff: string = '';
  public Nationality: string = '';
  public Category_E: string = '';
  public CasteCertificateNo: string = '';
  public CertificateGeneratDate: string = '';

  public IsFinalPay: boolean = false
  public IsSportsQuota: boolean = false

  public TransactionID: number = 0;
  public PRN: string = '';
  public TransctionStatus: string = '';
  public IsPH: string = ''
  public IsKM: string = ''
  public Action:number=0
  public IsHighestQualification: number = 0;
  public QualificationPriority: number = 0;
  public ActionName:string=''
  public Subjects:string=''
  public Branches: string = ''
  public ActionRemarks:string=''
  public CategoryAbyChecker?: string = ''
  public categoryD_ID?: string = ''
  public DirectAdmission? : number = 0
}


export class SupplementaryviewDetails {
  public SupplementaryID: number = 0;
  public Qualification: string = '';
  public StateNames: string = '';
  public BoardNames: string = '';
  public PassingYear: string = '';
  public RollNumber: string = '';
  public SubjectName: string = '';
  public MaxMarksSupply: number = 0
  public ObtMarksSupply: number = 0
}

export class QualificationViewDetails {
  public ApplicationID: number = 0;
  public QualificationID: string = '';
  public StateName: string = '';
  public BoardTypeName: string = '';
  public PassingYear: string = '';
  public RollNumber: string = '';
  public AggMaxMarks: string = '';
  public AggObtMarks: string = '';
  public Percentage: number = 0;
  public IsSupplement: boolean = false;
  public Marktype: string = ''
  public Marksheet: string = ''

  public BoardName: string = ''
  public BoardStateName: string = ''
  public BoardExamName: string = ''
  public UniversityBoard: string = ''
  public ClassSubject: string = ''
  public SchoolCollegeName: string = ''

}

export class SupplementaryViewDetails {
  public SupplementaryID: number = 0;
  public PassingYear: string = '';
  public RollNumber: string = '';
  public SubjectName: string = '';
  public MaxMarksSupply: number = 0
  public ObtMarksSupply: number = 0
}

export class OptionalViewData {
  public College_TypeName: string = '';
  public DistrictName: string = '';
  public InstituteName: string = '';
  public BranchID: number = 0;
  public BranchName: string = '';
}

export class PendingDataModel {
  public Pending: string = ''
  public Index:number=0
}
