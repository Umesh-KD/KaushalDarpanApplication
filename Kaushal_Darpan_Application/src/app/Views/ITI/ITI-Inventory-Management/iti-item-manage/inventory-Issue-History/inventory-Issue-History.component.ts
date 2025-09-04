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
import { inventoryIssueHistorySearchModel } from '../../../../../Models/DTEInventory/DTEItemsDataModels';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../../Common/appsetting.service';
import { ToastrService } from 'ngx-toastr';
import { ITIInventoryService } from '../../../../../Services/ITI/ITIInventory/iti-inventory.service';


@Component({
  selector: 'app-inventory-Issue-History',
  templateUrl: './inventory-Issue-History.component.html',
  styleUrls: ['./inventory-Issue-History.component.css'],
  standalone: false
})
export class inventoryIssueHistoryComponent {
  public Searchrequest = new inventoryIssueHistorySearchModel()
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
  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private itiInventoryService: ITIInventoryService) { }

  async ngOnInit() {

    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;    
    
    await this.GetAllData();
    await this.GetTradeDDL();
    await this.GetCategoryDDL();
    await this.GetStaffDDL();
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();

      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.TradeId = this.Searchrequest.TradeId;
      

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


  //async GetStaffDDL() {
  //  debugger
  //  try {
  //    this.loaderService.requestStarted();

  //    this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
  //    this.Searchrequest.TypeName = 'staffList';

  //    const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);
  //    if (data && data.State === EnumStatus.Success) {
  //      this.staffDDLList = data.Data;   //  Bind staff list
  //      console.log('staff list ==>', this.staffDDLList);
  //    } else {
  //      this.staffDDLList = [];
  //      this.toastr.error(data?.ErrorMessage || 'No staff found.');
  //    }
  //  }
  //  catch (Ex) {
  //    console.error('Error in GetStaffDDL:', Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  //async GetTradeDDL() {
  //  debugger
  //  try {
  //    this.loaderService.requestStarted();
  //    this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
  //    this.Searchrequest.TypeName = 'TradeList';

  //    await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.TradeDDLList = data['Data'];
  //        console.log('Trade list ==>', this.TradeDDLList);
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async GetCategoryDDL() {
  //  debugger
  //  try {
  //    this.loaderService.requestStarted();
  //    this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
  //    this.Searchrequest.TypeName = 'ItemList';
  //    this.Searchrequest.TradeId = this.Searchrequest.TradeId;


  //    await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.CategoryDDLList = data['Data'];
  //        console.log('category List ==>', this.CategoryDDLList);
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async GetStaffDDL() {
  //  debugger
  //  try {
  //    this.loaderService.requestStarted();
  //    this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
  //    this.Searchrequest.TypeName = 'staffList';

  //    const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);
  //    if (data && data.State === EnumStatus.Success) {
  //      this.staffDDLList = data.Data;
  //      console.log('staff list ==>', this.staffDDLList);

  //      // Auto-select first staff if available
  //      if (this.staffDDLList.length > 0) {
  //        this.Searchrequest.staffID = this.staffDDLList[0].staffID;
  //        await this.GetTradeDDL(); // load trades for selected staff
  //      }
  //    } else {
  //      this.staffDDLList = [];
  //      this.toastr.error(data?.ErrorMessage || 'No staff found.');
  //    }
  //  } catch (Ex) {
  //    console.error('Error in GetStaffDDL:', Ex);
  //  } finally {
  //    setTimeout(() => this.loaderService.requestEnded(), 200);
  //  }
  //}

  //async GetStaffDDL() {
  //  debugger
  //  try {
  //    this.loaderService.requestStarted();
  //    this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
  //    this.Searchrequest.TypeName = 'staffList';

  //    const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);

  //    if (data && data.State === EnumStatus.Success) {
  //      this.staffDDLList = [
  //        { staffID: 0, staffName: '--Choose Staff--' },
  //        ...data.Data
  //      ];

  //      // Set default selected value = 0
  //      this.Searchrequest.staffID = 0;
  //      console.log('staff list ==>', this.staffDDLList);
  //    } else {
  //      this.staffDDLList = [{ staffID: 0, staffName: '--Choose Staff--' }];
  //      this.Searchrequest.staffID = 0;
  //      this.toastr.error(data?.ErrorMessage || 'No staff found.');
  //    }
  //  } catch (Ex) {
  //    console.error('Error in GetStaffDDL:', Ex);
  //  } finally {
  //    setTimeout(() => this.loaderService.requestEnded(), 200);
  //  }
  //}


  //async GetTradeDDL() {
  //  debugger
  //  try {
  //    this.loaderService.requestStarted();
  //    this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;

  //    this.Searchrequest.TypeName = 'TradeList';

  //    const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);
  //    if (data && data.State === EnumStatus.Success) {
  //      this.TradeDDLList = data.Data;
  //      console.log('Trade list ==>', this.TradeDDLList);

  //      // Auto-select first trade if available
  //      if (this.TradeDDLList.length > 0) {
  //        this.Searchrequest.collageTradeID = this.TradeDDLList[0].collageTradeID;
  //        await this.GetCategoryDDL(); //  load categories for selected trade
  //      }
  //    } else {
  //      this.TradeDDLList = [];
  //      this.toastr.error(data?.ErrorMessage || 'No trade found.');
  //    }
  //  } catch (Ex) {
  //    console.log('Error in GetTradeDDL:', Ex);
  //  } finally {
  //    setTimeout(() => this.loaderService.requestEnded(), 200);
  //  }
  //}

  //async GetCategoryDDL() {
  //  debugger
  //  try {
  //    this.loaderService.requestStarted();
  //    this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
  //    this.Searchrequest.TradeId = this.Searchrequest.TradeId;
  //    this.Searchrequest.TypeName = 'ItemList';

  //    const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);
  //    if (data && data.State === EnumStatus.Success) {
  //      this.CategoryDDLList = data.Data;
  //      console.log('category List ==>', this.CategoryDDLList);

  //      // Auto-select first category if available
  //      if (this.CategoryDDLList.length > 0) {
  //        this.Searchrequest.ItemId = this.CategoryDDLList[0].ItemId;
  //      }
  //    } else {
  //      this.CategoryDDLList = [];
  //      this.toastr.error(data?.ErrorMessage || 'No category found.');
  //    }
  //  } catch (Ex) {
  //    console.log('Error in GetCategoryDDL:', Ex);
  //  } finally {
  //    setTimeout(() => this.loaderService.requestEnded(), 200);
  //  }
  //}



  async GetStaffDDL() {
    debugger;
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
        console.log('staff list ==>', this.staffDDLList);
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
    debugger;
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
        console.log('Trade list ==>', this.TradeDDLList);
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
    debugger;
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
        console.log('category list ==>', this.CategoryDDLList);
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


}
