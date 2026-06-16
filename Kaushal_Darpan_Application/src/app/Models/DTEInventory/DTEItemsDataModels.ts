import { RequestBaseModel } from "../RequestBaseModel";

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
  public StatusID: number = 3;
  public ItemType: number = 2;
  public ItemFor?: number = 0;
  public StaffID?: number = 0;
  public TradeId?: number = 0;
  public ItemId?: number = 0;
  public ConditionID?: number = 0;
  public IsAuction?: number = 0;
}

export class DTEItemsSearchModel1 {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public EquipmentsId: number = 0;
  public CollegeId: number = 0;
  public OfficeID: number = 0;
  public StatusID: number = 0;
  public ItemType: number = 0;
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
  public InstituteID: number = 0;
  public TypeName: string = '';
  public TradeId: number = 0;
  public staffID: number = 0;
  public ItemId: number = 0;
  public collageTradeID: number = 0;
  public issuedTo: number = 0;
  public serialNo: number = 0;
  public departmentID: number = 0;
  public ItemCategoryId: number = 0;
  public ItemType: number = 2;
  public EquipmentsId: number = 0;
  public IssuedId: number = 0;
  public StreamID: number = 0;  
  public LabID? : number = 0;
  public ReturnStatus? : number = 2;
  public actionName? : string='';
  public UserID? : number = 0;
  public RoleID? : number = 0;
  public status? : number = 0;
  public IssueStatus? : number = 2;
  public ItemDetailsId? : number =0;
  public IsStaff? : boolean = false;
}
export class inventoryIssueHistoryITISearchModel {
  public InstituteID: number = 0;
  public TypeName: string = '';
  public TradeId: number = 0;
  public staffID: number = 0;
  public ItemId: number = 0;
  public collageTradeID: number = 0;
  public issuedTo: number = 0;
  public serialNo: number = 0;
  public departmentID: number = 0;
  public ItemCategoryId: number = 0;
  public ItemType: number = 0;
  public EquipmentsId: number = 0;
  public IssuedId: number = 0;
  public StreamID: number = 0;
  public ItemDetailsId: number =0;
  public CollegeId?: number =0;
}

export class issuedItemSearchRequestModel {
  public InstituteID: number = 0;
  public TypeName: string = '';
  public TradeId: number = 0;
  public staffID: number = 0;
  public ItemId: number = 0;
  public collageTradeID: number = 0;
  public issuedTo: number = 0;
  public serialNo: number = 0;
  public departmentID: number = 0;
  public ItemCategoryId: number = 0;
  public ItemType: number = 0;
  public EquipmentsId: number = 0;
  public IssuedId: number = 0;
  public StreamID: number = 0;
  public ItemDetailsId: number =0;
  public CollegeId?: number =0;
  public IsConsume:number = 0;
  public EquipmentWorking:number = 0;
  //public StaffID:number = 0;
  public ReturnStatus:number = 0;
}


export class ItemsIssueReturnModels extends RequestBaseModel {
  public ItemId: number = 0;
  public TradeId: number = 0;
  public ItemCategoryId: number = 0;
  public StaffId: number = 0;
  public VoucherNumber: number | null = null;
  public Quantity: number | null = null;
  public PricePerUnit: number | null = null;
  public TotalPrice: number | null = null;
  public CampanyName: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public InstituteID: number = 0;
  public UserId: number = 0;
  public TransactionID: number = 0;

  public StaffName: string = '';
  public DueDate: string = '';
  public IssueDate: string = '';
  public ReturnDate: string = '';
  public Remarks: string = '';
  public ConditionAtReturn: number = 0;
  public SelectedCount: number = 0;
  public FileName: string = '';
  
  public ItemList: ItemsDetails[] = [];
  public LabID?: number=0;
  public StreamID?: number=0;
  public IndentNo?: string = '';
}


export class ItemsDetails {
  public Item: string = '';
  public ItemCategoryName: string = '';
  public Quantity: number = 0;
  public ItemCode: string = '';
  public ItemId: number = 0;
  public EquipmentCode: number = 0;
  public ItemDetailsId: number = 0;
  public TransactionID: number = 0;
  public isOption: boolean=false;
  public AuctionStatus: number = 0;
  public UsedQuantity?: number = 0;
  public IssuedId?: number = 0;
}
export class itemReturnModel {
  public ItemCount: number = 0;
  public staffID: number = 0;
  public ItemCondition: number = 0;
  public ItemDetailsId: number = 0;
  public TransactionID: number = 0;
  public ReturnDate: string = '';
  public Remarks: string = '';
  public ItemList: string = '';
  public Type: string = '';



}

export class itemStatusRevertModel {  
  public Remark: string = '';
  
  
}


export class DTEItemsSaveModel {
  public EquipmentsId: number = 0;
  public ItemId: number = 0;
  public CategoryId: number = 0;
  public TradeId: number = 0;
  public IssueNumber: string = '';
  public IssueDate: string = '';
  public CreatedBy: string = '';
  public ReturnIssueNumber: string = '';
  public ReturnIssueDate: string = '';
  public IssueQuantity: number = 0;

}

export class DTELabMasterModel {
  public ActionName?: string='';
  public Lab_Id: number=0;
  public Lab_Name: string='';
  public Lab_DepartmentId: number=0;
  public Lab_BranchId: number=0;
  public Lab_CollegeId: number=0;
  public Lab_TechnicianId: number=0;
  public Lab_ActiveStatus: boolean=true;
  public Lab_DeleteStatus: boolean=false;
  public Lab_RTS?: Date | string | null;
  public Lab_CreatedBy: number=0;
  public Lab_ModifyBy: number=0;
  public Lab_ModifyDate?: Date | string | null;
  public Lab_IPAddress: string='';
}

export class ApproveIssuedItemsDataModel {
  public IssuedId: number = 0;
  public UserID: number = 0;
}

export class HandoverInventoryItemsDataModel {
  public HandoverFrom: number = 0;
  public HandoverTo: number = 0;
  public ItemList?: any[] = [];
  public UserID?: number = 0;
  public TradeId: number = 0;
  public HandoverDocument: string = '';
  public Dis_HandoverDocument: string = '';
}
export class DTEItemsSearchModel4Lab {
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public RoleID: number = 0;
  public EquipmentsId: number = 0;
  public CollegeId: number = 0;
  public OfficeID: number = 0;
  public StatusID: number = 3;
  public ItemType: number = 2;
  public ItemFor?: number = 0;
  public StaffID?: number = 0;
  public TradeId?: number = 0;
  public UserId?: number = 0;

}
