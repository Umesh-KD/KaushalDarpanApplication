import { QualificationDetailsDataModel } from "../ITIFormDataModel"
import { VerificationDocumentDetailList } from "../StudentVerificationDataModel"


export class ItiDocumentscrutinymodel {
  public ApplicationID: number = 0
  public ApplicationNo:string=''
  public SSOID: string = ''
  public StudentName: string = ''
  public StudentNameHindi: string = ''
  public FatherName: string = ''
  public FatherNameHindi: string = ''
  public MotherNameHindi: string = ''
  public MotherName: string = ''
  public Email: string = ''
  public DOB: string = ''
  public Gender: string = ''
  public MobileNumber: string = ''
  public WhatsNumber: string = ''
  public LandlineNumber: string = ''
  public IndentyProff: number = 0
  public DetailID: string = ''
  public Maritial: number = 0
  public Religion: number = 0
  public Nationality: number = 0
  public CategoryA: number = 0
  public CategoryB: number = 0
  public CategoryC: number = 0
  public CategoryE: number = 0
  public DepartmentID: number = 0
  public ModifyBy: number = 0
  public status: number = 0
  public Remark: string = ''
  public ParentIncome: number = 0
  public IsMinority: boolean = false
  public IsEWSCategory: number = 0
  public Eligible8thTradesID: number = 0
  public Eligibl10thTradesID: number = 0
  public PWDCategoryID: number = 0
  public Domicile: string = ''

  public JanAadharMemberID: string = ''
  public JanAadharNo: string = ''

  public CreatedBy: number = 0
  public ActiveStatus: boolean = true
  public DeleteStatus: boolean = false

  public IsTSP: boolean = false
  public IsSaharia: boolean = false
  public subCategory: number = 0
  public TspDistrictID: number = 0
  public IsEWS: boolean = false
  public IsDevnarayan: number = 0
  public DevnarayanTehsilID: number = 0
  public DevnarayanDistrictID: number = 0
  public TSPTehsilID: number = 0

  public PH8thTradeList: string = ''
  public PH10thTradeList: string = ''
  public PH12thTradeList: string = ''
  public QualificationDetailsDataModel: QualificationDetailsDataModel[] = []
  public VerificationDocumentDetailList: VerificationDocumentDetailList[] = []

 

}
