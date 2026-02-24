export class ITI_InstructorDataModel {
  // Personal Details
  public InstituteID?: number=0;
  public ID?:  number = 0;
  public Uid?:  string = '';
  public JanAadharMemberID?:  string = '';
  public Name?:  string = '';
  public FatherOrHusbandName?:  string = '';
  public MotherName?:  string = '';
  public Dob?:  string = '';
  public Gender:  string = '0';
  public MaritalStatus?:  string = '';
  public Category?: string = '';
  public Mobile?:  string = '';
  public Email?: string = '';


  //Bank Details
  public BankAccountNumber: string = '';
  public IFSCCode: string = '';
  public BankName: string = '';

  public ConsentToAssignAsExaminer: boolean = false;

  // Permanent Address
  public PlotHouseBuildingNo?:  string = '';
  public StreetRoadLane?:  string = '';
  public AreaLocalitySector?:  string = '';
  public LandMark?:  string = '';
  public ddlState?:  string = '';
  public ddlDistrict?:  string = '';
  public PropTehsilID?:  string = '';
  public PropUrbanRural?:  number = 0;
  public City?:  string = '';
  public villageID?:  string = '';
  public pincode?:  string = '';

  // Correspondence Address
  public Correspondence_PlotHouseBuildingNo?:  string = '';
  public Correspondence_StreetRoadLane?:  string = '';
  public Correspondence_AreaLocalitySector?:  string = '';
  public Correspondence_LandMark?:  string = '';
  public Correspondence_ddlState?:  string = '';
  public Correspondence_ddlDistrict?:  string = '';
  public Correspondence_PropTehsilID?:  string = '';
  public Correspondence_PropUrbanRural?:  number = 0;
  public Correspondence_City?:  string = '';
  public Correspondence_villageID?:  string = '';
  public Correspondence_pincode?:  string = '';

  // Educational Qualification
  public Education_Exam?:  string = '';
  public Education_Board?:  string = '';
  public Education_Year?:  string = '';
  public Education_Subjects?:  string = '';
  public Education_Percentage?: number;
  public QualificationDocument?: string = '';

  // Technical Qualification
  public Tech_Exam?: string;
  public Tech_Board?: string;
  public Tech_Subjects?: string;
  public Tech_Year?: string;
  public Tech_Percentage?: number;
  public TechQualificationDocument?: string = '';

  // Employment Details
  public Pan_No?:  string = '';
  public Employee_Type?:  string = '';
  public Employer_Name?:  string = '';
  public Employer_Address?:  string = '';
  public Tan_No?:  string = '';
  public Employment_From?:  string = '';
  public Employment_To?:  string = '';
  public Basic_Pay?: number ;
  public IsDomicile?: boolean = false;
  public Aadhar?: string = '';
  public JanAadhar?: string = '';
  // Additional Fields
  public CreatedBy?: string = '';
  public DepartmentID?: string = '';
  public EmploymentDocument?: string = '';
  public TehsilName?: string = '';
  public AadharDocument?: string = '';
  public PermanentDocument?: string = '';
  public  StatusID:number=0
  // Parent should hold child tables
  public EducationalQualifications?: ITI_InstructorEducationalQualification[] = [];
  public TechnicalQualifications?: ITI_InstructorTechnicalQualification[] = [];
  public EmploymentDetails?: ITI_InstructorEmploymentDetails[] = [];
}

export class ITI_InstructorEducationalQualification {
  public Education_Exam?: string = '';
  public Education_Board?: string = '';
  public Education_Year?: string = '';
  public Education_Subjects?: string = '';
  public Education_Percentage?: number | null = null;
  public EducationDocument?: string = '';
  public MarksTypeID?: string = '';
  public Education_CGPA?: number | null = null;
  public EduQualificationName?: string = '';
  public EduQualificationID?: number = 0;
  public EduQualificationLevel?: string = '';
  public EduOtherExaminationPassed?: string = '';
  public MarkTypeName?: string= '';
  //public CITSCertified?: string= '';
  //public CITSCertifiedDocument?: string= '';
}


export class ITI_InstructorEmploymentDetails {
  public Pan_No?: string = '';
  public Employee_Type?: string = '';
  public Employer_Name?: string = '';
  public Name?: string = '';
  public Employer_Address?: string = '';
  public Tan_No?: string = '';
  public Employment_From?: string = '';
  public Employment_To?: string = '';
  public Basic_Pay?: number ;
  public EmploymentDocument?: string = '';
  public BasicSalaryDocument?: string = '';
  public panDocument?: string = '';
  public PostHeld?: string = '';
  public EmployeeCode?: string = '';
  public Employer_Registration?: string = '';
  public Employer_presentlyWorking = 'false';


}

export class ITI_InstructorTechnicalQualification {
  public Tech_Exam?: string;
  public Tech_Board?: string;
  public Tech_Subjects?: string;
  public StreamName?: string;
  public StreamID?: string;
  public techRequest?: number = 0;
  public Tech_Year?: string;
  public Tech_Percentage?: number;
  public Tech_CGPA?: number;
  public TechDocument?: string = '';
  public MarksType?: string = '';
  public MarkTypeName?: string = '';
  public CITSCertified?: string = '';
  public Tech_CITSCertifiedDocument?: string = '';
  public QualificationLevel?: string = '';
  public QualificationName?: string = '';
  public QualificationID?: number = 0;
  public Tech_MarksTypeID?: string = '';
  public Tech_CITSTrade?: string = '';
  public Tech_CITSYear?: string = '';
  public OtherCITSQualification: ITI_InstructorTechnicalCITSQualificationList[] = [new ITI_InstructorTechnicalCITSQualificationList()];
}



export class ITI_InstructorTechnicalCITSQualificationList {
  public Tech_CITSId?: number = 0;
  public tech_TechDetailsID?: number = 0;
  public Tech_CITSCertifiedDocument?: string = '';
  public Tech_CITSTrade?: string = '';
  public Tech_CITSYear?: string = '';
}


export class ITI_InstructorTechnicalCITSQualification {
  public Tech_Exam?: string;
  public Tech_Board?: string;
  public Tech_Subjects?: string;
  public StreamName?: string;
  public StreamID?: string;
  public techRequest?: number = 0;
  public Tech_Year?: string;
  public Tech_Percentage?: number;
  public Tech_CGPA?: number;
  public TechDocument?: string = '';
  public MarksType?: string = '';
  public MarkTypeName?: string = '';
  public CITSCertified?: string = '';
  public CITSCertifiedDocument?: string = '';
  public QualificationLevel?: string = '';
  public QualificationName?: string = '';
  public QualificationID?: number = 0;
  public Tech_MarksTypeID?: string = '';
  public OtherCITSQualification: ITI_InstructorTechnicalCITSQualificationList[] = [new ITI_InstructorTechnicalCITSQualificationList()];
  
}


export class ITI_InstructorDataSearchModel {
      public Name?:  string = '';
      public DepartmentID?: string = '';
      public Uid?:  string = '';
      public roleID?: number = 0;
      public ApplicationNo?: string = '';
}

export class ITI_InstructorDataBindSearchModel {
  public Name?: string = '';
  public DepartmentID?: string = '';
  public Uid?: string = '';
  public RoleID:number=0
  //public ApplicationNo?: string = '';
}


export class ITI_InstructorGridDataSearchModel {
  public ApplicationID?: string = '';
}


export class ITI_InstructorDataAssignSearchModel {
  public DepartmentID?: string = '';
  public Uid?: string = '';
  public Name?: string = '';
  public CollegeId?: number = 0;

}

export class Iti_InstructorVerification {

  public VerificationID: number = 0;
  public InstructorID: number = 0;

  public PersonalStatus: string = '';
  public PersonalRemark: string = '';

  public BankStatus: string = '';
  public BankRemark: string = '';

  public AddressStatus: string = '';
  public AddressRemark: string = '';

  public CorAddressStatus: string = '';
  public CorAddressRemark: string = '';

  public EducationalStatus: string = '';
  public EducationalRemark: string = '';

  public TechnicalStatus: string = '';
  public TechnicalRemark: string = '';

  public EmpStatus: string = '';
  public EmpRemark: string = '';
  public Remark: string = '';


  public FinancialYear: number = 0;

  public StatusID:number=0
  public ModifyBy:number=0

}



export class ITI_Instructor_TechCITSDetailsSearchModel {

  TechCITSId?: number = 0;
  public tech_TechDetailsID?: number = 0;
  public Tech_CITSCertifiedDocument?: string = '';
  public Tech_CITSTrade?: string = '';
  public Tech_CITSYear?: string = '';
}
