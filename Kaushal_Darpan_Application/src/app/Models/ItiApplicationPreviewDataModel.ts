import { DocumentDetailsModel } from "./DocumentDetailsModel";
import { DocumentDetailList } from "./ITIFormDataModel";
import { RequestBaseModel } from "./RequestBaseModel";

export class PreviewApplicationModel
{
  public ApplicationID: number = 0;
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
  public IsEWS: boolean = false;
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
  public StateName: string = '';
  public DistrictName: string = '';
  public BlockName: string = '';
  public Pincode: string = '';
  public CorsPincode: string = '';
  public CityVillage: string = '';
  public Age: string = ''
  public StudentPhoto: string = ''
  public SignaturePhoto: string = ''
  public IsMinority: boolean = false
  public status: number = 0;
  public ApplicationFees: number = 0;
  public ServiceID: number = 0;
  public IsfinalSubmit: number = 0;


  public QualificationViewDetails: QualificationViewDetails[] = [];
  public OptionalViewDatas: OptionalViewData[] = [];
  public PendingDataModel: PendingDataModel[] = [];
  public DocumentDetailList: DocumentDetailsModel[] = [];
  public IsFinalPay: boolean = false

  public TransactionID: number = 0;
  public PRN: string = '';
  public TransctionStatus: string = '';
  public UniqueServiceID: number = 0;
  public Apaarid: string = '';
  public ProcessingFee: number = 0;
  public FormCommision: number = 0;
  public ApplicationNo: string = '';

}

export class QualificationViewDetails {
  public ApplicationID: number = 0;
  public QualificationID: number = 0;
  public QualificationName: string = '';
  public StateName: string = '';
  public BoardName: string = '';
  public SchoolCollegeName: string = '';
  public PassingYear: string = '';
  public RollNumber: string = '';
  public AggMaxMarks: string = '';
  public AggObtMarks: string = '';
  public Percentage: number = 0;
  public IsSupplement: boolean = false;
  public Marktype: string = ''
  public MarktypeName: string = ''
  public MathsMaxMarks: number = 0
  public MathsObtMarks: number = 0
  public ScienceMaxMarks: number = 0
  public ScienceObtMarks: number = 0
}

export class SupplementaryViewDetails {
  public SupplementaryID: number = 0;
  public PassingYear: string = '';
  public RollNumber: string = '';
  public SubjectName: string = '';
}

export class OptionalViewData {
  public College_TypeName: string = '';
  public DistrictName: string = '';
  public InstituteName: string = '';
  public BranchID: number = 0;
  public BranchName: string = '';
  public TradeLevel: number = 0;
}

export class ItiApplicationSearchmodel {
  public SSOID: string = ''
  public DepartmentID: number = 0.
  public JanAadharMemberID: string = ''
  public JanAadharNo: string = ''
  public ApplicationID: number = 0
  public StudentName?: string
  public Eng_NonEng: number = 0
  public RoleID: number = 0
  public ApplicationId: number = 0
  public EnrollmentNo: string = ''
  public EndTermID: number=0
  public AcademicYear:number=0
  public PaymentReciept: string = ''
}

export class PendingDataModel {
  public Pending: string = ''
  public Index: number = 0
}

export class ItiApplicationUnlockDataModel extends RequestBaseModel{
  public SSOID?: string = ''
  public JanAadharMemberID?: string = ''
  public JanAadharNo?: string = ''
  public ApplicationID?: number = 0
  public StudentName?: string
  public ApplicationId?: number = 0
  public EnrollmentNo?: string = ''
  public UserID?: number = 0
}
