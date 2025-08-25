import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EquipmentsMasterService } from '../../../../Services/EquipmentsMaster/equipments-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ItiTradeService } from '../../../../Services/iti-trade/iti-trade.service';
import { ITITradeSearchModel } from '../../../../Models/ITITradeDataModels';
import { DteIssuedItemsService } from '../../../../Services/DTEInventory/DTEIssuedItems/dteissued-items.service';
import { DTEStoksSearchModel } from '../../../../Models/DTEInventory/DTEIssuedItemDataModel';
import { DTEEquipmentsMasterService } from '../../../../Services/DTEInventory/DTEEquipmentsMaster/dteequipments-master.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-dtestocks-items-list',
  templateUrl: './dtestocks-items-list.component.html',
  styleUrls: ['./dtestocks-items-list.component.css'],
  standalone: false
})
export class DteStocksItemsListComponent {
  public Searchrequest = new DTEStoksSearchModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public Table_SearchText: string = "";
  public StoksItemList: any = [];
  public EquipmentddlList: any = [];
  public TradeDDLList: any = [];
  public searchTradeRequest = new ITITradeSearchModel();


  constructor(
    private toastr: ToastrService,
    private ItiTradeService: ItiTradeService,
    private dteIssuedItemsService: DteIssuedItemsService,
    private equipmentsMasterService: DTEEquipmentsMasterService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,) { }


  async ngOnInit() {

    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
    await this.GetTradeDDL();
    await this.GetEquipmentDDL();
  }


  async GetAllData() {
    try {
      this.loaderService.requestStarted();

      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;

      await this.dteIssuedItemsService.GetAllStoks(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StoksItemList = data['Data'];
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
    this.Searchrequest.EquipmentsId = 0;
    this.Searchrequest.TradeId = 0;
    //this.Searchrequest.Issuedate = null;
    //this.Searchrequest.Issuenumber = null;
    await this.GetAllData();
  }

  async GetTradeDDL() {
    try {
      this.loaderService.requestStarted();
      /* await this.ItiTradeService.GetAllData(this.searchTradeRequest)*/
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
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      await this.equipmentsMasterService.GetAllData(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.EquipmentddlList = data['Data'];
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
