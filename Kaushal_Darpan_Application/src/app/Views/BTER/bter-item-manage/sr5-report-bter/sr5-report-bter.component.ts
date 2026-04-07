import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { inventoryIssueHistorySearchModel } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DteItemsMasterService } from '../../../../Services/DTEInventory/DTEItemsMaster/dteitems-master.service';
import { DTELaboratoryMasterService } from '../../../../Services/DTEInventory/DTELaboratoryMaster/dtelaboratory-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sr5-report-bter',
  standalone: false,
  templateUrl: './sr5-report-bter.component.html',
  styleUrl: './sr5-report-bter.component.css'
})
export class SR5ReportBTERComponent {
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
  public LabDetailsData: any = [];
  public ItemId: number = 0;
  public UserID: number = 0;
  public today: Date = new Date();
  public ItemStatus: number = 0;
  public AllInTableSelect: boolean = false;
  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private bterInventoryService: DteItemsMasterService,
    private modalService: NgbModal,
    private commonMasterService: CommonFunctionService,
    private LaboratoryMasterService: DTELaboratoryMasterService,
  ) { }

  async ngOnInit() {
    // Check if the current route is 'bter-staff-inventory-details'
    
    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;    
    await this.GetTradeDDL();
    await this.GetCategoryDDL();
    await this.GetStaffDDL();
    await this.GetAllData();
    
  }

  async GetAllData() {    
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.TradeId = this.Searchrequest.TradeId;
      this.Searchrequest.staffID = this.Searchrequest.staffID;
      
      if(this.sSOLoginDataModel.RoleID === EnumRole.BterLabIncharge){
        this.Searchrequest.UserID = this.sSOLoginDataModel.UserID;
        this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      }
      await this.bterInventoryService.Get_SR5_ReportData(this.Searchrequest)
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

      const data: any = await this.bterInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);

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

      const data: any = await this.bterInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequest);

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
    this.ItemMasterList.forEach((item: any) => {
      if(item.ConditionOnReturn == 2 && item.IsOption == false) {
        item.Selected = checked
      }
    });
  }

  async MarkForAuction () {
    const selected = this.ItemMasterList.filter((x: any) => x.Selected);
    if (selected.length === 0) {
      this.toastr.warning("Please select at least one item to mark for auction.", "Warning", {
        toastClass: "ngx-toastr my-warning-toast"
      });
      return;
    }
    
    try {
      await this.bterInventoryService.MarkForAuctionSR6(selected).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message, 'Success', {
              toastClass: 'ngx-toastr my-success-toast'
            });
            await this.GetAllData();
          } else {
            this.toastr.error(data.ErrorMessage, 'Error', {
              toastClass: 'ngx-toastr my-error-toast'
            });
          }
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async Download_SR5ReportData_pdf_BTER() {
    try {
      this.loaderService.requestStarted();

      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.UserID = this.sSOLoginDataModel.UserID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.Searchrequest.TradeId = this.Searchrequest.TradeId;
      this.Searchrequest.staffID = this.Searchrequest.staffID;
      this.Searchrequest.ReturnStatus = 2; // for all data
     // this.Searchrequest.staffID = 1;

      await this.bterInventoryService.Download_SR5ReportData_pdf_BTER(this.Searchrequest)
        .then((data: any) => {
          if (data) {
            this.DownloadFile_sr5(data.Data);
            console.log(this.ItemMasterList);
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

  DownloadFile_sr5(FileName: string): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
    //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.ItemMasterList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
   selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.ItemMasterList.filter((x: any) => x.IssuedId == item.IssuedId);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.ItemMasterList.every((r: any) => r.Selected);
  }
  get totalInTableSelected(): number {
    return this.ItemMasterList.filter((x: any) => x.Selected)?.length;
  }
  async ApproveSR5Items() {
      try {
        let selected = this.ItemMasterList.filter((x: any) => x.Selected);
        if (selected.length === 0) {
          this.toastr.warning("Please select at least one item to mark for approval.", "Warning", {
            toastClass: "ngx-toastr my-warning-toast"
          });
          return;
        }
  
        if(this.ItemStatus == 0){
          this.toastr.warning("Please select status.", "Warning", {
            toastClass: "ngx-toastr my-warning-toast"
          });
          return;
        }
  
        selected.forEach((x: any) => {
          x.UserID = this.sSOLoginDataModel.UserID 
          x.IssueStatus = this.ItemStatus
        })
  
        if(this.ItemStatus == 3) {
          selected.forEach((x: any) => {
            x.ApproveIssueQuantity = 0
          });
        }
  
        await this.bterInventoryService.ApproveSR5Items(selected).then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message, 'Success', {
              toastClass: 'ngx-toastr my-success-toast'
            });
            await this.GetAllData();
          } else {
            this.toastr.error(data.ErrorMessage, 'Error', {
              toastClass: 'ngx-toastr my-error-toast'
            });
          }
        })
      } catch (error) {
        console.error(error);
      }
    }
}
