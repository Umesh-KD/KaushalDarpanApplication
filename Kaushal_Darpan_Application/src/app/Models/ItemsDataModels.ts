export class ItemsDataModels {
  public OfficeID: number = 0;
  public RoleID: number = 0;
  public ItemId: number = 0;
  public TradeId: number = 0;
  public ItemCategoryId: number = 0;
  public EquipmentsId: number = 0;
  public VoucherNumber: number | null = null;
  public Quantity: number | null = null;
  public PricePerUnit: number | null = null;
  public TotalPrice: number | null = null;
  public IdentificationMark: string = '';
  public CampanyName: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public TradeIdTypeId: number = 0;
  public ItemDetailsId: number = 0;
  public Status: number = 0;
  public ItemType : number = 0;
  public IsConsume: number = 0;
  //public Unit: number = 0;
}
export class ItemsSearchModel {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public EquipmentsId: number = 0;
  public CollegeId: number = 0;
  public OfficeID: number = 0;
  public StatusID: number = 0;
}

export class ItemsDetailsModel {
  public Item: string = '';
  public Category: string = '';
  public Quantity: string = '';
  public EquipmentCode: string = '';
  public ItemId: number = 0;
  public ItemDetailsId: number = 0;

  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public EquipmentWorking: number = 0;
  public isOption: boolean = false
}

export interface ItemsDetailsInterface {
  EquipmentWorking: number | string;
  EquipmentCode: string;
  isOption: boolean;
  ItemId: number;
  ItemDetailsId: number;
  Item?: string;
}

export class AuctionDetailsModel {

  public AuctionDoc: string = '';
  public AuctionDate: string = '';
  public Dis_AuctionDoc: string = '';
  public ItemDetailsId: number = 0;
  public AuctionQuantity: number = 0;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public InstituteID: number = 0;
  public OfficeID: number = 0;
  public EquipmentWorking: number = 0;
  public isOption: boolean = false;
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public RowsID: string = '';
}

export class inventoryIssueHistorySearchModel {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public EquipmentsId: number = 0;
  public CollegeId: number = 0;
  public OfficeID: number = 0;
  public StatusID: number = 0;
  public ItemCategoryID: number = 0;
  public StreamID: number = 0;
}
