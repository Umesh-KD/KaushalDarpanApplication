import { Component, Pipe, PipeTransform } from '@angular/core';
import { ItemsDataModels } from '../../../../../Models/ItemsDataModels';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../../Common/GlobalConstants';
import { ITITradeSearchModel } from '../../../../../Models/ITITradeDataModels';
import { DTEItemsSaveModel, DTEItemsSearchModel, DTEItemsDataModels,inventoryIssueHistorySearchModel, inventoryIssueHistoryITISearchModel, ItemsIssueReturnModels } from '../../../../../Models/DTEInventory/DTEItemsDataModels';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { ITIInventoryService } from '../../../../../Services/ITI/ITIInventory/iti-inventory.service';
import { DteItemsMasterService } from '../../../../../Services/DTEInventory/DTEItemsMaster/dteitems-master.service';
import { DocumentDetailsService } from '../../../../../Common/document-details';
import { DeleteDocumentDetailsModel } from '../../../../../Models/DeleteDocumentDetailsModel';
import { UploadBTERFileModel, UploadFileModel } from '../../../../../Models/UploadFileModel';
import { AppsettingService } from '../../../../../Common/appsetting.service';

@Component({
  selector: 'app-iti-add-items-master',
  templateUrl: './iti-issue-item.component.html',
  styleUrls: ['./iti-issue-item.component.css'],
  standalone: false
})
export class AddItiIssueItemComponent {
  public request = new ItemsDataModels()
  public searchTradeRequest = new ITITradeSearchModel();
  public searchRequest = new DTEItemsSearchModel();
  public submitRequest = new ItemsIssueReturnModels();
  public Searchrequests = new inventoryIssueHistoryITISearchModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public InstituteID: number = 0;
  public TradeId: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public AddItemsRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public Table_SearchText: string = "";
  public ItemsDDLList: any = [];
  public CatogaryDDLList: any = [];
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
  SelectedItems: any[] = [];
  public Dis_FileName: string = '';
  public FileName: string = '';
 AddItemList: DTEItemsSaveModel[] = [];
  public AllInTableSelect: boolean = false;
  constructor(
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private itiInventoryService: ITIInventoryService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private routers: Router) { }


  async ngOnInit() {

    this.AddItemsRequestFormGroup = this.formBuilder.group({

     
      ItemType: ['0', [DropdownValidators]],
      TradeId: ['-1', [DropdownValidators]],

    });

    /*this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());*/
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    this.InstituteID = this.sSOLoginDataModel.InstituteID;
    //await this.ddlStaffMembers();
    //await this.ddlTradeList();

    this.GetStaffDDL()
    this.GetTradeDDL()
    //this.GetCategoryDDL()



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
    debugger
    this.submitRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.submitRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.submitRequest.UserId = this.sSOLoginDataModel.UserID;
    this.isSubmitted = true;

    this.submitRequest.ItemList = this.ItemsDDLList.filter((x: any) => x.Selected);

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      await this.itiInventoryService.SaveIssueItems(this.submitRequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.modalService.dismissAll();
            //this.routers.navigate(['/inventory-Issue-History']);
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

    try {
      this.loaderService.requestStarted();

      await this.itiInventoryService.GetItemsMasterByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*this.request.TradeId = data['Data']["TradeId"];*/

      
          this.request.ItemCategoryId = data['Data']["ItemCategoryId"];
          this.AddItemsRequestFormGroup.get('ItemCategoryId')?.setValue(this.request?.ItemCategoryId);
        

          this.request.EquipmentsId = data['Data']["EquipmentsId"];
          this.AddItemsRequestFormGroup.get('EquipmentsId')?.setValue(this.request?.EquipmentsId);
          this.request.CampanyName = data['Data']["CampanyName"];
          
          this.request.IdentificationMark = data['Data']["IdentificationMark"];
          this.request.VoucherNumber = data['Data']["VoucherNumber"];
          this.request.Quantity = data['Data']["Quantity"];
          this.request.PricePerUnit = data['Data']["PricePerUnit"];
          this.request.TotalPrice = data['Data']["TotalPrice"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
          console.log('GetByID',data)
          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";


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



 
  async DGET_Details() {
    
    try {
      this.loaderService.requestStarted();
      debugger
      //if (!TradeId || TradeId === 0) {
      //  this.EquipmentsDDLList = [{ EquipmentsId: 0, Name: '--Select--' }];
      //  this.AddItemsRequestFormGroup.get('EquipmentsId')?.setValue(0);
      //  return;
      //}

      this.searchRequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.EquipmentsId = this.Searchrequests.ItemId;
      //this.searchRequest.ActionType="GetConsumeItemListNew";
      await this.itiInventoryService.GetConsumeItemListNew(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ItemsDDLList = data.Data;
            console.log(this.ItemsDDLList);


        }, error => console.error(error));
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
    debugger;

    const anyTeamSelected = this.ItemsDDLList.some((x: any) => x.Selected);
    if (!anyTeamSelected) {
      this.toastr.error("Please select at least one Item!");
      return;
    }

    if (this.Searchrequests.staffID == 0) {
      this.toastr.error("Please select at least one Staff!");
      return;
    }

  

    this.submitRequest.StaffName = this.staffDDLList.find((x: any) => x.staffID == this.Searchrequests.staffID)?.staffName || '';
    this.submitRequest.StaffId = this.Searchrequests.staffID;
    this.submitRequest.TradeId = this.Searchrequests.TradeId;
    this.submitRequest.ItemId = this.Searchrequests.ItemId;
    this.submitRequest.Quantity = this.ItemsDDLList.filter((x: any) => x.Selected).length;



    this.modalReference = this.modalService.open(content, {backdrop: 'static', size: 'lg', keyboard: true,centered: true});

    return;
  }


  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequests = new inventoryIssueHistoryITISearchModel();
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
    debugger;
    try {
      this.loaderService.requestStarted();
      this.Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequests.TypeName = 'staffList';

      const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequests);

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

  async GetTradeDDL() {
    debugger;
    try {
      this.loaderService.requestStarted();
      this.Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequests.TypeName = 'TradeList';

      const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequests);

      if (data && data.State === EnumStatus.Success) {
        this.TradeDDLList = [
          { TradeId: 0, TradeName: 'Choose Trade' },
          ...data.Data
        ];

        this.Searchrequests.TradeId = 0;
        console.log('Trade list ==>', this.TradeDDLList);
      } else {
        this.TradeDDLList = [{ TradeId: 0, TradeName: 'Choose Trade' }];
        this.Searchrequests.TradeId = 0;
        this.toastr.error(data?.ErrorMessage || 'No trade found.');
      }
    } catch (Ex) {
      console.log('Error in GetTradeDDL:', Ex);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  async GetCategoryDDL() {
    debugger;
    try {
      this.loaderService.requestStarted();
      this.Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      
      this.Searchrequests.TypeName = 'ItemList';

      const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDLNew(this.Searchrequests);

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
  onItemToggle(item: any) {
    debugger
    if (item.Selected) {
      // Add if not already present
      if (!this.SelectedItems.find(x => x.ItemDetailsId === item.ItemDetailsId)) {
        this.SelectedItems.push({
          ItemId: item.ItemId,
          ItemName: item.CampanyName,
          ItemCategoryName: item.ItemCategoryName,
          Quantity: 1, // default,
          FileName: item.FileName || '',
          Dis_FileName: item.Dis_FileName || '',
          EquipmentsId: item.EquipmentsId,
          issuedTo: item.IssueTo,
          ItemCategoryId: item.ItemCategoryId,
          ItemDetailsId: item.ItemDetailsId,
        });
        this.FileName = ''
        this.Dis_FileName = ''
      }
    } else {
      // Remove if unchecked
      this.SelectedItems = this.SelectedItems.filter(x => x.ItemId !== item.ItemId);
    }
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
  async saveSelectedItems() {
      debugger
      if (!this.SelectedItems || this.SelectedItems.length === 0) {
        this.toastr.error("Please select at least one item!");
        return;
      }
  
      this.SelectedItems.forEach((element: any) => {
        element.FileName = this.FileName, element.Dis_FileName = this.Dis_FileName,
          element.InstituteID = this.sSOLoginDataModel.InstituteID,
          element.EndTermID = this.sSOLoginDataModel.EndTermID,
          element.RoleID = this.sSOLoginDataModel.RoleID,
          element.StaffId = this.Searchrequests.staffID,
          //element.itemCategoryId = this.Searchrequests.itemCategoryId,
          element.itemCategoryId = this.Searchrequests.ItemCategoryId
          || 0;
  
          
          element.issuedTo = this.Searchrequests.issuedTo && this.Searchrequests.issuedTo > 0
            ? this.Searchrequests.issuedTo
            : null; 
          element.EquipmentsId = element.EquipmentsId || this.Searchrequests.ItemId || 0;
          element.ItemDetailsId = element.ItemDetailsId || this.Searchrequests.ItemDetailsId || 0;
      });
  
      this.AddItemList = this.SelectedItems
       console.log(this.AddItemList);
      try {
        this.loaderService.requestStarted();
  
        await this.itiInventoryService.SaveIssueItemsList(this.AddItemList).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.AddItemList = [];
  
  
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
              ,ItemDetailsId:0
            };
            this.FileName = '';
            this.Dis_FileName = '';
            this.ItemsDDLList = [];
            if (this.AddItemsRequestFormGroup) {
              this.AddItemsRequestFormGroup.reset();
            }
            this.routers.navigate(['/iti-issue-item'], {
  
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
}
