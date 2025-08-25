export class StudentJanAadharDetailModel {
  public ENR_ID: number = 0;
  public DOMICILE?: number = 0;
  public AADHAR_ID: number = 0;
  public Name: string = '';
  public MOBILE_NO: string = '';
  public SRDR_MID: string = '';
  public JAN_MEMBER_ID: string = '';
  public JAN_AADHAR: string = '';
  public NAME_HINDI: string = '';
  public SRDR_ID: string = '';
  public MaskedMid: string = '';
  public AADHAR_REF_NO: string = '';
}

export class IStudentJanAadharDetailModel {
  public IsMainRole: number = 0;
  public ENR_ID: number = 0;
  public AADHAR_ID: number = 0;
  public Name: string = '';
  public MOBILE_NO: string = '';
  public SRDR_MID: string = '';
  public JAN_MEMBER_ID: string = '';
  public JAN_AADHAR: string = '';
  public NAME_HINDI: string = '';
  public SRDR_ID: string = '';
  public MaskedMid: string = '';
  public AADHAR_REF_NO: string = '';
  public OTP: string = '';
  public address?: JanAadharMemberAddressDetails = new JanAadharMemberAddressDetails();
}
export class JanAadharMemberDetails
{
  public isRajasthanResident?: boolean = false;
  public janmemid?: string = '';
  public enrid?: string = '';
  public janaadhaarId?: string = ''
  public aadhar?: string = '';
  public nameEng?: string = '';
  public nameHnd?: string = '';
  public fnameEng?: string = '';
  public email?: string = '';
  public caste?: string = '';
  public category?: string = '';
  public dob?: string = '';
  public gender?: string = '';
  public mobile?: string = '';
  public acc?: string = '';
  public bankName?: string = '';
  public ifsc?: string = '';
  public age?: string = '';
  public bankBranch?: string = '';
  public fnameHnd?: string = '';
  public snameEng?: string = '';
  public snameHnd?: string = '';
  public maritalStatus?: string = '';
  public relationTyp?: string = '';
  public mnameEng?: string = '';
  public mnameHnd?: string = '';
  public voterId?: string = '';
  public micr?: string = '';
  public income?: string = '';
  public occupation?: string = '';
  public qualification?: string = '';
  public panNo?: string = '';
  public passport?: string = '';
  public dlNo?: string = '';
  public eid?: string = '';
  public passportphotoBase64?: string = '';
  public address?: JanAadharMemberAddressDetails = new JanAadharMemberAddressDetails();
  public ssoid?: string = '';
}

export class JanAadharMemberAddressDetails {
  public addressEng: string='';
  public districtName: string='';
  public block_city: string='';
  public gp: string='';
  public village: string='';
  public pin: string='';
  public age: string='';
  public addressHnd: string='';
}

export class ApplicationStudentDatamodel {
  public ApplicationID: number = 0
  public ENR_ID: number = 0;
  public PrefentialCategoryType: number = 0;
  public SSOID: string | undefined = ''
  public StudentName: string | undefined = ''
  public FatherName: string | undefined = ''
  public MotherName: string | undefined = ''
  public Email: string | undefined = ''
  public DOB: string | undefined = ''
  public Gender: string | undefined = '0'
  public MobileNumber: string | undefined = ''
  public CasteCertificateNo: string | undefined = ''
  public Apaarid: string | undefined = ''
  public CertificateGeneratDate: string | undefined = ''
  public CategoryA: number = 0
  public DepartmentID: number = 0
  public ModifyBy: number = 0
  public coursetype:number=0
  public JanAadharNo: string | undefined = '';
  public JanAadharMemberID: string | undefined = '';
  public IsRajasthani: boolean = false
  public DirectAdmission: number = 0
  public IsEws: number =0
  public RoleID: number = 0

  public TradeLevel: number = 0
  public TradeID: number = 0
  public InstituteID: number = 0
  public DirectAdmissionTypeID: number = 0
  public TspDistrictID: number = 0

  public BranchID: number = 0
  public AadharNo:string | undefined=''
  public DepartmentName: string | undefined = ''

  public isCorrectMerit?: boolean = false;

  public StudentNameHindi: string | undefined = ''

  public FatherNameHindi: string | undefined = ''
  public MotherNameHindi: string | undefined = ''


  public WhatsNumber: string | undefined = ''
  public LandlineNumber: string | undefined = ''
  public IndentyProff: number = 0
  public DetailID: string | undefined = ''
  public Maritial: number = 0
  public Religion: number = 0
  public Nationality: number = 0

  public CategoryB: number = 0
  public CategoryC: number = 0
  public CategoryE: number = 0
  public Prefential: number = 0

  public IsPH: string | undefined = ''
  public IsKM: string | undefined = ''

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

  public adds_addressEng: string | undefined = ''
  public adds_districtName: string | undefined = ''
  public adds_block_city: string | undefined = ''
  public adds_gp: string | undefined = ''
  public adds_village: string | undefined = ''
  public adds_pin: string | undefined = ''
  public adds_addressHnd: string | undefined | undefined = ''



}

export class SearchApplicationStudentDatamodel {
  public ApplicationID: number = 0
  public SSOID: string = ''
  public StudentName: string = ''
  public FatherName: string = ''
  public MotherName: string = ''
  public Email: string = ''
  public DOB: string = ''
  public Gender: string = ''
  public MobileNumber: string = ''
  public DepartmentID: number = 0
  public ModifyBy: number = 0
  public RoleID: number = 0
  public JanAadharMemberId: string| undefined = ''
  public Action:string=''
  public CourseTypeID: number = 0
}
