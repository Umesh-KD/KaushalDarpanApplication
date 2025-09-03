export class DTEItemsDataModels {
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
}
export class DTEItemsSearchModel {
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
  public isOption: boolean = false;
}


export class EquipmentCodeDuplicateSearch {
  public ItemCategoryName: string = '';
  public IsDuplicate: number = 0;
  public EquipmentsCode: string = '';

}

export class CheckItemAuctionSearch {
  public ItemCategoryName: string = '';
  public EquipmentsCode: string = '';
  public ItemId: number = 0;
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
