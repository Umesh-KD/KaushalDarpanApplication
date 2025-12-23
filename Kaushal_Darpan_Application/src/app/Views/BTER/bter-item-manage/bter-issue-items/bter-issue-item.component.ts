import { Component, Pipe, PipeTransform } from '@angular/core';
import { ItemsDataModels } from '../../../../Models/ItemsDataModels';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ITITradeSearchModel } from '../../../../Models/ITITradeDataModels';
import { DTEItemsSaveModel,DTEItemsSearchModel, DTEItemsDataModels, inventoryIssueHistorySearchModel, ItemsIssueReturnModels, DTEItemsSearchModel1,DTELabMasterModel,  } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
/*import { ITIInventoryService } from '../../../../Services/ITI/ITIInventory/iti-inventory.service';*/
import { DteItemsMasterService } from '../../../../Services/DTEInventory/DTEItemsMaster/dteitems-master.service';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { DeleteDocumentDetailsModel } from '../../../../Models/DeleteDocumentDetailsModel';
import { UploadBTERFileModel, UploadFileModel } from '../../../../Models/UploadFileModel';
import { AppsettingService } from '../../../../Common/appsetting.service';

@Component({
  selector: 'app-bter-add-items-master',
  templateUrl: './bter-issue-item.component.html',
  styleUrls: ['./bter-issue-item.component.css'],
  standalone: false
})
export class AddBterIssueItemComponent {
  public request = new ItemsDataModels()
  public searchTradeRequest = new ITITradeSearchModel();
  public searchRequest = new DTEItemsSearchModel();
  public submitRequest = new ItemsIssueReturnModels();
  public Searchrequests = new inventoryIssueHistorySearchModel()
  public labrequests = new DTELabMasterModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public InstituteID: number = 0;
  public TradeId: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public Dis_FileName: string = '';
  public FileName: string = '';
  public EquipmentsId: number = 0;
  public AddItemsRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public Table_SearchText: string = "";
  public ItemsDDLList: any = [];
  public ItemsDDL: any = [];
  public CatogaryDDLList: any = [];
  public departmentDDLList: any = [];
  public TradeDDLList: any = [];
  public EquipmentDDLList: any = [];
  public CategoryDDLList: any = [];
  public StaffDDLList: any = [];
  public staffDDLList: any = [];
  selectedItems: Array<any> = [];
  showDetailsTable: boolean = false;
  public maxQty: number = 0;
  _EnumRole = EnumRole;
  public ItemtypeList: any[] = []
  public OfficeList: any = [];
  public AllInTableSelect: boolean = false;
  chunkedItems: any[][] = [];
  SelectedItems: any[] = [];
  AddItemList: DTEItemsSaveModel[] = [];
  public StreamMasterList: any = [];
  public LabMasterList: any = [];
  public ItemsDataList: any = []; 
  public selectedDataList: any[] = [];
  public staff_ID:number =0;
  public ItemMasterList: any = [];
  public ItemMasterList1: any = [];
  public IssuedItemList: any = [];
  isFileError: boolean = false;
  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private bterInventoryService: DteItemsMasterService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private documentDetailsService: DocumentDetailsService,
    public appsettingConfig: AppsettingService,
    private routers: Router) { }


  async ngOnInit() {

    this.AddItemsRequestFormGroup = this.formBuilder.group({
      ItemType: ['0', [DropdownValidators]],
      TradeId: ['-1', [DropdownValidators]],

    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    this.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.prepareChunkedItems();
    this.GetMasterData()

  }
  get _AddItemsRequestFormGroup() { return this.AddItemsRequestFormGroup.controls; }

  async RefereshValoidators() {
    if (this.request.ItemType == 2) {
      this.AddItemsRequestFormGroup.controls['TradeId'].setValidators([DropdownValidators])
    } else {
      this.AddItemsRequestFormGroup.controls['TradeId'].clearValidators()
    }
    this.AddItemsRequestFormGroup.controls['TradeId'].updateValueAndValidity()
  }

  async saveData() {
    
    this.submitRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.submitRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.submitRequest.UserId = this.sSOLoginDataModel.UserID;
    this.isSubmitted = true;

    this.submitRequest.ItemList = this.ItemsDDLList.filter((x: any) => x.Selected);

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      await this.bterInventoryService.SaveIssueItems(this.submitRequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.modalService.dismissAll();
            this.ResetControl();
           // this.routers.navigate(['/bter-issue-item']);
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)

          }
          else if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage);
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async GetByID(id: number) {

    
  }


  async DGET_Details() {
    try {
      this.loaderService.requestStarted();
      

      this.searchRequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.EquipmentsId = this.Searchrequests.ItemId;

      {
        //  Serial No = No → get items WITHOUT Equipment Code
        await this.bterInventoryService.GetConsumeItemList(this.searchRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.ItemsDDLList = data.Data || [];
          }, error => console.error(error));
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      this.loaderService.requestEnded();
    }
  }



  getTradeNameById(id: any): string {
    const selectedTrade = this.TradeDDLList.find((item: any) => item.TradeId === id);
    return selectedTrade ? selectedTrade.Name : '';
  }


  getCategoryNameById(id: any): string {
    const selectedCategory = this.CategoryDDLList.find((item: any) => item.ID === id);
    return selectedCategory ? selectedCategory.Name : '';
  }


  updateTable() {
    const trade = this.getTradeNameById(this.request.TradeId);
    const category = this.getCategoryNameById(this.request.ItemCategoryId);


    if (trade && category) {
      const newItem = {
        trade: trade,
        category: category,
      };
      this.selectedItems = [newItem];

      this.showDetailsTable = true;
      console.log("Updated selectedItems:", this.selectedItems);
    }
  }


  selectInTableAllCheckbox(): void {
    (this.ItemsDDLList ?? []).forEach((x: { Selected: boolean }) => {
      x.Selected = this.AllInTableSelect;
    });
  }

  selectInTableSingleCheckbox(isSelected: boolean, item: any): void {
    const data = this.ItemsDDLList.find((x: any) => x.ItemDetailsId === item.ItemDetailsId);
    if (data) {
      data.Selected = isSelected;
    }

    this.AllInTableSelect = this.ItemsDDLList.every((r: any) => r.Selected);
  }


  ShowSubmit(content: any): void {
    

    const anyTeamSelected = this.ItemsDDLList.some((x: any) => x.Selected);
    if (!anyTeamSelected) {
      this.toastr.error("Please select at least one Item!");
      return;
    }

    if (this.Searchrequests.staffID == 0) {
      this.toastr.error("Please select at least one Staff!");
      return;
    }


    const selectedStaff = this.staffDDLList.find(
      (x: any) => x.staffID == this.Searchrequests.staffID || x.StaffID == this.Searchrequests.staffID
    );
    this.submitRequest.StaffId = this.Searchrequests.staffID;
    this.submitRequest.StaffName = selectedStaff ? (selectedStaff.staffName || selectedStaff.StaffName) : '';
    this.submitRequest.TradeId = this.Searchrequests.TradeId;
    this.submitRequest.ItemId = this.Searchrequests.ItemId;
    this.submitRequest.Quantity = this.ItemsDDLList.filter((x: any) => x.Selected).length;



    this.modalReference = this.modalService.open(content, {backdrop: 'static', size: 'lg', keyboard: true,centered: true});

    return;
  }


  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequests = new inventoryIssueHistorySearchModel();
    this.AddItemsRequestFormGroup.reset({
      EquipmentsId: 0,
      ItemCategoryId: 0
    });

    this.ItemsDDLList = [];
  }

  CloseModalPopup() {

    this.modalService.dismissAll();
  }



  async GetStaffDDL() {
    
    try {
      this.loaderService.requestStarted();
      this.Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequests.TypeName = 'staffList';

      const data: any = await this.bterInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequests);

      if (data && data.State === EnumStatus.Success) {
        this.staffDDLList = [
          { staffID: 0, staffName: 'Choose Staff' },
          ...data.Data
        ];

        this.Searchrequests.staffID = 0;
        console.log('staff list ==>', this.staffDDLList);
      } else {
        this.staffDDLList = [{ staffID: 0, staffName: 'Choose Staff' }];
        this.Searchrequests.staffID = 0;
        this.toastr.error(data?.ErrorMessage || 'No staff found.');
      }
    } catch (Ex) {
      console.error('Error in GetStaffDDL:', Ex);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  async GetCategoryDDL() {
    
    try {
      this.loaderService.requestStarted();
      this.Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequests.TypeName = 'ItemList';

      const data: any = await this.bterInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequests);

      if (data && data.State === EnumStatus.Success) {
        this.CategoryDDLList = [
          { ItemId: 0, ItemCategoryName: 'Choose Category' },
          ...data.Data
        ];

        this.Searchrequests.ItemId = 0;
        console.log('category list ==>', this.CategoryDDLList);
        this.ItemsDDLList = [];
      } else {
        this.CategoryDDLList = [{ ItemId: 0, ItemCategoryName: 'Choose Category' }];
        this.Searchrequests.ItemId = 0;
        this.toastr.error(data?.ErrorMessage || 'No category found.');
      }
    } catch (Ex) {
      console.log('Error in GetCategoryDDL:', Ex);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }
  openDatePicker(event: any) {
    event.target.showPicker();
  }





  onIssuedToChange() {
    this.Searchrequests.staffID = 0;
    this.Searchrequests.ItemCategoryId = 0;
    this.Searchrequests.ItemId = 0;
    this.Searchrequests.departmentID = 0;
    this.ItemsDDL = [];
    this.ItemsDDLList = [];

    if (this.Searchrequests.issuedTo == 2) {
      // Staff → load staff + category
      this.GetStaffDDL();
      //this.GetCategoryDDL();
    } else if (this.Searchrequests.issuedTo == 3) {
      // Department → load department list
      this.GetDepartmentDDL();
    } else if (this.Searchrequests.issuedTo == 1) {
      // Office → no dropdowns, only search
      this.ItemsDDLList = []; // ready for office search
    }
  }

  async GetItemsDDL() {
    try {
      this.loaderService.requestStarted();
      //this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      //this.searchRequest.ItemCategoryId = this.Searchrequests.ItemCategoryId;

      //const data: any = await this.bterInventoryService.GetItemListByCategory(this.searchRequest);

      //if (data && data.State === EnumStatus.Success) {
      //  this.ItemsDDL = data.Data;
      //} else {
      //  this.ItemsDDL = [];
      //}
    } catch (ex) {
      console.log('Error in GetItemsDDL:', ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetDepartmentDDL() {
    try {
      this.loaderService.requestStarted();
      this.Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequests.TypeName = 'DepartmentList';

      const data: any = await this.bterInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequests);

      if (data && data.State === EnumStatus.Success) {
        this.departmentDDLList = data.Data;
      } else {
        this.departmentDDLList = [];
      }
    } catch (ex) {
      console.log('Error in GetDepartmentDDL:', ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetOfficeList() {


    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMasterList(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          console.log(this.OfficeList, "OfficeList")
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetItemListType() {
    
    try {
      this.loaderService.requestStarted();
    console.log('Branch Id :'+this.Searchrequests.StreamID  );
      const searchdata: DTEItemsSearchModel1 = {
        DepartmentID: this.sSOLoginDataModel.DepartmentID || 0,
        EndTermID: this.sSOLoginDataModel.EndTermID || 0,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng || 0,
        RoleID: this.sSOLoginDataModel.RoleID || 0,
        CollegeId: this.sSOLoginDataModel.InstituteID || 0,
        ItemType: this.Searchrequests.ItemType || 2,
        EquipmentsId: 0,
        OfficeID: 0,
        StatusID: 0,

      };

      const data: any = await this.bterInventoryService.GetItemListType(searchdata);

      if (data && data.State === EnumStatus.Success) {
        this.CategoryDDLList = data.Data.map((x: any) => ({
          ItemCategoryID: x.ItemCategoryID,
          ItemCategoryName: x.ItemCategoryName
        }));

        this.Searchrequests.ItemCategoryId = 0; // reset
        this.ItemsDDLList = []; // reset
        this.SelectedItems = [];
      } else {
        this.CategoryDDLList = [];
        this.ItemsDDLList = [];
        this.SelectedItems=[];
      }
    } catch (Ex) {
      console.error("Error in GetItemListType:", Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  async BindItem_list() {
    
  try {
    this.loaderService.requestStarted();
     ;
    const searchdata: DTEItemsSearchModel1 = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID || 0,
      EndTermID: this.sSOLoginDataModel.EndTermID || 0,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng || 0,
      RoleID: this.sSOLoginDataModel.RoleID || 0,
      CollegeId: this.sSOLoginDataModel.InstituteID || 0,
      ItemType: this.Searchrequests.ItemType || 0,
      EquipmentsId: this.Searchrequests.ItemCategoryId || 0,
      OfficeID: 0,
      StatusID: 0 
    };
    await this.bterInventoryService.GetAllItemList(searchdata)
    .then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ItemsDDLList = data['Data'];
       this.SelectedItems = [];
      console.log("Bind  Item  list", this.ItemsDDLList )
    }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  prepareChunkedItems() {
    const chunkSize = 4; // 4 items per row
    this.chunkedItems = [];

    for (let i = 0; i < this.ItemsDDLList.length; i += chunkSize) {
      this.chunkedItems.push(this.ItemsDDLList.slice(i, i + chunkSize));
    }
  }

  onItemSelect(item: any) {
    console.log("Selected Item:", item);
  }


  onItemToggle(item: any) {
    
    if (item.Selected) {
      // Add if not already present
      if (!this.SelectedItems.find(x => x.ItemId === item.ItemId)) {
        this.SelectedItems.push({
          ItemId: item.ItemId,
          ItemName: item.CampanyName,
          ItemCategoryName: item.CategoryName,
          //Quantity: 1, // default
          Quantity: item.Quantity, 
          FileName: item.FileName || '',
          Dis_FileName: item.Dis_FileName || '',
          EquipmentsId: item.EquipmentsId,
          issuedTo: item.IssueTo,
          ItemCategoryId: item.ItemCategoryId,
        });
        this.FileName = ''
        this.Dis_FileName = ''
      }
    } else {
      // Remove if unchecked
      this.SelectedItems = this.SelectedItems.filter(x => x.ItemId !== item.ItemId);
    }
  }

  removeSelectedItem(index: number) {
    const removedItem = this.SelectedItems[index];
    this.SelectedItems.splice(index, 1);
  }

  async saveSelectedItems() {
    
    if (!this.SelectedItems || this.SelectedItems.length === 0) {
      this.toastr.error("Please select at least one item!");
      return;
    }
    const anyTeamSelected = this.ItemsDDLList.some((x: any) => x.Selected);
    if (!anyTeamSelected) {
      this.toastr.error("Please select at least one Item!");
      return;
    }

    if (this.Searchrequests.staffID == 0 && this.Searchrequests.issuedTo == 2) {
      this.toastr.error("Please select at least one Staff!");
      return;
    }
    if (!this.FileName || this.FileName.trim() === '') {
      this.isFileError = true;
      this.toastr.error('Please upload document');
      return;
    }
    this.SelectedItems.forEach((element: any) => {
      element.FileName = this.FileName, element.Dis_FileName = this.Dis_FileName,
        element.InstituteID = this.sSOLoginDataModel.InstituteID,
        element.EndTermID = this.sSOLoginDataModel.EndTermID,
        element.RoleID = this.sSOLoginDataModel.RoleID,
        element.StaffId = this.Searchrequests.staffID,
        element.StreamID=this.Searchrequests.StreamID,
        element.LabID=this.Searchrequests.LabID,
      //element.itemCategoryId = this.Searchrequests.itemCategoryId,
        element.itemCategoryId = this.Searchrequests.ItemCategoryId
        || 0;

        
        element.issuedTo = this.Searchrequests.issuedTo && this.Searchrequests.issuedTo > 0
          ? this.Searchrequests.issuedTo
          : null; 
        element.EquipmentsId = element.EquipmentsId || this.Searchrequests.ItemId || 0;
    });

    this.AddItemList = this.SelectedItems
     
    try {
      this.loaderService.requestStarted();

      await this.bterInventoryService.SaveIssueItemsList(this.AddItemList).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AddItemList = [];

          this.BindItem_list();
          this.SelectedItems = [];
          this.AddItemList = [];
          this.Searchrequests = {
              staffID: 0
            , issuedTo: 0
            , ItemId: 0
            , ItemType: 0
            , ItemCategoryId: 0
            , InstituteID: 0
            , TypeName: ''
            , TradeId:  0
            , collageTradeID: 0
            , serialNo: 0
            , departmentID: 0
            , EquipmentsId: 0
            , IssuedId: 0
            ,StreamID: 0 
          };
          this.FileName = '';
          this.Dis_FileName = '';

          if (this.AddItemsRequestFormGroup) {
            this.AddItemsRequestFormGroup.reset();
          }
          this.routers.navigate(['/bter-issue-item'], {

          });
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
      
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  cancelSelection() {
    this.SelectedItems = [];
  }
 validateQuantity(item: any) {
  // Find the original item from ItemsDDLList
  const original = this.ItemsDDLList.find((x: any)  => x.ItemId === item.ItemId);

  if (original) {
    const availableQty = original.Quantity;

    if (item.Quantity > availableQty) {
      alert(`You can’t enter more than available quantity (${availableQty}).`);
      item.Quantity = availableQty; // Reset to max allowed
    } else if (item.Quantity < 1) {
      alert('Quantity must be at least 1.');
      item.Quantity = 1;
    }
  }
}

  async UploadDocument(event: any, FileName: any, Dis_FileName:any) {
    try { 
      let uploadModel: UploadFileModel = {
        FileName: FileName ?? "",
        FileExtention: "",
        MinFileSize: "20kb",
        MaxFileSize: "50mb",
        FolderName:"Students",
   
      }
      await this.documentDetailsService.UploadDocument(event, uploadModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          
          if (this.State == EnumStatus.Success) {
            this.FileName = data.Data[0].FileName;
            this.Dis_FileName = data.Data[0].Dis_FileName;
            console.log(this.SelectedItems)
            event.target.value = null;
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async DeleteDocument(item: any) {
    try {
      let deleteModel = new DeleteDocumentDetailsModel()
      deleteModel.FolderName =  "Students";
      deleteModel.FileName = item;
      await this.documentDetailsService.DeleteDocument(deleteModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State != EnumStatus.Error) {
            
              this.FileName = '';
              this.Dis_FileName = '';
            console.log(this.SelectedItems)
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async GetMasterData() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
          this.StreamMasterList = data['Data'];
        }, (error: any) => console.error(error));
      this.Searchrequests.StreamID = 0;
      console.log('Stream Master List',this.StreamMasterList)
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
 async GeLabMasterData() {
    try {
      this.loaderService.requestStarted();
      
      this.labrequests.Lab_DepartmentId=this.sSOLoginDataModel.DepartmentID;
      this.labrequests.Lab_BranchId=this.Searchrequests.StreamID;
      this.labrequests.ActionName='GetLabDataForMaster';
      await this.bterInventoryService.GetDTEGetSetLabMaster(this.labrequests)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LabMasterList = data['Data'];
          this.LabMasterList = data['Data'];
        }, (error: any) => console.error(error));
      this.labrequests.Lab_Id = 0;
      console.log('Stream Master List',this.StreamMasterList)
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  onStaffChange() {
    
    this.Searchrequests.ItemType = 0; 
    this.Searchrequests.ItemCategoryId = 0; 
    this.CategoryDDLList = [];
    this.ItemsDDLList = [];
    this.SelectedItems =[];
    console.log("Staff changed => reset ItemType & Category");

    this.GetItemListType();
    
  }
  async ShowSubmitIssue(content: any, itemId:any,staffId:any) {
    
      this.staff_ID=staffId;
    const anyTeamSelected = this.ItemsDDLList.some((x: any) => x.Selected);
    if ((!anyTeamSelected) && (this.Searchrequests.issuedTo == 2)){
      this.toastr.error("Please select at least one Item!");
      return;
    }

    if (this.Searchrequests.staffID == 0 && this.Searchrequests.issuedTo == 2)  {
      this.toastr.error("Please select at least one Staff!");
      return;
    }

    console.log('Logs Item ID:'+itemId);
      await this.bterInventoryService.GetDTEIssueItemListPermanent(itemId).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.ItemsDataList = data.Data; 
        this.ItemsDDLList = [];
        this.SelectedItems = [];
          console.log(this.ItemsDataList);
           this.BindItem_list();
        }
      }); 


    this.modalReference = this.modalService.open(content, {backdrop: 'static', size: 'lg', keyboard: true,centered: true});

    return;
  }
  toggleAll(event: any) {
    const checked = event.target.checked;
    this.ItemsDataList.forEach((item: any) => item.Selected = checked);
  }
  onIssueItemToggle(item: any) {
  // Only run logic when checkbox is checked
    if (item.Selected) {
      // Check both conditions
      
      if (item.IsSerialNo == 1 && item.EquipmentsCode && item.EquipmentsCode.trim() !== '') {  
        console.log('✅ Serial item selected:', item); 
      }
      else {
      console.warn('⚠️ This item has no serial or Equipments Code is empty:', item);
      this.toastr.warning(`Equipment with item code (${item.ItemCode}) is serial-based & missing Equipment Code. Please alot equipment code first using stock register.`);
        }
    }
  }
  async confirmSubmitNew() {
  const selectedItems = this.ItemsDataList.filter((x: any) => x.Selected);

    if (selectedItems.length === 0) {
      this.toastr.warning("Please select at least one item to return.", "Warning", {
        toastClass: "ngx-toastr my-warning-toast"
      });
      return;
    }
    if (!this.FileName || this.FileName.trim() === '') {
      this.isFileError = true;
      this.toastr.error('Please upload document');
      return;
    }
    this.selectedDataList = this.ItemsDataList.filter((item:any) => item.Selected);
    this.selectedDataList = this.ItemsDataList .filter((item: any) => item.Selected).map((item: any) => ({
      ...item,
      StaffId: this.staff_ID,
      InstituteID : this.sSOLoginDataModel.InstituteID,
      EndTermID : this.sSOLoginDataModel.EndTermID,
      RoleID : this.sSOLoginDataModel.RoleID,  
      FileName : this.FileName, 
      Dis_FileName : this.Dis_FileName,
    }));
    console.table(this.selectedDataList); 
    await this.confirmSubmit(this.selectedDataList); 
  }
  async confirmSubmit(arr: any,) {
    

    this.loaderService.requestStarted();
    this.isLoading = true;
    this.submitRequest.TradeId=this.TradeId,
    this.submitRequest.StaffId = this.staff_ID,
    this.submitRequest.InstituteID = this.sSOLoginDataModel.InstituteID,
    this.submitRequest.EndTermID = this.sSOLoginDataModel.EndTermID,
    this.submitRequest.RoleID = this.sSOLoginDataModel.RoleID,
    this.submitRequest.StaffId = this.Searchrequests.staffID, 
    this.submitRequest.ItemList = arr; 
    this.submitRequest.FileName = this.FileName;
    this.submitRequest.StreamID=this.Searchrequests.StreamID || 0;
    this.submitRequest.LabID=this.Searchrequests.LabID || 0;
 
    console.log('arr: '+arr);
    try {
      await this.bterInventoryService.GetDTEIssueSubmitPermanent(this.submitRequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success)
          {
            this.toastr.success("Items issued successfully", "", {
              toastClass: "ngx-toastr my-update-toast"
            });
            this.BindItem_list();
            //this.GetAllData();
           // this.CloseModalPopup();
          } else if (this.State == EnumStatus.Error)
          {
            this.toastr.error("Something went wrong.");
          }
        });

      this.modalService.dismissAll();
    } catch (ex) {
      console.error(ex);
      this.toastr.error('Something went wrong. Please try again.');
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }
  async GetAllDataIssuedItems() {
    
    try {
      this.loaderService.requestStarted();

      this.Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequests.TradeId = this.Searchrequests.TradeId;
      this.Searchrequests.staffID = this.Searchrequests.staffID;
      this.Searchrequests.actionName='GetIssueItemList';
      this.Searchrequests.ReturnStatus = 0;
     // this.Searchrequest.staffID = 1;

      await this.bterInventoryService.GetAllInventoryIssueReturnItemList(this.Searchrequests)
        .then((data: any) => {
          if (data) {
            this.State = data.State;
            this.Message = data.Message;
            this.ErrorMessage = data.ErrorMessage;
            this.ItemMasterList = data.Data || [];
            this.ItemMasterList1 = data.Data || [];
          } else {
            console.error("No data returned from API");
          }
        }, error => console.error(error));
      console.log('Item Master List ',this.ItemMasterList)
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async ShowIssuedItemsList(content: any, itemId:any,staffId:any) {
    
     await this.GetAllDataIssuedItems();

    this.modalReference = this.modalService.open(content, {backdrop: 'static', size: 'xl', keyboard: true,centered: true});

    return;
  }
}
