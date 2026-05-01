import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { inventoryIssueHistorySearchModel, itemReturnModel, ItemsIssueReturnModels } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DteItemsMasterService } from '../../../../Services/DTEInventory/DTEItemsMaster/dteitems-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-return-lab-item',
  standalone: false,
  templateUrl: './return-lab-item.component.html',
  styleUrl: './return-lab-item.component.css'
})
export class ReturnLabItemComponent {
  public Searchrequest = new inventoryIssueHistorySearchModel()
  public returnModel = new itemReturnModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public SearchRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public ItemMasterList: any = [];
  public ItemMasterList1: any = [];
  public CategoryDDLList: any = [];
  public TradeDDLList: any = [];
  public staffDDLList: any = [];
  public ItemId: number = 0;
  public UserID: number = 0;
  public returnItemTypeList: any = [];
  public submitRequest = new ItemsIssueReturnModels();
  public ItemsDDL: any = [];
  public ItemsDDLList: any = [];
  public departmentDDLList: any = [];
  public StreamMasterList: any = [];
  public ItemDetailsList: any[] = [];
  public selectedItemMasterList: any[] = [];

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private loaderService: LoaderService,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private bterInventoryService: DteItemsMasterService,
    private modalService: NgbModal,
    private commonMasterService: CommonFunctionService,
    private dteItemsMasterService: DteItemsMasterService,
  ) { }

  async ngOnInit() {

    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;

    await this.GetAllData();
    await this.GetTradeDDL();
    await this.GetCategoryDDL();
    await this.GetStaffDDL();
    await this.GetAllItemTypeList();

  }

  async GetAllData() {
    ;
    try {
      this.loaderService.requestStarted();

      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.staffID = this.Searchrequest.staffID;
      if(this.sSOLoginDataModel.RoleID === EnumRole.BterLabIncharge) {
        this.Searchrequest.UserID = this.sSOLoginDataModel.UserID;
        this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      }
      await this.bterInventoryService.GetIssueItemList(this.Searchrequest)
        .then((data: any) => {
          if (data) {
            this.State = data.State;
            this.Message = data.Message;
            this.ErrorMessage = data.ErrorMessage;
            this.ItemMasterList = data.Data || [];
          } else {
            console.error("No data returned from API");
          }
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

  async GetAllItemDetails() {
    
    if (this.ItemId != null && this.ItemId != undefined && this.ItemId > 0) {
      await this.dteItemsMasterService.GetAllDTEItemDetails(this.ItemId).then((data: any) => {
        
        console.log('Item Details List==>', data)
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          console.log('Item Details List==>', data.data)
          this.ItemDetailsList = data.Data;

        }
        console.log('Item Details List==>', this.ItemDetailsList)
      });
    }
  }

  
  async GetStaffDDL() {
  try {
    this.loaderService.requestStarted();
    this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.Searchrequest.TypeName = 'staffList';

    const data: any = await this.bterInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);

    if (data && data.State === EnumStatus.Success) {
      this.staffDDLList = [
        { staffID: 0, staffName: 'Choose Staff' },
        ...data.Data
      ];
      this.Searchrequest.staffID = 0;
    } else {
      this.staffDDLList = [{ staffID: 0, staffName: 'Choose Staff' }];
      this.Searchrequest.staffID = 0;
      this.toastr.error(data?.ErrorMessage || 'No staff found.');
    }
  } catch (Ex) {
    console.error('Error in GetStaffDDL:', Ex);
  } finally {
    setTimeout(() => this.loaderService.requestEnded(), 200);
  }
}

  async GetTradeDDL() {

    try {
      this.loaderService.requestStarted();
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.TypeName = 'TradeList';

      const data: any = await this.bterInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);

      if (data && data.State === EnumStatus.Success) {
        this.TradeDDLList = [
          { TradeId: 0, TradeName: 'Choose Trade' },
          ...data.Data
        ];

        this.Searchrequest.TradeId = 0;
      } else {
        this.TradeDDLList = [{ TradeId: 0, TradeName: 'Choose Trade' }];
        this.Searchrequest.TradeId = 0;
        this.toastr.error(data?.ErrorMessage || 'No trade found.');
      }
    } catch (Ex) {
      console.log('Error in GetTradeDDL:', Ex);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  async GetCategoryDDL() {
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.TypeName = 'ItemList';

      const data: any = await this.bterInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);

      if (data && data.State === EnumStatus.Success) {
        this.CategoryDDLList = [
          { ItemId: 0, ItemCategoryName: 'Choose Category' },
          ...data.Data
        ];

        this.Searchrequest.ItemId = 0;
      } else {
        this.CategoryDDLList = [{ ItemId: 0, ItemCategoryName: 'Choose Category' }];
        this.Searchrequest.ItemId = 0;
        this.toastr.error(data?.ErrorMessage || 'No category found.');
      }
    } catch (Ex) {
      console.log('Error in GetCategoryDDL:', Ex);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequest = new inventoryIssueHistorySearchModel();
    await this.GetAllData();
  }

  exportToExcel(): void {
    
    if (!this.ItemMasterList || this.ItemMasterList.length === 0) {
      this.toastr.warning("No data available to export.");
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ItemMasterList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `Inventory_Items_Report_${timestamp}.xlsx`);
  }

  DownloadFile(FileName: string, DownloadfileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName);
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  toggleAll(event: any) {
    const checked = event.target.checked;
    this.ItemMasterList.forEach((item: any) => {
      if(item.Status_LabIncharge == 0) {
        item.Selected = checked
      }
    });
  }

  openReturnModal(content: any) {
    const selectedItems = this.ItemMasterList.filter((x: any) => x.Selected);

    if (selectedItems.length === 0) {
      this.toastr.warning("Please select at least one item to return.", "Warning", {
        toastClass: "ngx-toastr my-warning-toast"
      });
      return;
    }
    this.returnModel = {
      ItemCount: selectedItems.length,
      ItemCondition: 0,
      staffID: 0,
      ReturnDate: '',
      Remarks: '',
      ItemList: '',
      ItemDetailsId: 0,
      TransactionID: 0,
      Type: ''
    };

    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  async confirmReturnNew() {
    const selectedItems = this.ItemMasterList.filter((x: any) => x.Selected);
      if (selectedItems.length === 0) {
        this.toastr.warning("Please select at least one item to return.", "Warning", {
          toastClass: "ngx-toastr my-warning-toast"
        });
        return;
      }
        this.selectedItemMasterList = this.ItemMasterList.filter((item:any) => item.Selected);
      console.table(this.selectedItemMasterList);
      await this.confirmReturn(this.selectedItemMasterList);
      
  }


  async confirmReturn(arr: any) {
    this.Swal2.Confirmation("Are you sure you want to Update selected items?", async (result: any) => {
      if (result.isConfirmed) {
        try {
          this.loaderService.requestStarted();
          this.isLoading = true;

          this.submitRequest.StaffId = this.Searchrequest.staffID;
          this.submitRequest.Remarks = this.returnModel.Remarks || "";
          this.submitRequest.ItemCategoryId = 0;
          this.submitRequest.ReturnDate = this.returnModel.ReturnDate;
          this.submitRequest.ConditionAtReturn = this.returnModel.ItemCondition || 0;
          this.submitRequest.ItemList = arr;
          this.submitRequest.SelectedCount = arr.length;
          this.submitRequest.RoleID = this.sSOLoginDataModel.RoleID
          
          console.log("Returning items:", this.submitRequest);

          const data: any = await this.bterInventoryService.DTE_INV_SaveLabItemReturn(this.submitRequest);
          const state = data?.State;
          const message = data?.Message;
          const errorMessage = data?.ErrorMessage;
          console.log("errorMessage:"+errorMessage)
          ;
          if (state === EnumStatus.Success) {
            this.toastr.success(message || "Items returned successfully", "", {
              toastClass: "ngx-toastr my-update-toast",
            });
            this.GetAllData();
            this.modalService.dismissAll();
          } else {
            this.toastr.error(errorMessage || "Something went wrong while returning items.");
          }
        } catch (ex) {
          console.error("Error in confirmReturn:", ex);
          this.toastr.error("Unexpected error. Please try again later.");
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isLoading = false;
          }, 200);
        }
      }
    });
  }


  async GetAllItemTypeList() {
    try {
      this.loaderService.requestStarted();
      const response: any = await this.commonMasterService.GetCommonMasterDDLByType('BterItemConditions');
      if (response && response.Data) {
        this.returnItemTypeList = response.Data;
        this.returnModel.ItemCondition = this.returnItemTypeList[0].ID.toString();
      }
        
      console.log('Default selected ==>', this.returnModel.ItemCondition);
    } catch (ex) {
      console.error('Error fetching item type list:', ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  openDatePicker(event: any) {
    event.target.showPicker();
  }


  onIssuedToChange() {
    this.Searchrequest.staffID = 0;
    this.Searchrequest.ItemCategoryId = 0;
    this.Searchrequest.ItemId = 0;
    this.Searchrequest.departmentID = 0;

    if (this.Searchrequest.IssuedId == 2) {
      this.GetStaffDDL();
    }
    else if (this.Searchrequest.IssuedId == 3) {
      this.GetMasterData();
    }
    else if (this.Searchrequest.IssuedId == 1) {
      this.staffDDLList = [{ staffID: 0, staffName: 'Choose Staff' }];
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
      this.Searchrequest.StreamID = 0;
      console.log('Stream Master List', this.StreamMasterList)
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
}
