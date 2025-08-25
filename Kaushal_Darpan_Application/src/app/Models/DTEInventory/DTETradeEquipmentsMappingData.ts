export class DTETradeEquipmentsMappingData {
  public TE_MappingId: number = 0;
  public TradeId: number = 0;
  public CategoryId: number = 0;
  public EquipmentId: number = 0;
  public Quantity: number | null = null;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public OfficeID: number = 0;
  public RoleID: number = 0;
  public DepartmentID: number = 0;
  public TradeIdTypeId: number = 0;
  public InstituteID: number = 0;
  public Status: number = 0;

  public VoucherNumber: number | null = null;
  public PricePerUnit: number | null = null;
  public TotalPrice: number | null = null;
  public IdentificationMark: string = '';
  public CompanyName: string = '';
}

export class DTESearchTradeEquipmentsMapping {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public OfficeID: number = 0;
  public CategoryId: number = 0;
  public EquipmentId: number = 0;
  public InstituteID: number = 0;
}

export class DTEEquipmentVerificationsDataModel {
  public TE_MappingId: number = 0;
  public TradeId: number = 0;
  public CategoryId: number = 0;
  public EquipmentId: number = 0;
  public Quantity: number | null = null;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
  public TradeIdTypeId: number = 0;
  public ReturnStatus: number = 0;
}



//export class ItemsDataModels {
//  public ItemId: number = 0;
//  public TradeId: number = 0;
//  public ItemCategoryId: number = 0;
//  public EquipmentsId: number = 0;
//  public VoucherNumber: number | null = null;
//  public Quantity: number | null = null;
//  public PricePerUnit: number | null = null;
//  public TotalPrice: number | null = null;
//  public IdentificationMark: string = '';
//  public CampanyName: string = '';
//  public ActiveStatus: boolean = true;
//  public DeleteStatus: boolean = false;
//  public CreatedBy: number = 0;
//  public ModifyBy: number = 0;
//  public DepartmentID: number = 0;
//  public InstituteID: number = 0;
//  public TradeIdTypeId: number = 0;
//  public ItemDetailsId: number = 0;
//  public Status: number = 0;
//}
