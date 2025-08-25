import { Component } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItemsMasterService } from '../../../../Services/ItemsMaster/items-master.service';
import { ToastrService } from 'ngx-toastr';
//import { ItemsDataModels, ItemsSearchModel } from '../../../../Models/ItemsDataModels';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EquipmentsMasterService } from '../../../../Services/EquipmentsMaster/equipments-master.service';
import { ItiTradeService } from '../../../../Services/iti-trade/iti-trade.service';
import { ITITradeSearchModel } from '../../../../Models/ITITradeDataModels';
import { ItemsDataModels, ItemsSearchModel } from '../../../../Models/ItemsDataModels';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DTEItemsSearchModel } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import { DteItemsMasterService } from '../../../../Services/DTEInventory/DTEItemsMaster/dteitems-master.service';
import { DTEEquipmentsMasterService } from '../../../../Services/DTEInventory/DTEEquipmentsMaster/dteequipments-master.service';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';


@Component({
  selector: 'app-dteitems-master',
  templateUrl: './dteitems-master.component.html',
  styleUrls: ['./dteitems-master.component.css'],
  standalone: false
})
export class DteItemsMasterComponent {
  public Searchrequest = new DTEItemsSearchModel()
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
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public Table_SearchText: string = "";
  public ItemMasterList: any = [];
  public ItemMasterList1: any = [];
  public EquipmentsDDLList: any = [];
  public TradeDDLList: any = [];
  public CollegeDDLList: any = [];
  EnumRole = EnumRole;
  public request = new ItemsDataModels();
  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private commonFunctionService: CommonFunctionService,
    private dteItemsMasterService: DteItemsMasterService,
    private equipmentsService: DTEEquipmentsMasterService,
    private loaderService: LoaderService,
    public appsettingConfig: AppsettingService,
    private itemService: DteItemsMasterService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal) { }

  async ngOnInit() {
    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;    
    await this.GetEquipmentDDL();
    await this.GetAllData();
    await this.GetTradeDDL();
    await this.GetCollegeDDL();
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID
      //if (this.sSOLoginDataModel.RoleID != EnumRole.Admin) {        
      //  this.Searchrequest.CollegeId = this.sSOLoginDataModel.InstituteID
      //} else {
      //  this.Searchrequest.CollegeId = 0
      //}
      
      await this.dteItemsMasterService.GetAllData(this.Searchrequest)
        .then((data: any) => {

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

  async GetTradeDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          const selectOption = { StreamID: 0, StreamName: '--Select--' };
          this.TradeDDLList = [selectOption, ...data['Data']];
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

  async GetEquipmentDDL() {
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.Searchrequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
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

  async GetCollegeDDL() {
    //
    this.ID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.InstituteMaster(this.ID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeDDLList = data['Data'];
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
    await this.GetAllData();
  }

  async btnEquipmentsStatus_OnClick(item: any) {

    console.log(item)
    this.Swal2.Confirmation("Are you sure you want to Approved ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
            try {

              if (item.ItemId) {
                  this.request.ItemId = item.ItemId,
                  this.request.ItemCategoryId = item.ItemCategoryId,
                  this.request.EquipmentsId = item.EquipmentsId,
                  this.request.VoucherNumber = item.VoucherNumber,
                  this.request.Quantity = item.InitialQuantity,
                  this.request.PricePerUnit = item.PricePerUnit,
                  this.request.TotalPrice = item.TotalPrice,
                  this.request.IdentificationMark = item.IdentificationMark,
                  this.request.CampanyName = item.CampanyName,
                  this.request.Status = 1,
                  this.request.ModifyBy = this.sSOLoginDataModel.UserID;
              } else {
                this.request.CreatedBy = this.sSOLoginDataModel.UserID;
              }
              debugger
              await this.itemService.UpdateStatusItemsData(this.request)
                .then((data: any) => {
                  this.State = data['State'];
                  this.Message = data['Message'];
                  this.ErrorMessage = data['ErrorMessage'];

                  if (this.State == EnumStatus.Success) {
                    this.toastr.success(this.Message)
                    this.GetAllData();
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
