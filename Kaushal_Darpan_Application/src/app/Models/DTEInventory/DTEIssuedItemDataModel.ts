export class DTEIssuedItemDataModel {
  public IssuedId: number = 0;
  public EquipmentsId: number = 0;
  public ItemId: number = 0;
  public CategoryId: number = 0;
  public TradeId: number = 0;
  public IssueNumber: number | null = null;
  public IssueDate: Date = new Date();
  //public IssueDate: Date = new Date();
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
  public IssueQuantity: number = 0;
  /*public ReturnQuantity: number = 0;*/
}
export class DTEIssuedSearchModel {
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public CollegeId: number = 0;
  public RoleID: number = 0;
  public EquipmentsId: number = 0;
  public TradeId: number = 0;
  public Issuenumber: number | null = null;
  public EquipmentCode: string = '';
  public Issuedate: Date | null = null;
  public IssueQuantity: number = 0;
}



export class DTEReturnItemSearchModel {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public EquipmentsId: number = 0;
  public CategoryId: number = 0;
  public Issuenumber: number | null = null;
  public IssueDate: Date | null = null;
}

export class DTEStoksSearchModel {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public OfficeID: number = 0;
  public EquipmentsId: number = 0;
  public TradeId: number = 0;
  public InstituteID: number = 0;
}

export class ReturnDteItemDataModel {
  public IssuedId: number = 0;
  public ItemId: number = 0;
  public CategoryId: number = 0;
  public ReturnStatus: number = 0;
  public ReturnNumber: number | null = null;
  public ReturnDate: Date | null = null;
  public ReturnQuantity: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
  public ReturnRemark: string = '';
}
export class ReturnDteItemSearchModel {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public CollegeId: number = 0;
  public EquipmentsId: number = 0;
  public CategoryId: number = 0;
  public Issuenumber: number | null = null;
  public IssueDate: Date | null = null;
  public FilterIssuedate: string = '';
}



