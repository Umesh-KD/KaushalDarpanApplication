import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../../Common/SweetAlert2';
import { EnumStatus } from '../../../../../Common/GlobalConstants';
import { ItiTradeService } from '../../../../../Services/iti-trade/iti-trade.service';
import { ITITradeSearchModel } from '../../../../../Models/ITITradeDataModels';
import { DTEIssuedSearchModel } from '../../../../../Models/DTEInventory/DTEIssuedItemDataModel';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { ITIInventoryService } from '../../../../../Services/ITI/ITIInventory/iti-inventory.service';

@Component({
  selector: 'app-iti-issued-items-list',
  templateUrl: './iti-issued-items-list.component.html',
  styleUrls: ['./iti-issued-items-list.component.css'],
  standalone: false
})
export class ITIIssuedItemsListComponent {
  public Searchrequest = new DTEIssuedSearchModel()
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
  public IssueItemMasterList: any = [];
  public EquipmentsDDLList: any = [];
  public TradeDDLList: any = [];
  public CollegeDDLList: any = [];
  public searchTradeRequest = new ITITradeSearchModel();


  constructor(
    private toastr: ToastrService,
    private ItiTradeService: ItiTradeService,
    private itiInventoryService: ITIInventoryService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private commonFunctionService: CommonFunctionService,
  ) { }


  async ngOnInit() {

    //this.SearchRequestFormGroup = this.formBuilder.group({
    //  TradeId: ['', [DropdownValidators]],
    //  EquipmentsId: ['', [DropdownValidators]],
    //});

    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
    await this.GetTradeDDL();
    await this.GetEquipmentDDL();
  }

  //get _SearchRequestFormGroup() { return this.SearchRequestFormGroup.controls; }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;

      await this.itiInventoryService.GetAllIssuedItems(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.IssueItemMasterList = data['Data'];
          console.log(this.IssueItemMasterList,"listttt")
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
      await this.ItiTradeService.GetAllData(this.searchTradeRequest)
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
      this.Searchrequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      await this.itiInventoryService.GetAllEquipmentsMaster(this.Searchrequest)
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

 

  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequest.EquipmentsId = 0;
    this.Searchrequest.EquipmentCode = '';
    this.Searchrequest.TradeId = 0;
    this.Searchrequest.Issuedate = null;
    this.Searchrequest.Issuenumber = null;
    await this.GetAllData();
  }

  async btnDelete_OnClick(Id: number) {
    
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.itiInventoryService.DeleteIssuedItemsByID(Id, this.UserID)
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
}
