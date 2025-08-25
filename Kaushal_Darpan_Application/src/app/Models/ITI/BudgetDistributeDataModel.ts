
export class BudgetDistributeModel {
  public DistributedID:number=0
  public CollegeID:number=0
  public FinYearID:number=0
  public DistributedType:number=0
  public DistributedAmount:number=0
  public CreatedBy:number=0
  public ActionType:string=''
  public Remarks:string=''
}

export class BudgetHeadSearchFilter {
  public CollegeID: number = 0
  public FinYearID: number = 0
  public CreatedBy: number = 0
  public DistributedID: number = 0
  public RequestID: number = 0
  public StatusId: number = 0
  public ActionName: string = ''
  public CollegeName: string = ''
  public DistributedType: number = 0
  
}

export class BudgetHeadUtilizeList
{
  public HeadID: number = 0
  public UtilizationAmount: number = 0
  public HeadName: string = ''
}


export class BudgetRequestModel {
  public RequestID: number = 0;
  public RequestAmount: number = 0;
  public ApprovedAmount: number = 0;
  public Remarks: string = '';
  public RequestFileName: string = '';
  public DocFileName: string = '';
  public Dis_FilePath: string = '';
  public UserID: number = 0;
  public RoleId: number = 0;
  public FinYearID: number = 0;
  public DepartmentID: number = 0;
  public Eng_NonEng: number = 0;
  public CollegeId: number = 0;
  public StatusId: number = 0;
  public Action: string = '';
}

