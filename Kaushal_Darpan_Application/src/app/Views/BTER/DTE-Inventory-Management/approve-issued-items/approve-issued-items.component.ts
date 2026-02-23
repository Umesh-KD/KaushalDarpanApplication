import { Component } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { FormGroup } from '@angular/forms';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { inventoryIssueHistorySearchModel } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ToastrService } from 'ngx-toastr';
import { DteItemsMasterService } from '../../../../Services/DTEInventory/DTEItemsMaster/dteitems-master.service';
import { DTELaboratoryMasterService } from '../../../../Services/DTEInventory/DTELaboratoryMaster/dtelaboratory-master.service';

@Component({
  selector: 'app-approve-issued-items',
  standalone: false,
  templateUrl: './approve-issued-items.component.html',
  styleUrl: './approve-issued-items.component.css'
})
export class ApproveIssuedItemsComponent {
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
  public CategoryDDLList: any = [];
  public TradeDDLList: any = [];
  public staffDDLList: any = [];
  public LabDetailsData: any = [];
  public ItemId: number = 0;
  public UserID: number = 0;
  public today: Date = new Date();
  public IssuedItemStatus: number = 0;

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

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
    await this.GetIssueItemsForApprove();
    
  }

  async GetIssueItemsForApprove() {    
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.TradeId = this.Searchrequest.TradeId;
      this.Searchrequest.staffID = this.Searchrequest.staffID;
      
      if(this.sSOLoginDataModel.RoleID === EnumRole.BterLabIncharge){
        this.Searchrequest.UserID = this.sSOLoginDataModel.UserID;
        this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      }
      await this.bterInventoryService.GetIssueItemsForApprove(this.Searchrequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.ItemMasterList = data.Data;
          this.ItemMasterList.forEach((ele: any) => {
            if(ele.IssueStatus === 1) {
              ele.ApproveIssueQuantity = ele.Quantity 
            }            
          });
          this.loadInTable();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      });
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

  async ApproveIssuedItems() {
    try {
      let selected = this.ItemMasterList.filter((x: any) => x.Selected);
      if (selected.length === 0) {
        this.toastr.warning("Please select at least one item to mark for approval.", "Warning", {
          toastClass: "ngx-toastr my-warning-toast"
        });
        return;
      }

      if(this.IssuedItemStatus == 0){
        this.toastr.warning("Please select status.", "Warning", {
          toastClass: "ngx-toastr my-warning-toast"
        });
        return;
      }

      selected.forEach((x: any) => {
        x.UserID = this.sSOLoginDataModel.UserID 
        x.IssueStatus = this.IssuedItemStatus
      })

      if(this.IssuedItemStatus == 3) {
        selected.forEach((x: any) => {
          x.ApproveIssueQuantity = 0
        });
      }

      await this.bterInventoryService.ApproveIssuedItems(selected).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message, 'Success', {
            toastClass: 'ngx-toastr my-success-toast'
          });
          await this.GetIssueItemsForApprove();
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

  validateQuantity(item: any) {
    if (item.ApproveIssueQuantity > item.Quantity) {
      this.toastr.warning("Approve Quantity cannot be greater than Issued quantity");
      item.ApproveIssueQuantity = item.Quantity;
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
    await this.GetIssueItemsForApprove();
  }

  exportToExcel(): void {
    
    if (!this.ItemMasterList || this.ItemMasterList.length === 0) {
      this.toastr.warning("No data available to export.");
      return;
    }
    const unwantedColumns = ['ConditionOnReturn', 'IsConsumable', 'ItemDetailsId', 'InvStatus', 'ItemCode', 'IsOption','Name',];

    const columnOrder = ['IssuedTo', 'ItemCategoryName', 'ItemType', 'EquipmentName',
      'EquipmentsCode', 'IndentNo', 'Quantity', 'UsedQuantity', 'RemainingQuantity', 'IssueDate', 'ReturnDate'
    ];

    const filteredData = this.ItemMasterList.map((item: any) => {
      const row: any = {};
      columnOrder.forEach(col => {
        if (!unwantedColumns.includes(col)) {
          row[col] = item[col] ?? ''; // fallback if value missing
        }
      });

      return row;
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
      item.Selected = checked
    });
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onTabPress(event: KeyboardEvent, idx: number): void {
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevents the default tab action

      const nextIndex = idx + 1;
      const nextInput = document.querySelector(`[tabindex="${nextIndex}"]`) as HTMLElement;

      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  allowOnlyPositiveNumbers(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete'
    ];

    if (
      allowedKeys.includes(event.key) ||
      (event.key >= '0' && event.key <= '9')
    ) {
      return;
    }

    event.preventDefault();
  }

  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.ItemMasterList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org. list here)
  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.ItemMasterList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.ItemMasterList.length;
  }
  // (replace org. list here)
  get totalInTableSelected(): number {
    return this.ItemMasterList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.ItemMasterList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.ItemMasterList.filter((x: any) => x.IssuedId == item.IssuedId);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.ItemMasterList.every((r: any) => r.Selected);
  }
  // end table feature
}
