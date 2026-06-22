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
import { DTEItemsSaveModel, DTEItemsSearchModel, DTEItemsDataModels, inventoryIssueHistorySearchModel, ItemsIssueReturnModels, DTEItemsSearchModel1, DTELabMasterModel, } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
/*import { ITIInventoryService } from '../../../../Services/ITI/ITIInventory/iti-inventory.service';*/
import { DteItemsMasterService } from '../../../../Services/DTEInventory/DTEItemsMaster/dteitems-master.service';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { DeleteDocumentDetailsModel } from '../../../../Models/DeleteDocumentDetailsModel';
import { UploadBTERFileModel, UploadFileModel } from '../../../../Models/UploadFileModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { DTEItemCategoriesMasterService } from '../../../../Services/DTEInventory/DTEItemCategoriesMaster/dteItemcategories-master.service';
import { DTEEquipmentsMasterService } from '../../../../Services/DTEInventory/DTEEquipmentsMaster/dteequipments-master.service';
import { DTESearchTradeEquipmentsMapping } from '../../../../Models/DTEInventory/DTETradeEquipmentsMappingData';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-bter-issue-all-items-master',
  templateUrl: './bter-issue-all-items.component.html',
  styleUrls: ['./bter-issue-all-items.component.css'],
  standalone: false
})
export class AddBterIssueAllItemComponent {
  public Searchrequest = new DTESearchTradeEquipmentsMapping()
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
  public staff_ID: number = 0;
  public ItemMasterList: any = [];
  public ItemMasterList1: any = [];
  public IssuedItemList: any = [];
  isFileError: boolean = false;
  consumableIndentNo: string = '';
  public CollegeDDLList: any = [];
  public EquipmentsDDLList: any = [];
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
    private itemCategoriesService: DTEItemCategoriesMasterService,
    private equipmentsService: DTEEquipmentsMasterService,
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

    await this.GetAllDataIssuedItems();
    await this.GetCategoryDDL();
    await this.GetEquipmentDDL();
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

  async GetByID(id: number) {


  }

  getCategoryNameById(id: any): string {
    const selectedCategory = this.CategoryDDLList.find((item: any) => item.ID === id);
    return selectedCategory ? selectedCategory.Name : '';
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

  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequests = new inventoryIssueHistorySearchModel();
    this.Searchrequest = new DTESearchTradeEquipmentsMapping()
    this.AddItemsRequestFormGroup.reset({
      EquipmentsId: 0,
      ItemCategoryId: 0
    });

    this.ItemsDDLList = [];
    this.GetAllDataIssuedItems();
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
      //this.GetStaffDDL();
      //this.GetCategoryDDL();
    } else if (this.Searchrequests.issuedTo == 3) {
      // Department → load department list
      this.GetDepartmentDDL();
    } else if (this.Searchrequests.issuedTo == 1) {
      // Office → no dropdowns, only search
      this.ItemsDDLList = []; // ready for office search
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
          console.log("Bind  Item  list", this.ItemsDDLList)
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

  removeSelectedItem(index: number) {
    const removedItem = this.SelectedItems[index];
    this.SelectedItems.splice(index, 1);
  }


  cancelSelection() {
    this.SelectedItems = [];
  }
  validateQuantity(item: any) {
    // Find the original item from ItemsDDLList
    const original = this.ItemsDDLList.find((x: any) => x.ItemId === item.ItemId);

    if (original) {
      const availableQty = original.Quantity;

      if (item.Quantity > availableQty) {
        this.toastr.warning(`You can’t enter more than available quantity (${availableQty}).`);
        item.Quantity = availableQty; // Reset to max allowed
      } else if (item.Quantity < 1) {
        this.toastr.warning('Quantity must be at least 1.');
        item.Quantity = 1;
      }
    }
  }

  async GetAllDataIssuedItems() {
    debugger
    try {
      this.loaderService.requestStarted();

      this.Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequests.TradeId = this.Searchrequests.TradeId;
      this.Searchrequests.staffID = this.Searchrequests.staffID;
     
      this.Searchrequests.actionName = 'GetIssueItemList';
      this.Searchrequests.ReturnStatus = 0;
     
      await this.bterInventoryService.GetInventoryAllIssueItemList(this.Searchrequests)
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
      console.log('Item Master List ', this.ItemMasterList)
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
  async ShowIssuedItemsList(content: any, itemId: any, staffId: any) {

    await this.GetAllDataIssuedItems();

    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });

    return;
  }

  async GetEquipmentDDL() {
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      await this.equipmentsService.GetAllData(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.EquipmentsDDLList = data['Data'];
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
  async GetCategoryDDL() {
    try {
      this.loaderService.requestStarted();
      await this.itemCategoriesService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryDDLList = data['Data'];
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

  exportToExcel(): void {

    if (!this.ItemMasterList || this.ItemMasterList.length === 0) {
      this.toastr.warning("No data available to export.");
      return;
    }
    const unwantedColumns = ['ConditionOnReturn', 'IsConsumable', 'ItemDetailsId', 'InvStatus',];
    const filteredData = this.ItemMasterList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Issue Items');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `Inventory_All_Issues_Items_Report_${timestamp}.xlsx`);
  }

  exportToPdf(): void {

    if (!this.ItemMasterList || this.ItemMasterList.length === 0) {
      this.toastr.warning("No data available to export.");
      return;
    }

    const unwantedColumns = [
      'ConditionOnReturn',
      'IsConsumable',
      'ItemDetailsId',
      'InvStatus'
    ];

    const filteredData = this.ItemMasterList.map((item: any) => {
      const filteredItem: any = {};

      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });

      return filteredItem;
    });

    const doc = new jsPDF('landscape');

    doc.setFontSize(14);
    doc.text('Inventory All Issues Items Report', 14, 15);

    const headers = [Object.keys(filteredData[0])];

    const rows = filteredData.map((item: any) =>
      Object.values(item)
    );

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 25,
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: [41, 128, 185]
      }
    });

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');

    doc.save(`Inventory All Issues Items Report_${timestamp}.pdf`);
  }

}
