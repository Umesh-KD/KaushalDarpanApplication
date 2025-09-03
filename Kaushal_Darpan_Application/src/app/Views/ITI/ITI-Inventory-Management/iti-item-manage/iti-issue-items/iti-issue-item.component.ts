import { Component, Pipe, PipeTransform } from '@angular/core';
import { ItemsDataModels } from '../../../../../Models/ItemsDataModels';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../../Common/GlobalConstants';
import { ITITradeSearchModel } from '../../../../../Models/ITITradeDataModels';
import { DTEItemsSearchModel, DTEItemsDataModels } from '../../../../../Models/DTEInventory/DTEItemsDataModels';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { ITIInventoryService } from '../../../../../Services/ITI/ITIInventory/iti-inventory.service';


@Component({
  selector: 'app-iti-add-items-master',
  templateUrl: './iti-issue-item.component.html',
  styleUrls: ['./iti-issue-item.component.css'],
  standalone: false
})
export class AddItiIssueItemComponent {
  public request = new ItemsDataModels()
  public searchTradeRequest = new ITITradeSearchModel();
  public searchRequest = new DTEItemsSearchModel();
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public InstituteID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public AddItemsRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public Table_SearchText: string = "";
  public ItemsDDLList: any = [];
  public CatogaryDDLList: any = [];
  public TradeDDLList: any = [];
  public EquipmentDDLList: any = [];
  public CategoryDDLList: any = [];
  public StaffDDLList: any = [];
  selectedItems: Array<any> = [];
  showDetailsTable: boolean = false;
  public maxQty: number = 0;
  _EnumRole = EnumRole;
  public ItemtypeList:any[]=[]
  constructor(
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private itiInventoryService: ITIInventoryService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router) { }

  async ngOnInit() {

    this.AddItemsRequestFormGroup = this.formBuilder.group({

     
      ItemType: ['0', [DropdownValidators]],
      TradeId: ['-1', [DropdownValidators]],

    });

    /*this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());*/
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    this.InstituteID = this.sSOLoginDataModel.InstituteID;
    await this.ddlStaffMembers();
    await this.ddlTradeList();



  }
  get _AddItemsRequestFormGroup() { return this.AddItemsRequestFormGroup.controls; }

  async RefereshValoidators() {
    if (this.request.ItemType == 2) {
      this.AddItemsRequestFormGroup.controls['TradeId'].setValidators([DropdownValidators])
    } else {
      this.AddItemsRequestFormGroup.controls['TradeId'].clearValidators()
    }
    this.AddItemsRequestFormGroup.controls['TradeId'].updateValueAndValidity()
  }

  async saveData() {
    debugger
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.request.OfficeID = this.sSOLoginDataModel.OfficeID;
    this.request.RoleID = this.sSOLoginDataModel.RoleID;
    this.isSubmitted = true;


 
    if (this.request.ItemType == 1) {
      this.request.TradeId = 0
      this.request.IsConsume=0
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.ItemId) {
        this.request.ItemId = this.ItemId
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      if (this.sSOLoginDataModel.RoleID == this._EnumRole.Principal_SCVT || this.sSOLoginDataModel.RoleID == this._EnumRole.Principal_NCVT || this.sSOLoginDataModel.RoleID == this._EnumRole.DTETrainingT3Purchase ) {
        this.request.Status = 1
      } else {
        this.request.Status = 0
      }
      await this.itiInventoryService.SaveItemsMaster(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.routers.navigate(['/iti-items-master-list']);
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

  async GetByID(id: number) {

    try {
      this.loaderService.requestStarted();

      await this.itiInventoryService.GetItemsMasterByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*this.request.TradeId = data['Data']["TradeId"];*/

      
          this.request.ItemCategoryId = data['Data']["ItemCategoryId"];
          this.AddItemsRequestFormGroup.get('ItemCategoryId')?.setValue(this.request?.ItemCategoryId);
        

          this.request.EquipmentsId = data['Data']["EquipmentsId"];
          this.AddItemsRequestFormGroup.get('EquipmentsId')?.setValue(this.request?.EquipmentsId);
          this.request.CampanyName = data['Data']["CampanyName"];
          
          this.request.IdentificationMark = data['Data']["IdentificationMark"];
          this.request.VoucherNumber = data['Data']["VoucherNumber"];
          this.request.Quantity = data['Data']["Quantity"];
          this.request.PricePerUnit = data['Data']["PricePerUnit"];
          this.request.TotalPrice = data['Data']["TotalPrice"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
          console.log('GetByID',data)
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

  async StaffMembers(InstituteID: number)
  {
    try {
      this.loaderService.requestStarted();
      await this.itiInventoryService.GetAllCategoryMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          const selectOption = { ItemCategoryID: 0, Name: '--Select--' }; 
          this.CategoryDDLList = [selectOption, ...data['Data']];
          this.AddItemsRequestFormGroup.get('ItemCategoryId')?.setValue(0);  
        });
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async ddlStaffMembers() {
    debugger;
    try {
      this.loaderService.requestStarted();

      this.searchRequest.CollegeId = this.InstituteID;
      this.searchRequest.StatusID = 1;

      await this.itiInventoryService.GetAllDDL(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          const selectOption = { StaffID: 0, Name: '--Select--' };
          this.StaffDDLList = [selectOption, ...data['Data']];
          //this.AddItemsRequestFormGroup.get('ItemCategoryId')?.setValue(0);
        });
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async ddlTradeList() {
    debugger;
    try {
      this.loaderService.requestStarted();

      this.searchRequest.CollegeId = this.InstituteID;
      this.searchRequest.StatusID = 2;

      await this.itiInventoryService.GetAllDDL(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          const selectOption = { StaffID: 0, Name: '--Select--' };
          this.TradeDDLList = [selectOption, ...data['Data']];
          //this.AddItemsRequestFormGroup.get('ItemCategoryId')?.setValue(0);
        });
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async ddlTrade_Change() {
    try {
      this.loaderService.requestStarted();
      debugger
      const TradeId = this.AddItemsRequestFormGroup.get('TradeId')?.value;

      //if (!TradeId || TradeId === 0) {
      //  this.EquipmentsDDLList = [{ EquipmentsId: 0, Name: '--Select--' }];
      //  this.AddItemsRequestFormGroup.get('EquipmentsId')?.setValue(0);
      //  return;
      //}

      this.searchRequest.CollegeId = this.InstituteID;
      this.searchRequest.StatusID = 3;
      this.searchRequest.EquipmentsId = TradeId;

      await this.itiInventoryService.GetAllDDL(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          const selectOption = { EquipmentsId: 0, Name: '--Select--' };
          this.CatogaryDDLList = [selectOption, ...data['Data']];

           this.DGET_Details();


        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      this.loaderService.requestEnded();
    }
  }

 
  async DGET_Details() {
    
    try {
      this.loaderService.requestStarted();
      debugger
      //if (!TradeId || TradeId === 0) {
      //  this.EquipmentsDDLList = [{ EquipmentsId: 0, Name: '--Select--' }];
      //  this.AddItemsRequestFormGroup.get('EquipmentsId')?.setValue(0);
      //  return;
      //}

      this.searchRequest.CollegeId = this.InstituteID;

      await this.itiInventoryService.GetConsumeItemList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ItemsDDLList = data.Data;

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      this.loaderService.requestEnded();
    }
  }


  getTradeNameById(id: any): string {
    const selectedTrade = this.TradeDDLList.find((item: any) => item.TradeId === id);
    return selectedTrade ? selectedTrade.Name : '';
  }


  getCategoryNameById(id: any): string {
    const selectedCategory = this.CategoryDDLList.find((item: any) => item.ID === id);
    return selectedCategory ? selectedCategory.Name : '';
  }


  updateTable() {
    const trade = this.getTradeNameById(this.request.TradeId);
    const category = this.getCategoryNameById(this.request.ItemCategoryId);


    if (trade && category) {
      const newItem = {
        trade: trade,
        category: category,
      };
      this.selectedItems = [newItem];

      this.showDetailsTable = true;
      console.log("Updated selectedItems:", this.selectedItems);
    }
  }




  async ResetControl() {
    this.isSubmitted = false;
    this.request = new ItemsDataModels();
    this.AddItemsRequestFormGroup.reset({
      EquipmentsId: 0,
      ItemCategoryId: 0
    });
  }


}
