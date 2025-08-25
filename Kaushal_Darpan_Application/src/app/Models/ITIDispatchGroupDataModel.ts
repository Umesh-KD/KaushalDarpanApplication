export class ITIDispatchGroupDataModel {

  public GroupDataModel: ITIDispatchGroupcodelModel[]=[]
  public DispatchGroupID: number = 0;
  public DispatchDate: string = '';
  public CompanyName: string = '';
  public ChallanNo: string = '';
  public SupplierName: string = '';
  public SupplierVehicleNo: string = '';
  public SupplierMobileNo: string = '';
  public SupplierDate: string = '';
  public RecipientName: string = '';
  public RecipientPost: string = '';
  public RecipientMobileNo: string = '';
  public RecipientDate: string = '';

  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public Remark: string = '';
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string = '';
  public InstituteID:number=0
  public Status: number = 0;


}
export class ITIDispatchGroupSearchModel {
  public DispatchGroupID: number = 0;
/*  public DispatchDate: string = '';*/
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public InstituteID:number=0
/*  public BundelID: number = 0;*/
  public Status: number = 0;


 
}
export class ITIDispatchGroupcodelModel {
  public InstituteID:number=0
  public GroupID:number=0
  public DispatchGroupID: number = 0
  public GroupCode:string=''
}

export class ITIInstituteGroupDetail {
  public PrincipleName:string=''
  public Post:string=''
  public MobileNo: string = ''
  public GroupDataModel: ITIDispatchGroupcodelModel[]=[]
}
