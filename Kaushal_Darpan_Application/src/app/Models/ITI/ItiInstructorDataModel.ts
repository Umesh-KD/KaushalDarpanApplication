export class ITI_InstructorDataModel {
  // Personal Details
  public InstituteID: number=0;
  public id?:  number = 0;
  public Uid:  string = '';
  public Name?:  string = '';
  public FatherOrHusbandName?:  string = '';
  public MotherName?:  string = '';
  public Dob?:  string = '';
  public Gender?:  string = '';
  public MaritalStatus?:  string = '';
  public Category?: string = '';
  public Mobile?:  string = '';
  public Email?:  string = '';

  // Permanent Address
  public PlotHouseBuildingNo?:  string = '';
  public StreetRoadLane?:  string = '';
  public AreaLocalitySector?:  string = '';
  public LandMark?:  string = '';
  public ddlState?:  string = '';
  public ddlDistrict?:  string = '';
  public PropTehsilID?:  string = '';
  // public PropUrbanRural?:  number = 0;
  public City?:  string = '';
  // public villageID?:  string = '';
  public pincode?:  string = '';

  // Correspondence Address
  public Correspondence_PlotHouseBuildingNo?:  string = '';
  public Correspondence_StreetRoadLane?:  string = '';
  public Correspondence_AreaLocalitySector?:  string = '';
  public Correspondence_LandMark?:  string = '';
  public Correspondence_ddlState?:  string = '';
  public Correspondence_ddlDistrict?:  string = '';
  public Correspondence_PropTehsilID?:  string = '';
  // public Correspondence_PropUrbanRural?:  number = 0;
  public Correspondence_City?:  string = '';
  // public Correspondence_villageID?:  string = '';
  public Correspondence_pincode?:  string = '';

  // Educational Qualification
  public Education_Exam?:  string = '';
  public Education_Board?:  string = '';
  public Education_Year?:  string = '';
  public Education_Subjects?:  string = '';
  public Education_Percentage!: number;
  public QualificationDocument?: string = '';

  // Technical Qualification
  public Tech_Exam!: string;
  public Tech_Board!: string;
  public Tech_Subjects!: string;
  public Tech_Year!: string;
  public Tech_Percentage!: number;
  public TechQualificationDocument?: string = '';

  // Employment Details
  public Pan_No?:  string = '';
  public Employee_Type?:  string = '';
  public Employer_Name?:  string = '';
  public Employer_Address?:  string = '';
  public Tan_No?:  string = '';
  public Employment_From?:  string = '';
  public Employment_To?:  string = '';
  public Basic_Pay?: number = 0;
  public IsDomicile: boolean = false;
  public Aadhar: string = '';
  public JanAadhar: string = '';
  // Additional Fields
  public CreatedBy?: string = '';
  public DepartmentID?: string = '';
  public EmploymentDocument?: string = '';
  public TehsilName?: string = '';

  // Parent should hold child tables
  public EducationalQualifications: ITI_InstructorEducationalQualification[] = [];
  public TechnicalQualifications: ITI_InstructorTechnicalQualification[] = [];
  public EmploymentDetails: ITI_InstructorEmploymentDetails[] = [];
}

export class ITI_InstructorEducationalQualification {
  public Education_Exam?: string = '';
  public Education_Board?: string = '';
  public Education_Year?: string = '';
  public Education_Subjects?: string = '';
  public Education_Percentage?: number;
  public QualificationDocument?: string = '';
}

export class ITI_InstructorEmploymentDetails {
  public Pan_No?: string = '';
  public Employee_Type?: string = '';
  public Employer_Name?: string = '';
  public Employer_Address?: string = '';
  public Tan_No?: string = '';
  public Employment_From?: string = '';
  public Employment_To?: string = '';
  public Basic_Pay?: number = 0;
  public EmploymentDocument?: string = '';
  //public IsDomicile: boolean = false;
  //public Aadhar: string = '';
  //public JanAadhar: string = '';
}

export class ITI_InstructorTechnicalQualification {
  public Tech_Exam?: string;
  public Tech_Board?: string;
  public Tech_Subjects?: string;
  public Tech_Year?: string;
  public Tech_Percentage?: number;
  public TechQualificationDocument?: string = '';
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
  //public ApplicationNo?: string = '';
}


export class ITI_InstructorGridDataSearchModel {
  public ApplicationID?: string = '';
}

