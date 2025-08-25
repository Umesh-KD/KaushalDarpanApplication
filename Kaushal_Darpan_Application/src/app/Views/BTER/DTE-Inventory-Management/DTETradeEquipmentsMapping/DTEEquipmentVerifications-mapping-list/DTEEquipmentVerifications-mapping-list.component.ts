import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { EnumStatus } from '../../../../../Common/GlobalConstants';
import { ItiTradeService } from '../../../../../Services/iti-trade/iti-trade.service';
import { ITITradeSearchModel } from '../../../../../Models/ITITradeDataModels';
import { DteTradeEquipmentsMappingService } from '../../../../../Services/DTEInventory/DTETradeEquipmentsMapping/dtetrade-equipments-mapping.service';
import { DTEEquipmentsMasterService } from '../../../../../Services/DTEInventory/DTEEquipmentsMaster/dteequipments-master.service';
import { DTEItemCategoriesMasterService } from '../../../../../Services/DTEInventory/DTEItemCategoriesMaster/dteItemcategories-master.service';
import { DTESearchTradeEquipmentsMapping, DTEEquipmentVerificationsDataModel } from '../../../../../Models/DTEInventory/DTETradeEquipmentsMappingData';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { DTEItemsSearchModel } from '../../../../../Models/DTEInventory/DTEItemsDataModels';

@Component({
  selector: 'app-DTEEquipmentVerifications-mapping-list',
  templateUrl: './DTEEquipmentVerifications-mapping-list.component.html',
  styleUrls: ['./DTEEquipmentVerifications-mapping-list.component.css'],
  standalone: false
})
export class DTEEquipmentVerificationsMappingListComponent {
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
  public EquipmentsDDLList: any = [];
  public TradeDDLList: any = [];
  public CategoryDDLList: any = [];
  public searchTradeRequest = new ITITradeSearchModel();
  requestAction = new DTEEquipmentVerificationsDataModel();
  closeResult: string | undefined;
  formAction!: FormGroup;


  constructor(
    private toastr: ToastrService,
    private ItiTradeService: ItiTradeService,
    private tradeEquipmentsMappingService: DteTradeEquipmentsMappingService,
    private equipmentsService: DTEEquipmentsMasterService,
    private itemCategoriesService: DTEItemCategoriesMasterService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,
  ) { }


  async ngOnInit() {

    this.formAction = this.formBuilder.group(
      {
        ddlAction: ['', Validators.required],
        txtActionRemarks: ['', Validators.required],
      })

    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
    await this.GetTradeDDL();
    await this.GetEquipmentDDL();
    await this.GetCategoryDDL();
  }

  //get _SearchRequestFormGroup() { return this.SearchRequestFormGroup.controls; }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      await this.tradeEquipmentsMappingService.GetAllData(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.MappingList = data['Data'];
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

  async DTEEquipmentVerificationsOnAction(content: any, ID: number) {
    
    this.requestAction.TE_MappingId = ID;

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    
  }
  private getDismissReason(reason: any): string {
      return 'by pressing ESC';
  }
  CloseModalPopup() {
    this.modalService.dismissAll();
  }


  async SaveData_EquipmentVerifications() {
    
    this.isSubmitted = true;

 
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestAction.CreatedBy = this.sSOLoginDataModel.UserID;
    this.requestAction.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    
    this.loaderService.requestStarted();
    try {
      await this.tradeEquipmentsMappingService.HOD_EquipmentVerifications(this.requestAction.TE_MappingId, this.requestAction.CreatedBy, this.requestAction.ReturnStatus)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.CloseModalPopup();
            await this.GetAllData();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
