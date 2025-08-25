import { RequestBaseModel } from "./RequestBaseModel"

export class AddressDetailsDataModel {
  public ApplicationID: number = 0
  public AddressLine1: string = ''
  public AddressLine2: string = ''
  public AddressLine3: string = ''
  public StateID: number = 0
  public DistrictID: number = 0
  public TehsilID: number = 0
  public CityVillage: string = ''
  public Pincode: string = ''

  public ModifyBy: number = 0
  public DepartmentID: number = 0
  public SSOID: string = ''
  public NonRajasthanBlockName: string = ''

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

export class DocumentDetailsDataModel {
  public ApplicationID: number = 0

  public StudentPhoto: string = ''
  public Dis_StudentPhoto: string = ''

  public SignaturePhoto: string = ''
  public Dis_SignaturePhoto: string = ''

  public Marksheet8thPhoto: string = ''
  public Dis_Marksheet8thPhoto: string = ''

  public Marksheet10thPhoto: string = ''
  public Dis_Marksheet10thPhoto: string = ''

  public Marksheet12thPhoto: string = ''
  public Dis_Marksheet12thPhoto: string = ''

  public AadharPhoto: string = ''
  public Dis_AadharPhoto: string = ''

  public AffidavitPhoto: string = ''
  public Dis_AffidavitPhoto: string = ''

  public WKA_CertificatePhoto: string = ''
  public Dis_WKA_CertificatePhoto: string = ''

  public PH_CertificatePhoto: string = ''
  public Dis_PH_CertificatePhoto: string = ''

  public KM_CertificatePhoto: string = ''
  public Dis_KM_CertificatePhoto: string = ''

  public Dis_Minority: string = ''
  public Minority: string = ''
  public ModifyBy: number = 0
  public DepartmentID: number = 0
  public SSOID: string = ''
  public ActiveStatus: boolean = true
  public DeleteStatus: boolean = false
  public CreatedBy: number = 0
  public IsFinalSubmit: number = 0
  public FolderName: string = ''
}

export class OptionsDetailsDataModel {
  public OptionID: number = 0
  public ApplicationID: number = 0
  public ManagementTypeID: number = 0
  public ManagementTypeName: string = ''
  public DistrictID: number = 0
  public DistrictName: string = ''
  public InstituteID: number = 0
  public InstituteName: string = ''
  public TradeID: number = 0
  public TradeName: string = ''
  public Priority: number = 0
  public TradeLevel: number = 0
  public TradeTypeId: number = 0
  public Type?: string = ''

  public ModifyBy: number = 0
  public DepartmentID: number = 2
  public SSOID: string = ''
  public AcademicYear: number = 0


  public MinPercentageInScience: string = ''
  public MinPercentageInMath: string = ''
  
}

export class QualificationDetailsDataModel {
  public ApplicationID: number = 0
  public SSOID: string = ''
  public DepartmentID: number = 0

  public StateID: number = 0
  public BoardUniversity: string = ''
  public SchoolCollege: string = ''
  public Qualification: string = ''
  public YearofPassing: number = 0
  public RollNumber: string = ''
  public MarksTypeID: number = 0
  public MaxMarks: number = 0
  public MarksObtained: number = 0
  public Percentage: number = 0
  public MathsMaxMarks: number = 0
  public MathsMarksObtained: number = 0
  public ScienceMaxMarks: number = 0
  public ScienceMarksObtained: number = 0
  public UniversityBoard: string = ''

  public ModifyBy: number = 0
  public CreatedBy: number = 0
  public ActiveStatus: number = 1
  public DeleteStatus: number = 0
}

export class HighestQualificationDetailsDataModel {
  public StateIDHigh: number = 0
  public BoardUniversityHigh: string = ''
  public SchoolCollegeHigh: string = ''
  public HighestQualificationHigh: string = ''
  public YearofPassingHigh: string = ''
  public RollNumberHigh: string = ''
  public MarksTypeIDHigh: number = 0
  public MaxMarksHigh: number = 0
  public MarksObtainedHigh: number = 0
  public ApplicationQualificationId: number = 0
  public PercentageHigh: string = ''
}

export class Qualification8thDetailsDataModel {
  public SelectedQualification8: number = 8
  public StateID8: number = 0
  public SchoolCollege8: string = ''
  public YearofPassing8: string = ''
  public RollNumber8: string = ''
  public MarksTypeID8: number = 0
  public MaxMarks8: number = 0
  public MarksObtained8: number = 0
  public Percentage8: string = ''
}


export class Qualification10thDetailsDataModel {
  public SelectedQualification10: number = 10
  // public Qualification10: string = ''
  public StateID10: number = 0
  public BoardUniversity10: string = ''
  public YearofPassing10: string = ''
  public RollNumber10: string = ''
  public MarksTypeID10: number = 0
  public MaxMarks10: number = 0
  public MarksObtained10: number = 0
  public MathsMaxMarks10: number = 0
  public MathsMarksObtained10: number = 0
  public ScienceMaxMarks10: number = 0
  public ScienceMarksObtained10: number = 0
  public Percentage10: string = ''
}

export class Qualification12thDetailsDataModel {
  public SelectedQualification12: number = 12
  public StateID12: number = 0
  public SchoolCollege12: string = ''
  public YearofPassing12: string = ''
  public RollNumber12: string = ''
  public MarksTypeID12: number = 0
  public MaxMarks12: number = 0
  public MarksObtained12: number = 0
  public Percentage12: string = ''
}

export class PersonalDetailsDatamodel {
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
  public CategoryE: number = 0
  public DepartmentID: number = 0
  public ModifyBy: number = 0

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
  public Apaarid: string = ''
}

export class PHTradeList {
  public Id: number = 0
}

export class PreviewDataModel {
  public StudentPhoto: string = '';
  public Dis_StudentPhoto: string = '';
  public StudentSignature: string = '';
  public Dis_StudentSignature: string = '';
  public Name: string = '';

}

export class ITI_DirectAdmissionApplyDataModel extends RequestBaseModel {
  public ApplicationID: number = 0
  public UserID: number = 0
}
