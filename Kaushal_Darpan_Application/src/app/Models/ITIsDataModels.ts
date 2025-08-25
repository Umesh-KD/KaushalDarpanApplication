export class ITIsDataModels {
  public Id: number = 0;
  public InstituteTypeID: number = 0;
  public SSOID: string = '';
  public Name: string = '';
  public EmailAddress: string = '';
  public FaxNumber: string = '';
  public ManagementTypeID: number = 0;
  public CollegeCode: string = '';
  public DGETCode: string = '';
  public MobileNumber: string = '';
  public Pincode: string = '';
  public Has10th: number = 0;
  public Has8th: number = 0;
  public Has12th: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public DepartmentID: number = 0;
  public CollegeID:number=0
  public SeatIntakes: ITISeatIntakesModel[] = [];
  public CourseTypeID: number = 0;
  public IPAddress: string = '';
}


  
export class ITIsSearchModel {
  public ZoneID: number = 0
  public DistrictID: number = 0
  public TradeID: number = 0
  public TehsilID: number = 0
  public FeeStatus: number = -1
  public ITItypeID: number = 0
  public ExamTypeId: number = 0
  public ExamSystemId: number = 0
  public CourseID: number = 0
  public Status: number = 1
  public DepartmentID: number = 0
  public Name:string=''
  public ItiCode: string = ''
  public CourseTypeID: number = 0
  public InstituteID: number = 0


}

export class  UpdateModel{
  public Id: number = 0
  public ModifyBy: number = 0
  public TypeName: string = ''
  public SSOID: string = ''  
}


export class ITISeatIntakesModel {
  public Id:number=0
  public TradeID:number=0
  public TradeName: String = '';
  public TradeScheme: string = '';
  public TradeSchemeID: number = 0
  public RemarkID:number=0
  public Remark: string = '';
  public Shift: string = '';
  public Unit: string = '';
  public LastSession: string = '';
  public ModifyBy: number = 0
}

export class SearchITIModelRequest {
  public EduID: number = 0;
  public CategoryID: number = 0;
}
