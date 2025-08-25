export class CitizenSuggestionModel {
  public Pk_ID: number = 0;
  public Name: string = '';
  public Email: string = '';
  public MobileNo: string = '';
  public SubjectId: number = 0;
  public CommnID: number = 0;
  public Comment: string = '';
  public SRNo: string = '';
  public AttchFilePath: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DivisionID: number = 0;
  public DistrictID: number = 0;
  public TehsilID: number = 0;
  public InstituteID: number = 0;
  public DepartmentID: number = 0;
  public InstituteNameEnglish: string = '';
  public SRNumber: string = '';
  public SreachResponse: boolean = false;
  public ResponseForCollege: boolean = false;
  UserRating: number=0;

  //public ActiveStatus: boolean = true;
  //public DeleteStatus: boolean = false;
}

export class CitizenSuggestionFilterModel {
  public DistrictID: number = 0;
  public DivisionID: number = 0;
  public TehsilID: number = 0;
  public InstituteID: number = 0;
  public InstituteNameEnglish: string = '';
}

export class CitizenSuggestionQueryModel {
  public Pk_ID: number = 0;
  public Replay: string = '';
  public ReplayAttachment: string = '';
  public ModifyBy: number = 0;
  public IsResolved: boolean = false;
}
export class SearchRequest {
  public DistrictID: number = 0;
  public DepartmentID: number = 0;
  public DivisionID: number = 0;
  public SubjectId: number = 0;
  public InstituteID: number = 0;
  public CommnID: number = 0;
  public SRNumber: string = '';
  public MobileNo: string = '';
  public QueryAging: number = 0;
  public RoleID: number = 0;
  public CitizenQueryStatus: number = 0;
}

export class UserRatingDataModel {
  public Pk_ID: number = 0;
  public RatingRemarks: string = '';
  public ModifyBy: number = 0;
  public SRNo: string = ''
  public UserRating: number = 0
}
