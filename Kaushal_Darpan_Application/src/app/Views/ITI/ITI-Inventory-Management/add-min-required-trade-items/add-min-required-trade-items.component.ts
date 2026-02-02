import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ITIInventoryService } from '../../../../Services/ITI/ITIInventory/iti-inventory.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { AddMinRequiredItemDataModel, MinRequiredItemSearchModel } from '../../../../Models/ItemsDataModels';
import { EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
  selector: 'app-add-min-required-trade-items',
  standalone: false,
  templateUrl: './add-min-required-trade-items.component.html',
  styleUrl: './add-min-required-trade-items.component.css'
})
export class AddMinRequiredTradeItemsComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new AddMinRequiredItemDataModel();
  public searchReq = new MinRequiredItemSearchModel();

  public AddItemsRequestFormGroup!: FormGroup;

  public EquipmentsDDLList: any = [];
  public TradeDDLList: any = [];
  public CategoryDDLList: any = [];
  public UnitMasterList: any = [];

  public isSubmitted: boolean = false;
  public RequiredItemId: number = 0;
  public maxQty: number = 0;

  constructor(
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private itiInventoryService: ITIInventoryService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router
  ) { }

  async ngOnInit() {

    this.AddItemsRequestFormGroup = this.formBuilder.group({
      TradeId: ['0', [DropdownValidators]],
      ItemCategoryId: ['', [DropdownValidators]],
      EquipmentsId: ['0', [DropdownValidators]],
      RequiredQuantity: ['', [Validators.required]],
    });

    this.RequiredItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    await this.GetTradeDDL();
    await this.ddlCategory_Change();

    if(this.RequiredItemId > 0) {
      this.GetById();
    }
  }

  get _AddItemsRequestFormGroup() { return this.AddItemsRequestFormGroup.controls; }

  onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '').slice(0, 4);

    // Clamp the value to min and max if needed
    const numericValue = Math.max(1, Math.min(Number(value), this.maxQty || Infinity));

    // Update the input field and model
    input.value = numericValue.toString();
    this.request.RequiredQuantity = numericValue;
  }

  async GetTradeDDL() {    
    try {
      this.loaderService.requestStarted();
      let Searchrequests: any = {}
      Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      Searchrequests.TypeName = 'TradeList';
      
      await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(Searchrequests)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          this.TradeDDLList = data['Data'];
          console.log(this.TradeDDLList)
          this.AddItemsRequestFormGroup.get('TradeId')?.setValue(0);  
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

  async ddlEquipment_Change() {
    try {
      this.loaderService.requestStarted();      
      const categoryId = this.request.ItemCategoryId
      await this.itiInventoryService.GetEquipment_Branch_Wise_CategoryWise(categoryId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.EquipmentsDDLList = data['Data']
          console.log(this.EquipmentsDDLList);
          // this.AddItemsRequestFormGroup.get('EquipmentsId')?.setValue(0); 
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      this.loaderService.requestEnded();
    }
  }

  async ddlCategory_Change() {
    try {
      this.loaderService.requestStarted();
      await this.itiInventoryService.GetAllCategoryMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryDDLList = data['Data'];
        });
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async SaveMinRequiredItems_ITI_INV() {
    try {
      this.loaderService.requestStarted();

      // Object.keys(this.AddItemsRequestFormGroup.controls).forEach(key => {
      //    const control = this.AddItemsRequestFormGroup.get(key); 
      //    if (control && control.invalid) {
      //      this.toastr.error(`Control ${key} is invalid`);
      //      Object.keys(control.errors!).forEach(errorKey => {
      //        this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
      //      });
      //    }
      //  });
      if(this.AddItemsRequestFormGroup.invalid) {
        this.AddItemsRequestFormGroup.markAllAsTouched();
        this.toastr.error('Please enter required fields');
        return;
      }

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      await this.itiInventoryService.SaveMinRequiredItems_ITI_INV(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.routers.navigate(['/iti-min-required-item']);
        } else if(data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async ResetControl() {
    this.request = new AddMinRequiredItemDataModel();
  }

  async GetById() {
    try {
      this.searchReq.RequiredItemId = this.RequiredItemId;
      this.searchReq.Action = 'GetDataById';

      await this.itiInventoryService.GetMinRequiredItem_ITI_INV(this.searchReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.request = data.Data[0];
        this.request.RequiredItemId =  data.Data[0].RequiredItemId;
        this.ddlEquipment_Change();
        this.request.EquipmentsId = data['Data'][0]["EquipmentsId"];

      })
    } catch (error) {
      console.error(error);
    }
  }
}
