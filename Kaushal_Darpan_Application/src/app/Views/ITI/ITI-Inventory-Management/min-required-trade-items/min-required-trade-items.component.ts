import { Component } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { FormGroup } from '@angular/forms';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITITradeSearchModel } from '../../../../Models/ITITradeDataModels';
import { AddMinRequiredItemDataModel, ItemsDataModels, ItemsSearchModel, MinRequiredItemSearchModel } from '../../../../Models/ItemsDataModels';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DTEItemsSearchModel } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ToastrService } from 'ngx-toastr';
import { ITIInventoryService } from '../../../../Services/ITI/ITIInventory/iti-inventory.service';

@Component({
  selector: 'app-min-required-trade-items',
  standalone: false,
  templateUrl: './min-required-trade-items.component.html',
  styleUrl: './min-required-trade-items.component.css'
})
export class MinRequiredTradeItemsComponent {
  public searchTradeRequest = new ITITradeSearchModel();
  public searchReq = new MinRequiredItemSearchModel();
  public deleteReq = new AddMinRequiredItemDataModel();
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public ID: number = 0;

  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public Table_SearchText: string = "";
  public ItemMasterList: any = [];
  public EquipmentsDDLList: any = [];
  public TradeDDLList: any = [];
  public CollegeDDLList: any = [];
  public ItemtypeList:any[]=[];
  EnumRole = EnumRole;
  public request = new ItemsDataModels();
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
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;    
    console.log('Role:'+this.sSOLoginDataModel.RoleID)
    this.searchReq.CollegeId = this.sSOLoginDataModel.InstituteID;
    // await this.GetEquipmentDDL();
    await this.GetTradeDDL();
    await this.GetCollegeDDL();
    await this.GetMinRequiredItem_ITI_INV();
  }

  async GetTradeDDL() {    
    try {
      this.loaderService.requestStarted();
      let Searchrequest: any = {}
      Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      Searchrequest.TypeName = 'TradeList';

      const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(Searchrequest);

      if (data && data.State === EnumStatus.Success) {
        this.TradeDDLList = data.Data
      } 
    } catch (Ex) {
      console.log('Error in GetTradeDDL:', Ex);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  // async GetEquipmentDDL() {
  //   try {
  //     this.loaderService.requestStarted();
  //     this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
  //     this.Searchrequest.CollegeId = this.sSOLoginDataModel.InstituteID;
  //     this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
  //     this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
  //     this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
  //     this.Searchrequest.OfficeID = this.sSOLoginDataModel.OfficeID;

  //     await this.itiInventoryService.GetAllEquipmentsMaster(this.Searchrequest)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.EquipmentsDDLList = data['Data'];
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  async GetCollegeDDL() {
    //
    this.ID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.InstituteMaster(this.ID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
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

  async GetMinRequiredItem_ITI_INV() {
    try {
      this.searchReq.Action = 'GetAllData';
      // this.searchReq.CollegeId = this.sSOLoginDataModel.InstituteID;

      await this.itiInventoryService.GetMinRequiredItem_ITI_INV(this.searchReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.ItemMasterList = data.Data;
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  navigateToEdit(id: number) {
    this.routers.navigate(['/iti-edit-item-master'], { queryParams: { id } });
  }

  async ResetControl() {
    this.searchReq = new MinRequiredItemSearchModel();
    await this.GetMinRequiredItem_ITI_INV();
  }

  async btnDelete_OnClick(Id: number) {
    this.Swal2.Confirmation("Are you sure You want to delete ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();
            this.deleteReq.RequiredItemId = Id;
            this.deleteReq.ModifyBy = this.sSOLoginDataModel.UserID;

            await this.itiInventoryService.DeleteMinRequiredItem_ITI_INV(this.deleteReq)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State = EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  //reload
                  this.GetMinRequiredItem_ITI_INV();
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
