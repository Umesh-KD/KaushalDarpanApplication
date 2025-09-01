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
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { ITIInventoryService } from '../../../../../Services/ITI/ITIInventory/iti-inventory.service';


@Component({
  selector: 'app-iti-add-items-master',
  templateUrl: './iti-add-items-master.component.html',
  styleUrls: ['./iti-add-items-master.component.css'],
  standalone: false
})
export class ITIAddItemsMasterComponent {
  public request = new ItemsDataModels()
  public searchTradeRequest = new ITITradeSearchModel();
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public AddItemsRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public Table_SearchText: string = "";
  public EquipmentsDDLList: any = [];
  public TradeDDLList: any = [];
  public CategoryDDLList: any = [];
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
      txtTotalPrice: ['', [Validators.required, Validators.pattern(GlobalConstants.AllowNumbersPattern),]],
      txtPricePerUnit: ['', [Validators.required, Validators.pattern(GlobalConstants.AllowNumbersPattern),]],
      txtQuantity: ['', [Validators.required]],
      txtVoucherNumber: ['', [Validators.required, Validators.pattern(GlobalConstants.AllowNumbersPattern),]],
      //txtUnit: [''],

      IdentificationMark: ['', Validators.required],
      CampanyName: ['', Validators.required],
      //TradeId: ['', [DropdownValidators]],
      ItemCategoryId: ['', [DropdownValidators]],
      EquipmentsId: ['0', [DropdownValidators]],
      ItemType: ['0', [DropdownValidators]],
      TradeId: ['-1', [DropdownValidators]],
      IsConsume:['']
    });

    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    //await this.GetEquipmentDDL();
    await this.ddlCategory_Change();
    await this.GetTradeDDL();
    if (this.ItemId > 0) {
      await this.GetByID(this.ItemId);
    }
    this.ItemtypeList = [{ID:0,Name:'Select'}, { ID: 1, Name: 'Building' }, {ID:2,Name:'Trade'}]

  }

  get _AddItemsRequestFormGroup() { return this.AddItemsRequestFormGroup.controls; }

  customSearch(term: string, item: any) {
    if (!term) return true;  // If no search term is provided, show all items.
    return item.Name.toLowerCase().includes(term.toLowerCase());  // Filter based on item Name
  }

  customSearch1(term: string, item: any) {
    if (!term) return true;  // If no search term is provided, show all items.
    return item.StreamName.toLowerCase().includes(term.toLowerCase());  // Filter based on item Name
  }

  calculateTotalPrice(): void {
    const quantity = this.request.Quantity ?? 0;
    const pricePerUnit = this.request.PricePerUnit ?? 0;
    // Calculate total price
    this.request.TotalPrice = quantity * pricePerUnit;
  }

  async OnItemTypeChange() {

  }

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

    this.RefereshValoidators()
   
    if (this.AddItemsRequestFormGroup.invalid) {
      /*return console.log("Form is invalid, cannot submit")*/
      //this.toastr.warning("Form is invalid, cannot submit")
      //Object.keys(this.AddItemsRequestFormGroup.controls).forEach(key => {
      //    const control = this.AddItemsRequestFormGroup.get(key);
 
      //    if (control && control.invalid) {
      //      this.toastr.error(`Control ${key} is invalid`);
      //      Object.keys(control.errors!).forEach(errorKey => {
      //        this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
      //      });
      //    }
      //  });
      //return;
    }
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
        

          this.ddlEquipment_Change1();
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

 

  //async GetTradeDDL() {
  //  try {
  //    this.loaderService.requestStarted();
  //    //await this.ItiTradeService.GetAllData(this.searchTradeRequest)
  //    await this.commonFunctionService.StreamMaster()
  //      .then((data: any) => {
  //        console.log(data)
  //        data = JSON.parse(JSON.stringify(data));
  //        this.TradeDDLList = data['Data'];
  //        console.log(this.TradeDDLList)
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async GetTradeDDL() {
    try {
      this.loaderService.requestStarted();
      //await this.ItiTradeService.GetAllData(this.searchTradeRequest)
      //await this.commonFunctionService.StreamMaster()
      await this.commonFunctionService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          //this.TradeDDLList = data['Data'];
          //console.log(this.TradeDDLList)
          const selectOption = { ID: -1, Name: '--Select--' };
          this.TradeDDLList = [selectOption, ...data['Data']];
          this.request.TradeId=-1
          this.AddItemsRequestFormGroup.get('TradeId')?.setValue(-1);  
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

  //async ddlCategory_Change() {

  //  try {
  //    this.loaderService.requestStarted();
  //    await this.itiInventoryService.GetAllCategoryMaster()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        const selectOption = { ID: 0, Name: '--Select--' };
  //        this.CategoryDDLList = [selectOption, ...data['Data']];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async ddlEquipment_Change() {

  //  try {
  //    this.loaderService.requestStarted();
  //    await this.itiInventoryService.GetEquipment_Branch_Wise_CategoryWise(this.request.ItemCategoryId)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        const selectOption = { ID: 0, Name: '--Select--' };
  //        this.EquipmentsDDLList = [selectOption, ...data['Data']];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async ddlCategory_Change()
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


  async ddlEquipment_Change() {
    try {
      this.loaderService.requestStarted();
      debugger
      const categoryId = this.AddItemsRequestFormGroup.get('ItemCategoryId')?.value;

      if (!categoryId || categoryId === 0) {
        this.EquipmentsDDLList = [{ EquipmentsId: 0, Name: '--Select--' }];
        this.AddItemsRequestFormGroup.get('EquipmentsId')?.setValue(0);
        return;
      }
      await this.itiInventoryService.GetEquipment_Branch_Wise_CategoryWise(categoryId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          const selectOption = { EquipmentsId: 0, Name: '--Select--' };
          this.EquipmentsDDLList = [selectOption, ...data['Data']];
          this.AddItemsRequestFormGroup.get('EquipmentsId')?.setValue(0); 
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      this.loaderService.requestEnded();
    }
  }

  async ddlEquipment_Change1() {
    try {
      this.loaderService.requestStarted();
      debugger
      const categoryId = this.AddItemsRequestFormGroup.get('ItemCategoryId')?.value;

      if (!categoryId || categoryId === 0) {
        this.EquipmentsDDLList = [{ EquipmentsId: 0, Name: '--Select--' }];
        this.AddItemsRequestFormGroup.get('EquipmentsId')?.setValue(0);
        return;
      }
      await this.itiInventoryService.GetEquipment_Branch_Wise_CategoryWise(categoryId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          const selectOption = { EquipmentsId: 0, Name: '--Select--' };
          this.EquipmentsDDLList = [selectOption, ...data['Data']];
 
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
    
    await this.updateTable();
    this.showDetailsTable = true;
    this.EquimentsWiseQty();
  }
  EquimentsWiseQty() {

    const selectedItem = this.EquipmentsDDLList.find((item: any) => item.ID == this.request.EquipmentsId);
    const qty = selectedItem ? selectedItem.Quantity : null;
    this.maxQty = qty
  }

  getTradeNameById(id: any): string {
    const selectedTrade = this.TradeDDLList.find((item: any) => item.TradeId === id);
    return selectedTrade ? selectedTrade.Name : '';
  }


  getCategoryNameById(id: any): string {
    const selectedCategory = this.CategoryDDLList.find((item: any) => item.ID === id);
    return selectedCategory ? selectedCategory.Name : '';
  }

  getEquipmentNameById(id: any): string {
    const selectedEquipment = this.EquipmentsDDLList.find((item: any) => item.ID === id);
    return selectedEquipment ? selectedEquipment.Name : '';
  }

  getEquipmentUnitById(id: any): string {
    const selectedUnit = this.EquipmentsDDLList.find((item: any) => item.ID === id);
    return selectedUnit ? selectedUnit.Unit : '';
  }

  getEquipmentQuantityById(id: any): string {
    const selectedQuantity = this.EquipmentsDDLList.find((item: any) => item.ID === id);
    return selectedQuantity ? selectedQuantity.Quantity : '';
  }

  updateTable() {
    const trade = this.getTradeNameById(this.request.TradeId);
    const category = this.getCategoryNameById(this.request.ItemCategoryId);
    const equipment = this.getEquipmentNameById(this.request.EquipmentsId);
    const quantity = this.getEquipmentQuantityById(this.request.EquipmentsId);
    const unit = this.getEquipmentUnitById(this.request.EquipmentsId);

    if (trade && category && equipment) {
      const newItem = {
        trade: trade,
        category: category,
        equipment: equipment,
        quantity: quantity,
        unit: unit,
      };
      this.selectedItems = [newItem];

      this.showDetailsTable = true;
      console.log("Updated selectedItems:", this.selectedItems);
    }
  }


  onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '').slice(0, 4);

    // Clamp the value to min and max if needed
    const numericValue = Math.max(1, Math.min(Number(value), this.maxQty || Infinity));

    // Update the input field and model
    input.value = numericValue.toString();
    this.request.Quantity = numericValue;
    this.calculateTotalPrice();
  }
  //onQuantityChange(newQuantity: number) {
  //  debugger
  //  // Check if the input quantity is greater than maxQty
  //  if (newQuantity > this.maxQty) {
  //    this.request.Quantity = this.maxQty; // Limit the quantity to maxQty
  //    alert(`Quantity cannot exceed ${this.maxQty}`); // Optional alert
  //  }
  //}
  //async GetEquipmentDDL() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.equipmentsService.GetAllData()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.EquipmentsDDLList = data['Data'];

  //        console.log(this.EquipmentsDDLList)
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async GetCategoryDDL() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.ItemCategoriesService.GetAllData()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.CategoryDDLList = data['Data'];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async ResetControl() {
    this.isSubmitted = false;
    this.request = new ItemsDataModels();
    this.AddItemsRequestFormGroup.reset({
      EquipmentsId: 0,
      ItemCategoryId: 0
    });
  }


}
