import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
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
      debugger;

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
    debugger;
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
      debugger;
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
      debugger;
      this.loaderService.requestStarted();
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.Searchrequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      await this.dteItemsMasterService.GetAllAuctionList(this.Searchrequest)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ItemMasterList = data['Data'];
          this.ItemMasterList1 = data['Data'];
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
    debugger;
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
        EquipmentsCode: item.EquipmentsCode,
        EquipmentWorking: item.EquipmentWorking == 1 ? "Working" : "Not Working",
        IsOption: item.IsOption,
        EquipmentsName: item.EquipmentsName,
        AvailableQuantity: item.AvailableQuantity,
        InitialQuantity: item.InitialQuantity,
        PricePerUnit: item.PricePerUnit,
        TotalPrice: item.TotalPrice,
        AuctionStatus : item.AuctionStatus == 1 ? "Done" : "Pending"
      };

      return updatedItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ItemMasterList1);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Auction_Reports.xlsx');
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
}
