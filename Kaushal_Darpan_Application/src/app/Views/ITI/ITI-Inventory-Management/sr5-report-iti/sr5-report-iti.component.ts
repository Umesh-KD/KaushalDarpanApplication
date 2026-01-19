import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { inventoryIssueHistorySearchModel } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITIInventoryService } from '../../../../Services/ITI/ITIInventory/iti-inventory.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sr5-report-iti',
  standalone: false,
  templateUrl: './sr5-report-iti.component.html',
  styleUrl: './sr5-report-iti.component.css'
})
export class SR5ReportITIComponent {
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
  public today: Date = new Date();
  public IsStaff: boolean = false;

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

    if (this.routers.url.includes('iti-staff-inventory-details')) {
      this.IsStaff = true;
    }
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
      this.Searchrequest.UserID = this.sSOLoginDataModel.UserID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.Searchrequest.TradeId = this.Searchrequest.TradeId;
      this.Searchrequest.staffID = this.Searchrequest.staffID;
      this.Searchrequest.IsStaff = this.IsStaff;
      this.Searchrequest.ReturnStatus = 2; // for all data
     // this.Searchrequest.staffID = 1;

      await this.itiInventoryService.GetSR5ReportData_ITI_INV(this.Searchrequest)
        .then((data: any) => {
          if (data) {
            this.State = data.State;
            this.Message = data.Message;
            this.ErrorMessage = data.ErrorMessage;
            this.ItemMasterList = data.Data || [];
            this.ItemMasterList1 = data.Data || [];
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
    debugger
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
      downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  async Download_SR5ReportData_pdf() {
    try {
      this.loaderService.requestStarted();

      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.UserID = this.sSOLoginDataModel.UserID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.Searchrequest.TradeId = this.Searchrequest.TradeId;
      this.Searchrequest.staffID = this.Searchrequest.staffID;
      this.Searchrequest.IsStaff = this.IsStaff;
      this.Searchrequest.ReturnStatus = 2; // for all data
     // this.Searchrequest.staffID = 1;

      await this.itiInventoryService.Download_SR5ReportData_pdf(this.Searchrequest)
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
}
