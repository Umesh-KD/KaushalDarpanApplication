import { Component } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../../Common/GlobalConstants';
import { FormGroup } from '@angular/forms';
import { SweetAlert2 } from '../../../../../Common/SweetAlert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { ITITradeSearchModel } from '../../../../../Models/ITITradeDataModels';
import { ItemsDataModels, ItemsSearchModel } from '../../../../../Models/ItemsDataModels';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { inventoryIssueHistorySearchModel, itemReturnModel, DTEItemsSearchModel } from '../../../../../Models/DTEInventory/DTEItemsDataModels';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../../Common/appsetting.service';
import { ToastrService } from 'ngx-toastr';
import { ITIInventoryService } from '../../../../../Services/ITI/ITIInventory/iti-inventory.service';


@Component({
  selector: 'app-iti-add-items-master',
  templateUrl: './iti-return-item.component.html',
  styleUrls: ['./iti-return-item.component.css'],
  standalone: false
})
export class AddItiReturnItemComponent {
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
  //public StudentReqListList: any = [];
  public returnItemTypeList: any = [];
  //public today: Date = new Date();

  

  //ItemMasterListt = [
  //  {
  //    Selected: false,
  //    Name: 'Ramesh',
  //    ItemCode: 'ITM001',
  //    Quantity: 5,
  //    IssueDate: new Date(),
  //    DueDate: new Date(),
  //    ReturnDate: new Date(),
  //    Status: 'Issued'
  //  },
  //  {
  //    Selected: false,
  //    Name: 'Suresh',
  //    ItemCode: 'ITM002',
  //    Quantity: 2,
  //    IssueDate: new Date(),
  //    DueDate: new Date(),
  //    ReturnDate: new Date(),
  //    Status: 'Returned'
  //  },
  //  {
  //    Selected: false,
  //    Name: 'Naresh',
  //    ItemCode: 'ITM003',
  //    Quantity: 3,
  //    IssueDate: new Date(),
  //    DueDate: new Date(),
  //    ReturnDate: new Date(),
  //    Status: 'Issued'
  //  }
  //];



  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private itiInventoryService: ITIInventoryService,
    private modalService: NgbModal,
    private commonMasterService: CommonFunctionService
  ) { }

  async ngOnInit() {

    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;

    await this.GetAllData();
    await this.GetTradeDDL();
    await this.GetCategoryDDL();
    await this.GetStaffDDL();
    await this.GetAllItemTypeList()
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();

      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.TradeId = this.Searchrequest.TradeId;
      this.Searchrequest.staffID = this.Searchrequest.staffID;


      await this.itiInventoryService.GetAllinventoryIssueHistory(this.Searchrequest)
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

  async GetStaffDDL() {

    try {
      this.loaderService.requestStarted();
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.TypeName = 'staffList';

      const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);

      if (data && data.State === EnumStatus.Success) {
        this.staffDDLList = [
          { staffID: 0, staffName: 'Choose Staff' },
          ...data.Data
        ];

        this.Searchrequest.staffID = 0;
        // console.log('staff list ==>', this.staffDDLList);
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

      const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);

      if (data && data.State === EnumStatus.Success) {
        this.TradeDDLList = [
          { TradeId: 0, TradeName: 'Choose Trade' },
          ...data.Data
        ];

        this.Searchrequest.TradeId = 0;
        // console.log('Trade list ==>', this.TradeDDLList);
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

      const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);

      if (data && data.State === EnumStatus.Success) {
        this.CategoryDDLList = [
          { ItemId: 0, ItemCategoryName: 'Choose Category' },
          ...data.Data
        ];

        this.Searchrequest.ItemId = 0;
        //console.log('category list ==>', this.CategoryDDLList);
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
    this.ItemMasterList1 = this.ItemMasterList1.map((item: any) => {
      const updatedItem = {
        AvailableQuantity: item.AvailableQuantity,
        CampanyName: item.CampanyName,
        Code: item.Code,
        CollegeName: item.CollegeName ?? "BTER",
        EquipmentsName: item.EquipmentsName,
        IdentificationMark: item.IdentificationMark,
        InitialQuantity: item.InitialQuantity,
        ItemCategoryName: item.ItemCategoryName,
        PricePerUnit: item.PricePerUnit,
        Status: item.Status == 1 ? "Approved" : "Pending",
        TotalPrice: item.TotalPrice,
        VoucherNumber: item.VoucherNumber
      };

      return updatedItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ItemMasterList1);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Inventory_Items_Reports.xlsx');
  }

  DownloadFile(FileName: string, DownloadfileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
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
    this.ItemMasterList.forEach((item: any) => item.Selected = checked);
  }

  openReturnModal(content: any) {
    const selectedItems = this.ItemMasterList.filter((x: any) => x.Selected);

    if (selectedItems.length === 0) {
      alert("Please select at least one item to return.");
      return;
    }

    // set item count
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

  //async confirmReturn() {
  //  debugger

  //  const selectedItems = this.ItemMasterList.filter((x: any) => x.Selected);

  //  const returnModel = selectedItems.map((x: any) => ({
  //    StaffId: this.Searchrequest.staffID,
  //    ItemDetailsId: x.ItemDetailsId,
  //    Type: "Return",
  //    TransactionID: x.TransactionID  ,
  //    ItemList: x.ItemList
  //  }));

  //  try {
  //    await this.itiInventoryService.GetAll_INV_returnItem(this.returnModel)
  //      .then((data: any) => {
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (this.State == EnumStatus.Success) {
  //          if (!this.returnModel.staffID || this.returnModel.staffID == 0) {
  //            // Save
  //            this.toastr.success("Record saved successfully", "", {
  //              toastClass: "ngx-toastr my-save-toast"
  //            });
  //          } else {
  //            // Update
  //            this.toastr.success("Record updated successfully", "", {
  //              toastClass: "ngx-toastr my-update-toast"
  //            });
  //          }
  //          //redirect
  //          this.routers.navigate(['/iti-return-item']);


  //        } else if (this.State == EnumStatus.Error) {
  //          this.toastr.error("Something went wrong.");
  //        }

  //      });
  //    this.modalService.dismissAll();
  //  } catch (ex) {
  //    console.error(ex);
  //    this.toastr.error('Something went wrong. Please try again.');
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //      this.isLoading = false;
  //    }, 200);
  //  }
  //}

  async confirmReturn() {
    debugger;

    const selectedItems = this.ItemMasterList.filter((x: any) => x.Selected);

    if (selectedItems.length === 0) {
      this.toastr.warning("Please select at least one item to return.");
      return;
    }

    // Prepare payload for API
    const returnModel = {
      StaffId: this.Searchrequest.staffID,
      TransactionID: selectedItems[0].TransactionID, // assuming all items belong to same transaction
      Type: "ReturnItemUpdate",
      ItemList: JSON.stringify(
        selectedItems.map((x: any) => ({ ItemDetailsId: x.ItemDetailsId }))
      )
    };

    try {
      await this.itiInventoryService.GetAll_INV_returnItem(this.returnModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success("Items returned successfully", "", {
              toastClass: "ngx-toastr my-update-toast"
            });

            this.routers.navigate(['/iti-return-item']); // redirect
          } else if (this.State == EnumStatus.Error) {
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


  async GetAllItemTypeList() {
    try {
      this.loaderService.requestStarted();

      const response: any = await this.commonMasterService.GetCommonMasterDDLByType('ItemConditions');

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



}

