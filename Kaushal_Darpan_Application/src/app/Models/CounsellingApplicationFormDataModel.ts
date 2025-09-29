import { RequestBaseModel } from "./RequestBaseModel";

export class CounsellingApplicationFormDataModel {
  public CandidateID: number = 0;
  public SSOID?: string = '';
  public CandidateName?: string = '';
  public FatherName?: string = '';
  public MotherName?: string = '';
  public GenderId: number = 0;
  public DOB?: string = '';
  public CategoryA_ID: number = 0;
  public MobileNo?: string = '';
  public Email?: string = '';
  public Address1?: string = '';
  public Address2?: string = '';
  public Address3?: string = '';
  public StateID: number = 0;
  public DistrictID: number = 0;
  public BlockID: number = 0;
  public Pincode?: string = '';
  public AadharNo?: string = '';
  public JanAadharNo?: string = '';
  public JanAadharMobileNo?: string = '';
  public JanAadharName?: string = '';
  public JanAadharMemberId?: string = '';
  public Remark?: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
  public CourseType?: string = '';
  public ProfileStatus: number = 0;
  public ApplicationNo?: string = '';
  public ReligionID: number = 0;
  public NationalityID: number = 0;
  public MaritalID: number = 0;
  public PWDCategoryID: number = 0;
  public IsMinority: boolean = false;
  public IsFinalSubmit: number = 0;
  public DepartmentName?: string = '';
  public SubmittedStep?: string = '';
}

export class CounsellingApplicationSearchModel {
  public CandidateId?: number = 0; 
  public DepartmentID?: number = 0;
  public SSOID?: string = '';
  public JanAadharMemberID?: string = '';
  public JanAadharNo?: string = '';
  public CandidateName?: string = ''; 
  public MobileNo?: string = '';
  
  public AadharNo?: string = '';
  public DOB?: string = '';
  public Action?: string = '';
}

export class Counselling_OptionFormDataModel extends RequestBaseModel{
    public Priority?: number = 0;
    public CandidateID?: number = 0;
    public TradeId?: number = 0;
    public InstituteID?: number = 0;
    public CourseType?: number = 0;
    public ModifyBy?: number = 0;
}

export class Counselling_DropdownDataModel extends RequestBaseModel {
    public Action?: string = '';
    public TradeID?: number = 0;
    public InstituteID?: number = 0;
}
