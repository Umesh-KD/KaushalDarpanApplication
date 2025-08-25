export class IssuedSearchModel {
  public EquipmentsId: number = 0;
  public TradeId: number = 0;
  public Issuenumber: number | null = null;
  public EquipmentCode: string = '';
  public Issuedate: Date | null = null;
}

export class IssuedTrackerSearchModel {
  public EquipmentsId: number = 0;
  public TradeId: number = 0;
  public Issuenumber: number | null = null;
  public EquipmentCode: string = '';
  public Issuedate: Date | null = null;
}




export class IssuedItemDataModel {
  public IssuedId: number = 0;
  public EquipmentsId: number = 0;
  public ItemId: number = 0;
  public CategoryId: number = 0;
  public TradeId: number = 0;
  public IssueNumber: number | null = null;
  //public IssueDate: Date | null = null;
  public IssueDate: Date = new Date();
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
}


export class ReturnItemSearchModel {
  public EquipmentsId: number = 0;
  public CategoryId: number = 0;
  public Issuenumber: number | null = null;
  public IssueDate: Date | null = null;
  public FilterIssuedate: string = '';
}

export class StoksSearchModel {
  public EquipmentsId: number = 0;
  public TradeId: number = 0;
}

export class ReturnItemDataModel {
  public IssuedId: number = 0;
  public ItemId: number = 0;
  public CategoryId: number = 0;
  public ReturnStatus: number = 0;
  public ReturnNumber: number | null = null;
  public ReturnDate: Date | null = null;
  public ReturnRemark: string = '';

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;

 
}


