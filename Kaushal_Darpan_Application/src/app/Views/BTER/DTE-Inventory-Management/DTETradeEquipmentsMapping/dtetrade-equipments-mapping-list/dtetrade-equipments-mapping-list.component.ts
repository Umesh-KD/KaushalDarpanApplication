import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EquipmentsMasterService } from '../../../../../Services/EquipmentsMaster/equipments-master.service';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../../Common/SweetAlert2';
import { ItemCategoriesMasterService } from '../../../../../Services/ItemCategoriesMaster/Itemcategories-master.service';
import { SearchTradeEquipmentsMapping } from '../../../../../Models/TradeEquipmentsMappingData';
import { TradeEquipmentsMappingService } from '../../../../../Services/TradeEquipmentsMapping/trade-equipments-mapping.service';
import { EnumStatus, EnumRole, EquipmentStatus, GlobalConstants } from '../../../../../Common/GlobalConstants';
import { ItiTradeService } from '../../../../../Services/iti-trade/iti-trade.service';
import { ITITradeSearchModel } from '../../../../../Models/ITITradeDataModels';
import { DteTradeEquipmentsMappingService } from '../../../../../Services/DTEInventory/DTETradeEquipmentsMapping/dtetrade-equipments-mapping.service';
import { DTEEquipmentsMasterService } from '../../../../../Services/DTEInventory/DTEEquipmentsMaster/dteequipments-master.service';
import { DTEItemCategoriesMasterService } from '../../../../../Services/DTEInventory/DTEItemCategoriesMaster/dteItemcategories-master.service';
import { DTESearchTradeEquipmentsMapping, DTETradeEquipmentsMappingData } from '../../../../../Models/DTEInventory/DTETradeEquipmentsMappingData';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { DTEItemsSearchModel } from '../../../../../Models/DTEInventory/DTEItemsDataModels';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../../Common/appsetting.service';


@Component({
  selector: 'app-dtetrade-equipments-mapping-list',
  templateUrl: './dtetrade-equipments-mapping-list.component.html',
  styleUrls: ['./dtetrade-equipments-mapping-list.component.css'],
  standalone: false
})
export class DteTradeEquipmentsMappingListComponent {
  public Searchrequest = new DTESearchTradeEquipmentsMapping()
  public SearchItemReq = new DTEItemsSearchModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public SearchRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public Table_SearchText: string = "";
  public MappingList: any = [];
  public MappingList1: any = [];
  public EquipmentsDDLList: any = [];
  public TradeDDLList: any = [];
  public CategoryDDLList: any = [];
  public InstituteMasterList: any = [];
  EnumRole = EnumRole;
  EquipmentStatus = EquipmentStatus;
  public searchTradeRequest = new ITITradeSearchModel();
  public request = new DTETradeEquipmentsMappingData()

  constructor(
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private tradeEquipmentsMappingService: DteTradeEquipmentsMappingService,
    private equipmentsService: DTEEquipmentsMasterService,
    private itemCategoriesService: DTEItemCategoriesMasterService,
    private loaderService: LoaderService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,
  ) { }


  async ngOnInit() {

    //this.SearchRequestFormGroup = this.formBuilder.group({
    //  TradeId: ['', [DropdownValidators]],
    //  CollegeId: ['', [DropdownValidators]],
    //  EquipmentsId: ['', [DropdownValidators]],
    //});

    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
    await this.GetTradeDDL();
    await this.GetEquipmentDDL();
    await this.GetCategoryDDL();
    await this.GetMasterData();
  }

  //get _SearchRequestFormGroup() { return this.SearchRequestFormGroup.controls; }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      await this.tradeEquipmentsMappingService.GetAllData(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.MappingList = data['Data'];
          this.MappingList1 = data['Data'];
          console.log(this.MappingList,"MappingList")
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
  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
          console.log(this.InstituteMasterList, "InstituteMasterList")
        }, (error: any) => console.error(error));
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
      //await this.ItiTradeService.GetAllData(this.searchTradeRequest)
      
      await this.commonFunctionService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TradeDDLList = data['Data'];
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
      this.SearchItemReq.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.SearchItemReq.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.SearchItemReq.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.SearchItemReq.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.SearchItemReq.RoleID = this.sSOLoginDataModel.RoleID;
      await this.equipmentsService.GetAllData(this.SearchItemReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
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
  async GetCategoryDDL() {
    try {
      this.loaderService.requestStarted();
      await this.itemCategoriesService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryDDLList = data['Data'];
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

  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequest = new DTESearchTradeEquipmentsMapping();
    await this.GetAllData();
    //this.SearchRequestFormGroup.reset({
    //  EquipmentId: 0,
    //  TradeId: 0,
    //  CategoryId: 0
    //});
  }

  async btnDelete_OnClick(Id: number) {
    
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.tradeEquipmentsMappingService.DeleteDataByID(Id, this.UserID)
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

  async btnEquipmentsStatus_OnClick(item: any) {
    
    console.log(item)
    this.Swal2.Confirmation("Are you sure you want to Status this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();
            this.request.EquipmentId = item.EquipmentId;
            this.request.CategoryId = item.CategoryId;
            this.request.EquipmentId = item.EquipmentId;
            this.request.TE_MappingId = item.TE_MappingId;
            this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
            this.request.ModifyBy = this.sSOLoginDataModel.UserID;
            this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
            this.request.Status = 1;

            try {
              await this.tradeEquipmentsMappingService.UpdateStatusData(this.request)
                .then((data: any) => {
                  data = JSON.parse(JSON.stringify(data));
                  this.State = data['State'];
                  this.Message = data['Message'];
                  this.ErrorMessage = data['ErrorMessage'];

                  if (this.State == EnumStatus.Success) {
                    this.toastr.success(this.Message)
                    this.ResetControl();
                    this.GetAllData();
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
  exportToExcel(): void {
    this.MappingList1 = this.MappingList1.map((item: any) => {
      const updatedItem = {
        InstituteName: item.InstituteName ?? "BTER",
        ItemCategoryName: item.ItemCategoryName,
        EquipmentsName: item.EquipmentsName,
        Quantity: item.Quantity,
        EquipmentsStatus: item.EquipmentsStatus
      }

      return updatedItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.MappingList1);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Inventory_Reports.xlsx');
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
