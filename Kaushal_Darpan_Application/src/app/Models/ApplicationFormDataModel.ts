
import { RequestBaseModel } from "./RequestBaseModel"

export class QualificationDataModel {
  public ApplicationID: number = 0
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
  public IsSupplement: boolean = false
  public DepartmentID: number = 0
  public ModifyBy: number = 0
  public IsFinalSubmit: number = 0
  public CourseType: number = 0
  public LateralEntryQualificationModel: LateralEntryQualificationModel[] = []
  public HighestQualificationModel: HighestQualificationModel[] = []
  public LateralCourseID:number=0
  public CategoryA: number = 0
  public isCorrectMerit?: boolean = false
}
export class LateralEntryQualificationModel {
  public  ApplicationQualificationId:number=0
  public Qualification: string = ''
  public StateID: number = 0
  public BoardID: number = 0
  public BoardName: string = ''
  public PassingID: string = ''
  public RollNumber: string = ''
  public MarkType: number = 0
  public AggMaxMark: number = 0
  public Percentage: string = ''
  public ClassSubject: string = ''
  public AggObtMark: number = 0
  public BoardStateID: number = 0
  public BoardExamID: number = 0
  public CourseID: number = 0
  public SubjectID: Lateralsubject[]=[]

  public BranchID?: number = 0
  public CoreBranchID?: number = 0
}

export class Lateralsubject {
  LateralID: number = 0
  ID: number = 0
  CourseID: number = 0
  Name:string=''
}

export class BoardDat {
  public class: string = ''
  public rollno: string = ''
  public year: string = ''
  public board: string = ''
  public Class: number = 0
}

export class HighestQualificationModel {
  public UniversityBoard: string = ''
  public SchoolCollegeHigh: string = ''
  public HighestQualificationHigh: string = ''
  public ClassSubject: string = ''
  public YearofPassingHigh: string = ''
  public RollNumberHigh: string = ''
  public MarksTypeIDHigh: number = 0
  public MaxMarksHigh: number = 0
  public PercentageHigh: string = ''
  public MarksObtainedHigh: number = 0
  public ApplicationQualificationId: number = 0
  public StateIDHigh?: number = 0
  public BoardID: number = 0
  public BoardStateID: number = 0
  public BoardExamID: number = 0
}




export class SupplementaryDataModel {
  public SupplementryID: number = 0
  public PassingID: string = ''
  public RollN0: string = ''
  public Subject: string = ''
  public EducationCategory: string = ''
  public MaxMarksSupply: number = 0
  public ObtMarksSupply: number = 0

}

export class ApplicationDatamodel {
  public ApplicationID: number = 0
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
  public CategoryD: number = 0
  public CategoryE: number = 0
  public Prefential: number = 0
  public DepartmentID: number = 0
  public ModifyBy: number = 0
  public IsPH: string = ''
  public IsKM: string = ''
  public CertificateGeneratDate: string = ''

  public JanAadharNo: string = '';
  public JanAadharMemberID: string = '';
  public IsFinalSubmit: number = 0
  public IsMinority: boolean = false
  public CourseType: number = 0
  public IsDevnarayan:number=0
  public TspDistrictID:number=0
  public TSPTehsilID:number=0
  public subCategory:number=0
  public DevnarayanTehsilID:number=0
  public DevnarayanDistrictID: number = 0
  public IsTSP: boolean = false
  public IsSaharia: boolean = false
  public EWS: number = 0
  public IsMBCCertificate:number=0



}

export class DocumentDetailList {
  public TransactionID: number = 0;
  public ColumnName: string = '';
  public TableName: string = '';
  public FileName: string = '';
  public DisFileName: string = '';
  public Folder: string = '';
  public DocumentID: number = 0;
  public ModifyBy: number = 0
}

export class BterDocumentsDataModel {
  public ApplicationID: number = 0
  public StudentPhoto: string = ''
  public SignaturePhoto: string = ''
  public MotherDepCertificate: string = ''
  public PrefCategory: string = ''
  public AadharPhoto: string = ''
  public Marksheet: string = ''
  public Dis_StudentPhoto: string = ''
  public Dis_SignaturePhoto: string = ''
  public Dis_MotherDepCertificate: string = ''
  public Dis_PrefCategory: string = ''
  public Dis_AadharPhoto: string = ''
  public Dis_Marksheet: string = ''
  public ModifyBy: number = 0
  public DepartmentID: number = 0
  public IsFinalSubmit: number = 0
  public FolderName: string = ''
  public Minority: string = ''
  public Dis_Minority:string=''
}
export class BterAddressDataModel {
  public ApplicationID: number = 0
  public AddressLine1: string = ''
  public AddressLine2: string = ''
  public AddressLine3: string = ''
  public StateID: number = 0
  public DistrictID: number = 0
  public TehsilID: number = 0
  public CityVillage: string = ''
  public Pincode: string = ''
  public CorsAddressLine1: string = ''
  public CorsAddressLine2: string = ''
  public CorsAddressLine3: string = ''
  public CorsStateID: number = 0
  public CorsDistrictID: number = 0
  public CorsTehsilID: number = 0
  public CorsCityVillage: string = ''
  public CorsPincode: string = ''
  public ModifyBy: number = 0
  public DepartmentID: number = 0
  public IsFinalSubmit: number = 0
  public NonRajasthanBlockName: string = ''
  public CorsNonRajasthanBlockName: string = ''

}

export class BterOptionsDetailsDataModel {
  public optionID: number = 0
  public ApplicationID: number = 0
  public College_TypeID: number = 0
  public College_TypeName: string = ''
  public DistrictID: number = 0
  public DistrictName: string = ''
  public InstituteID: number = 0
  public InstituteName: string = ''
  public BranchID: number = 0
  public BranchName: string = ''
  public ModifyBy: number = 0
  public DepartmentID: number = 0
  public Priority: number = 0
  public IsFinalSubmit: number = 0
  public CourseType: number = 0
  public AcademicYear:number=0
  public Type?: string = ''
}

export class BterOtherDetailsModel {
  public ApplicationID: number = 0
  public ParentsIncome: number = 0
  public ApplyScheme: number = 0
  public EWS: number = 0
  public Residence: number = 0

  public IncomeSource: string = ''
  public ModifyBy: number = 0
  public DepartmentID: number = 0
  public IsFinalSubmit: number = 0
  public CategoryA:number=0
  public IsSportsQuota: boolean = false

}

export class BterSearchmodel extends RequestBaseModel {
  public SSOID: string = ''
  public JanAadharMemberID: string = ''
  public JanAadharNo: string = ''
  public ApplicationID: number = 0
  public AcademicYear: number = 0
  public EnrollmentNo: string = ''
  //public Verfireid: number= 0
}

export class BterCollegesSearchModel {
  public DistrictID: number = 0
  public action: string = ''
  public College_TypeID: number = 0
  public ApplicationID: number = 0
  public EndTermId: number = 0
  public InstituteID: number = 0
  public StreamType: number = 0
}


export class DTEDashApplicationSearchModel {
  public DepartmentID: number = 0;
  public ApplicationID?: number = 0;
  public StudentName: string = '';
  public MobileNumber: string = '';
  public Gender: number = 0;
  public InstituteID: number = 0;
  public DistrictID: number = 0;
  public CategoryA: number = 0;
  public CategoryB: number = 0;
  public CategoryC: number = 0;
  public CategoryD: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public FinancialYearID: number = 0;

  public UrlStatus: string = '';
  public PageSize: number = 50
  public PageNumber: number = 1

  public SortOrder: string = '';
  public SortColumn: string = '';

  public TradeLevelId: number = 50
  public ManagementTypeId: number = 1

  public ITICode: string = '';
  public TradeCode: string = '';
}

export class EnglishQualificationDataModel {
  public MarksTypeIDEnglish: number = 0;
  public MaxMarksEnglish: number = 0;
  public MarksObtainedEnglish: number = 0;
  public UniversityBoardEnglish: string = ''
  public SchoolCollegeEnglish: string = ''
  public YearofPassingEnglish: string = ''
  public RollNumberEnglish: string = ''
  public PercentageEnglish: string = ''
  public BoardStateIDEnglish: number = 0;
  public StateOfStudyEnglish: number | undefined = 0;
  public ApplicationQualificationId: number = 0;
}

export class DirectAdmissionUpdatePayment extends RequestBaseModel {
  public ApplicationId: number = 0
}