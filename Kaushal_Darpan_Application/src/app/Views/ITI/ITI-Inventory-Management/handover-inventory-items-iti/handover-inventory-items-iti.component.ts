import { Component } from '@angular/core';
import { HandoverInventoryItemsDataModel, inventoryIssueHistoryITISearchModel } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITIInventoryService } from '../../../../Services/ITI/ITIInventory/iti-inventory.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';

@Component({
  selector: 'app-handover-inventory-items-iti',
  standalone: false,
  templateUrl: './handover-inventory-items-iti.component.html',
  styleUrl: './handover-inventory-items-iti.component.css'
})
export class HandoverInventoryItemsITIComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new HandoverInventoryItemsDataModel();
  public Searchrequests = new inventoryIssueHistoryITISearchModel()

  public staffDDLList: any = [];
  public staffDDLList_From: any = [];
  public staffDDLList_To: any = [];
  public HandoverItemsList: any = [];
  public TradeDDLList: any = [];

  public Table_SearchText: string = '';

  constructor(
    private toastr: ToastrService,
    private itiInventoryService: ITIInventoryService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private routers: Router,
    private documentDetailsService: DocumentDetailsService,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetTradeDDL();
    await this.GetStaffDDL_ToHandover();
  }

  async GetStaffDDL_FromHandover() {  
    this.request.HandoverFrom = 0;
    this.staffDDLList_From = [];
    try {
      this.loaderService.requestStarted();
      this.Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequests.TradeId = this.request.TradeId ?? 0;
      this.Searchrequests.TypeName = 'staffList_handoverItem';

      const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequests);

      if (data && data.State === EnumStatus.Success) {
        this.staffDDLList_From = data.Data
      }
    } catch (Ex) {
      console.error('Error in GetStaffDDL:', Ex);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }
  async GetStaffDDL_ToHandover() {    
    try {
      this.loaderService.requestStarted();
      this.Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequests.TypeName = 'staffList';

      const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequests);

      if (data && data.State === EnumStatus.Success) {
        this.staffDDLList_To = data.Data
      }
    } catch (Ex) {
      console.error('Error in GetStaffDDL:', Ex);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  async GetItemsForHandover_ITI_INV() {
    try {
      let itemSearch: any = {};
      itemSearch.HandoverFrom = this.request.HandoverFrom;
      itemSearch.TradeId = this.request.TradeId;
      itemSearch.Action = "GetItemsList";
      await this.itiInventoryService.GetItemsForHandover_ITI_INV(itemSearch).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.HandoverItemsList = data['Data'];
      })
    } catch (error) {
      console.error(error);
    }
  }

  async ResetControl() {
    this.request = new HandoverInventoryItemsDataModel();
    this.HandoverItemsList = [];
    await this.GetStaffDDL_ToHandover()
  }

  async HandoverInventoryItems_ITI_INV() {
    this.Swal2.Confirmation("Are you sure You want to Handover Items to another Staff ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            if(this.HandoverItemsList?.length == 0){
              this.toastr.error("There are no items to handover.");
              return;
            }
            if(this.request.HandoverFrom > 0 && this.request.HandoverTo > 0){
              if(this.request.HandoverFrom == this.request.HandoverTo){
                  this.toastr.error("Handover From and Handover To Staff cannot be same.");
                  return;
              }
            } else {
              this.toastr.error("Please select Handover From and Handover To Staff.");
              return;
            }
            this.request.ItemList = this.HandoverItemsList;
            this.request.UserID = this.sSOLoginDataModel.UserID;

            await this.itiInventoryService.HandoverInventoryItems_ITI_INV(this.request).then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data['State'] == EnumStatus.Success) {
                this.toastr.success(data['Message']);
                this.ResetControl();
              }
            })
          } catch (error) {
            console.error(error);
          }
        }
      });
    
  }

  async GetTradeDDL() {
    try {
      this.loaderService.requestStarted();
      //await this.ItiTradeService.GetAllData(this.searchTradeRequest)
      //await this.commonFunctionService.StreamMaster()
      let Searchrequests: any = {}
      Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      Searchrequests.TypeName = 'TradeList_minReqItem';
      
      await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(Searchrequests)
        .then((data: any) => {
          console.log(data)
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
}
