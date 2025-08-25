import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumStatus, GlobalConstants } from '../../../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ITITradeSearchModel } from '../../../../../Models/ITITradeDataModels';
import { DTEIssuedItemDataModel } from '../../../../../Models/DTEInventory/DTEIssuedItemDataModel';
import { DTEItemsSearchModel } from '../../../../../Models/DTEInventory/DTEItemsDataModels';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { ITIInventoryService } from '../../../../../Services/ITI/ITIInventory/iti-inventory.service';


@Component({
  selector: 'app-iti-add-issued-items',
  templateUrl: './iti-add-issued-items.component.html',
  styleUrls: ['./iti-add-issued-items.component.css'],
  standalone: false
})
export class ITIAddIssuedItemsComponent {
  public request = new DTEIssuedItemDataModel()
  public SearchItemReq = new DTEItemsSearchModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public IssuedId: number = 0;
  public Table_SearchText: string = "";
  public TradeDDLList: any = [];
  public CategoryddlList: any = [];
  public EquipmentddlList: any = [];
  public ItemddlList: any = [];
  public searchTradeRequest = new ITITradeSearchModel();
  today: Date;
  constructor(
    private toastr: ToastrService,
    private itiInventoryService: ITIInventoryService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private commonMasterService: CommonFunctionService   
  ) {
    const currentDate = new Date();
    this.today = new Date();
  }


  async ngOnInit() {

    this.RequestFormGroup = this.formBuilder.group({
      //IssueNumber: ['', Validators.required],
      txtIssueNumber: ['', [Validators.required, Validators.pattern(GlobalConstants.AllowNumbersPattern),]],
      txtIssueQuantity: ['', [Validators.required, Validators.pattern(GlobalConstants.AllowNumbersPattern),]],
      IssueDate: ['', Validators.required],
      ddlEquipmentsId: ['', [DropdownValidators]],
      ddlItemId: ['',],
      ddlCategoryId: ['', [DropdownValidators]],
      ddlTradeId: ['', [DropdownValidators]],
    });

    this.IssuedId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    //await this.GetCategoryDDL();
    //await this.GetEquipmentDDL();
   /* await this.GetitemsDDL();*/
    /*await this.GetTradeDDL();*/
    
    await this.GetTradeDDL();
    if (this.IssuedId > 0) {

      await this.GetByID(this.IssuedId);
    }
  }

  get _RequestFormGroup() { return this.RequestFormGroup.controls; }

  customSearch(term: string, item: any) {
    if (!term) return true;  // If no search term is provided, show all items.
    return item.Name.toLowerCase().includes(term.toLowerCase());  // Filter based on item Name
  }

  async saveData() {
    debugger
    this.isSubmitted = true;
    if (this.RequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.IssuedId) {
        this.request.IssuedId = this.IssuedId
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }

      await this.itiInventoryService.SaveIssuedItems(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            //this.GetAllData();
            this.routers.navigate(['/DteIssuedItems']);
          } else if (this.State == EnumStatus.Warning) {
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


  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.key.charCodeAt(0);
    // Allow only digits (0–9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  filterNumber(value: string | number | null | undefined): string {
    const strValue = value ? value.toString() : '';
    return strValue.replace(/\D/g, '');
  }

  async GetByID(id: number) {
    debugger
    try {
      this.loaderService.requestStarted();

      await this.itiInventoryService.GetIssuedItemsByID(id)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          this.request.TradeId = data['Data']["TradeId"];
          this.request.EquipmentsId = data['Data']["EquipmentsId"];
          this.request.CategoryId = data['Data']["CategoryId"];
          this.request.ItemId = data['Data']["EquipmentsId"];
          this.request.IssueNumber = data['Data']["IssueNumber"];
          this.request.IssueQuantity = data['Data']["IssueQuantity"];
          this.request.IssueDate = data['Data']["IssueDate"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
          this.GetCategoryDDL();
          this.GetitemsDDL();
          console.log('test getbyId',data)
          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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
    this.request = new DTEIssuedItemDataModel();
    //this.RequestFormGroup.reset({
    //  UnitId: 0
    //});
  }

  async GetTradeDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          this.TradeDDLList = data['Data'];
          console.log(this.TradeDDLList)
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
      await this.commonMasterService.GetCategory_BranchWise(this.request.TradeId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryddlList = data['Data'];
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

  async GetEquipmentDDL(id:any) {
    try {
      await this.commonMasterService.GetDteEquipment_Branch_Wise_CategoryWise(id)
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

  

  

  async GetitemsDDL() {
    try {
      this.loaderService.requestStarted();
      this.SearchItemReq.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.SearchItemReq.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.SearchItemReq.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.SearchItemReq.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.SearchItemReq.RoleID = this.sSOLoginDataModel.RoleID;
      await this.itiInventoryService.GetAllEquipmentsMaster(this.SearchItemReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ItemddlList = data['Data'];
          this.ItemddlList = this.ItemddlList.filter((item: any) => item.EquipmentsId == this.request.EquipmentsId)
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
