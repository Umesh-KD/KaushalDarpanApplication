import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { DTEItemsSearchModel } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import { AuctionDetailsModel, ItemsDataModels, ItemsSearchModel } from '../../../../Models/ItemsDataModels';
import { ITITradeSearchModel } from '../../../../Models/ITITradeDataModels';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DTEEquipmentsMasterService } from '../../../../Services/DTEInventory/DTEEquipmentsMaster/dteequipments-master.service';
import { DteItemsMasterService } from '../../../../Services/DTEInventory/DTEItemsMaster/dteitems-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiTradeService } from '../../../../Services/iti-trade/iti-trade.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { AppsettingService } from '../../../../Common/appsetting.service';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auction-list',
  standalone: false,
  templateUrl: './auction-list.component.html',
  styleUrl: './auction-list.component.css'
})

export class AuctionListComponent {
  public Searchrequest = new DTEItemsSearchModel()
  public request = new AuctionDetailsModel()
  public searchTradeRequest = new ITITradeSearchModel();
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public ID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public SearchRequestFormGroup!: FormGroup;
  public AuctionFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public ItemDetailsId: number = 0;
  public AvailableQuantity: number = 0;
  public Table_SearchText: string = "";
  public ItemMasterList: any = [];
  public ItemMasterList1: any = [];
  public EquipmentsDDLList: any = [];
  public TradeDDLList: any = [];
  public CollegeDDLList: any = [];
  EnumRole = EnumRole;
  minDate: string = '';
  public closeResult: string | undefined;

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

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  @ViewChild('AuctionItems_Modal') MyModel_AuctionItem: ElementRef | any;
  constructor(
    private toastr: ToastrService,
    private ItiTradeService: ItiTradeService,
    public appsettingConfig: AppsettingService,
    private commonFunctionService: CommonFunctionService,
    private dteItemsMasterService: DteItemsMasterService,
    private equipmentsService: DTEEquipmentsMasterService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder, private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal) { }

  async ngOnInit() {
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

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    await this.GetAllData();
    await this.GetEquipmentDDL();
    //await this.GetTradeDDL();
    //await this.GetCollegeDDL();
  }
  get _AuctionFormGroup() { return this.AuctionFormGroup.controls; }

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
      await this.dteItemsMasterService.SaveAuctionData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.AuctionFormGroup.reset();
            this.request.Dis_AuctionDoc = '';
            this.CloseModalPopup();
            this.GetAllData();
            /*this.routers.navigate(['/Auction-List']);*/
          }
          else {
            this.toastr.error(this.ErrorMessage)
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

  validateAuctionQuantity(event: any) {
    const enteredValue = +event.target.value;
    if (enteredValue > this.AvailableQuantity) {
      this.toastr.warning("Auction quantity cannot be greater than available quantity.");
      this.request.AuctionQuantity = 0;
    }
  }

  async GetEquipmentDDL() {
    try {
      this.loaderService.requestStarted();
      await this.equipmentsService.GetAllData(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
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

  async ViewandUpdate(content: any, item:any) {
    this.isSubmitted = false;
    this.ItemDetailsId = item.ItemDetailsId
    this.request.isOption = item.IsOption
    this.AvailableQuantity = item.AvailableQuantity
    this.request.AuctionQuantity = item.AvailableQuantity
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: true, centered: true });

  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    //this.requestInv = new TimeTableInvigilatorModel()
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
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
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

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.Dis_AuctionDoc = data['Data'][0]["Dis_FileName"];
                this.request.AuctionDoc = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
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
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.Searchrequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      await this.dteItemsMasterService.GetAllAuctionList(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          this.ItemMasterList = data['Data'];
          if (this.Searchrequest.EquipmentsId != 0) {
            this.ItemMasterList = this.ItemMasterList.flter((item: any) => item.EquipmentsId == this.Searchrequest.EquipmentsId);
          } else {
            this.ItemMasterList = data['Data'];
          }
          
          this.loadInTable();
          this.ItemMasterList1 = data['Data'];
          if (this.Searchrequest.EquipmentsId != 0) {
            this.ItemMasterList1 = this.ItemMasterList1.flter((item: any) => item.EquipmentsId == this.Searchrequest.EquipmentsId);
          } else {
            this.ItemMasterList1 = data['Data'];
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

  navigateToEdit(id: number) {
    this.routers.navigate(['/DteEditeItemMaster'], { queryParams: { id } });
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequest = new ItemsSearchModel();
    this.ID = 0;
  }

  async btnDelete_OnClick(Id: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.dteItemsMasterService.DeleteDataByID(Id, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetAllData()
                }
                else {
                  this.toastr.error(this.ErrorMessage)
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
      });
  }

  exportToExcel(): void {
    this.ItemMasterList1 = this.ItemMasterList1.map((item: any) => {
      const updatedItem = {
        CollegeName: item.CollegeName ?? "BTER",
        ItemCategoryName: item.ItemCategoryName,
        ItemCode: item.ItemCode,
        EquipmentsName: item.EquipmentsName,
        EquipmentsCode: item.EquipmentsCode,
        EquipmentWorking: item.EquipmentWorking == 1 ? "Working" : "Not Working",
        IsAuction: item.IsOption,
        InitialQuantity: item.InitialQuantity,
        AvailableQuantity: item.AvailableQuantity,
        PricePerUnit: item.PricePerUnit,
        TotalPrice: item.TotalPrice,
        AuctionStatus : item.AuctionStatus == 1 ? "Done" : "Pending"
      };

      return updatedItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ItemMasterList1);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `Auction_Reports_${timestamp}.xlsx`);
  }

  public downloadPDF() {
    const margin = 10;
    const pageWidth = 210 - 2 * margin;
    const pageHeight = 200 - 2 * margin;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [210, 300],
    });

    const pdfTable = this.pdfTable.nativeElement;

    doc.html(pdfTable, {
      callback: function (doc) {
        doc.save('Report.pdf');
      },
      x: margin,
      y: margin,
      width: pageWidth,
      windowWidth: pdfTable.scrollWidth,
    });
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

  OpenModalPopup(content: any) {

    this.modalService.open(content, { size: 'sm', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async SaveDataMarked() {
    this.OpenModalPopup(this.MyModel_AuctionItem);
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
    const data = this.ItemMasterList.filter((x: any) => x.ItemDetailsId == item.ItemDetailsId);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.ItemMasterList.every((r: any) => r.Selected);
  }
  // end table feature
}
