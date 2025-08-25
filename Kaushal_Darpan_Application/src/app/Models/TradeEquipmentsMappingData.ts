export class TradeEquipmentsMappingData {
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
  public InstituteID: number = 0;
}

export class SearchTradeEquipmentsMapping {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public TradeId: number = 0;
  public CategoryId: number = 0;
  public EquipmentId: number = 0;
  public InstituteID: number = 0;
}



