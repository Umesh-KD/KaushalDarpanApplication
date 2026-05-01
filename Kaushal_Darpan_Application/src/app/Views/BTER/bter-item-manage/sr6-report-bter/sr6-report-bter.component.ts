import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
import { AuctionDetailsModel } from '../../../../Models/ItemsDataModels';

@Component({
  selector: 'app-sr6-report-bter',
  standalone: false,
  templateUrl: './sr6-report-bter.component.html',
  styleUrl: './sr6-report-bter.component.css'
})
export class SR6ReportBTERComponent {
  public Searchrequest = new inventoryIssueHistorySearchModel()
  public request = new AuctionDetailsModel()
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
  public ItemDetailsId: number = 0;
  public AvailableQuantity: number = 0;
  public today: Date = new Date();
  public AllInTableSelect: boolean = false;
  public closeResult: string | undefined;
  public AuctionFormGroup!: FormGroup;
  @ViewChild('AuctionItems_Modal') MyModel_AuctionItem: ElementRef | any;
  modalReference: NgbModalRef | undefined;

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
    private formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    // Check if the current route is 'bter-staff-inventory-details'
    this.AuctionFormGroup = this.formBuilder.group({
      AuctionQuantity: ['', Validators.required],
      txtAuctionDate: ['', Validators.required],
      //txtAuctionDate: ['', Validators.required],
      Authority_forAuctionOrder: ['', Validators.required],
      ModeOfDisposal: ['', Validators.required],
      Remarks: ['', Validators.required],
      ApproximateCost: ['', Validators.required],
    })

    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;    
    await this.GetTradeDDL();
    await this.GetCategoryDDL();
    await this.GetStaffDDL();
    await this.GetAllData();
    
  }

  get _AuctionFormGroup() { return this.AuctionFormGroup.controls; }

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
      await this.bterInventoryService.Get_SR6_ReportData(this.Searchrequest)
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

  async DownloadSR6ReportData_pdf_BTER() {
    try {
      this.loaderService.requestStarted();

      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.UserID = this.sSOLoginDataModel.UserID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.Searchrequest.TradeId = this.Searchrequest.TradeId;
      this.Searchrequest.staffID = this.Searchrequest.staffID;
      // this.Searchrequest.IsStaff = this.IsStaff;
      this.Searchrequest.ReturnStatus = 2; // for all data
     // this.Searchrequest.staffID = 1;

      await this.bterInventoryService.DownloadSR6ReportData_pdf_BTER(this.Searchrequest)
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

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png' || this.file.type == 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
        }
        else {// type validation
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.Dis_AuctionDoc = data['Data'][0]["Dis_FileName"];
                this.request.AuctionDoc = data['Data'][0]["FileName"];

              }
              event.target.value = null;
            }
            if (data.State == EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage)
            }
            else if (data.State == EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async SaveAuctionData() {
    try {
      this.isSubmitted = true;
      if (this.AuctionFormGroup.invalid || this.AuctionFormGroup.value.AuctionQuantity == 0) {
        this.toastr.error("Please valid Auction Detail")
        return;
      }
      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.ItemDetailsId = this.ItemDetailsId;
      this.request.RoleID = this.sSOLoginDataModel.RoleID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;


      //save
      await this.bterInventoryService.SaveAuctionData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          if (data.State = EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.AuctionFormGroup.reset();
            this.request.Dis_AuctionDoc = '';
            this.CloseModalPopup();
            this.GetAllData();
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }

        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    this.request = new AuctionDetailsModel();
  }

  async ViewandUpdate(content: any, item:any) {
    this.isSubmitted = false;
    this.ItemDetailsId = item.ItemDetailsId
    this.request.isOption = item.IsOption
    this.AvailableQuantity = item.AvailableQuantity
    this.request.AuctionQuantity = item.AvailableQuantity
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: true, centered: true });
  }
}
