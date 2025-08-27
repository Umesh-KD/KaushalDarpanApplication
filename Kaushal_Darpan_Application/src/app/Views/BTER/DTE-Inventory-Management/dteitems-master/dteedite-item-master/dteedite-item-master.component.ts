import { Component } from '@angular/core';
import { ItemsDataModels, ItemsDetailsModel, ItemsDetailsInterface } from '../../../../../Models/ItemsDataModels';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../../Common/SweetAlert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { DteItemsMasterService } from '../../../../../Services/DTEInventory/DTEItemsMaster/dteitems-master.service';
import { EnumRole, EnumStatus } from '../../../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { uniqueEquipmentCodeValidator } from '../../../../../Pipes/uniqueEquipmentCodeValidator';
import { debounceTime } from 'rxjs';
import { CheckItemAuctionSearch, EquipmentCodeDuplicateSearch } from '../../../../../Models/DTEInventory/DTEItemsDataModels';

@Component({
  selector: 'app-dteedite-item-master',
  standalone: false,
  templateUrl: './dteedite-item-master.component.html',
  styleUrl: './dteedite-item-master.component.css'
})
export class DteEditeItemMasterComponent {
  public request = new ItemsDataModels()
  public itemDetails = new ItemsDetailsModel();
  public searchdata = new EquipmentCodeDuplicateSearch();
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public dnone: boolean = false;
  public UserID: number = 0;
  public DetailsId: number = 0;
  public State: number = 0;
  public IsDuplicate: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public EditeItemsRequestFormGroup!: FormGroup;
  public Itemdetails: any[] = [];
  public ItemDetailsList: any[] = [];
  public _EnumRole = EnumRole;
  public errorLList: any = [];
  public CheckAuctionSearch = new CheckItemAuctionSearch();
  constructor(
    private dteItemsMasterService: DteItemsMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal) { }

  async ngOnInit() {
    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    if (this.ItemId > 0) {
      await this.GetByID(this.ItemId);
      await this.getItemDetails(this.ItemId);
      await this.GetAllItemDetails(); // Populates ItemDetailsList
    }

    // ✅ Initialize form group after data is loaded
    this.EditeItemsRequestFormGroup = this.formBuilder.group({
      items: this.formBuilder.array([], uniqueEquipmentCodeValidator)
    });

    // ✅ Add controls based on fetched data
    this.addItemsControls();

    // ✅ Disable status where needed


    debugger
    this.itemsFormArray.controls.forEach((group, index) => {
      const equipmentWorking = this.ItemDetailsList[index]?.EquipmentWorking;
      const AuctionStatus = this.ItemDetailsList[index]?.AuctionStatus;

      

      if (AuctionStatus == 1) {
        // Disable the status control
        group.get('equipmentStatus')?.disable();
        //if (group.get('equipmentStatus')?.disabled) {
        //  group.get('equipmentStatus')?.enable({ emitEvent: false });
        //}
  }
});

// Call this in valueChanges or when adding/removing rows
//this.itemsFormArray.valueChanges.subscribe(() => {
//  this.itemsFormArray.updateValueAndValidity({ onlySelf: true });
//});

this.itemsFormArray.get('items')?.valueChanges
  .pipe(debounceTime(200))  // optional
  .subscribe(() => this.markDuplicateCodes());
  }
  get itemsFormArray(): FormArray {
  return (this.EditeItemsRequestFormGroup?.get('items') as FormArray) ?? this.formBuilder.array([]);
}

  //createItem(): FormGroup {
  //  return this.formBuilder.group({
  //    txtEquipmentCode: ['', [Validators.required]],
  //    equipmentStatus: ['', [DropdownValidators]],
  //    isOption: [''],
  //    ItemDetailsId: [''],
  //    EquipmentCode: ['']
  //  });
  //}
  async GetAllItemDetails() {
  if (this.ItemId != null && this.ItemId != undefined && this.ItemId > 0) {
    await this.dteItemsMasterService.GetAllDTEItemDetails(this.ItemId).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      if (data.State === EnumStatus.Success) {
        this.ItemDetailsList = data.Data;


        this.addItemsControls();
      }
    });
  }
}
addItemsControls() {
  if (this.ItemDetailsList?.length > 0) {
    this.ItemDetailsList.forEach((item, index) => {
      this.itemsFormArray.push(this.formBuilder.group({
        txtEquipmentCode: [item.EquipmentCode ?? 0, [Validators.required]],
        equipmentStatus: [item.EquipmentWorking ?? 0, [DropdownValidators]],
        isOption: [item.isOption],
        ItemDetailsId: [item.ItemDetailsId],
        EquipmentCode: [item.EquipmentsCode],
      }));
    });

  }
}
  get _EditeItemsRequestFormGroup() { return this.EditeItemsRequestFormGroup.controls; }

  async BackControl() {
  this.routers.navigate(['/DteItemsMasterList']);
}

  async GetByID(id: number) {
  try {
    this.loaderService.requestStarted();
    await this.dteItemsMasterService.GetByID(id)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data && data.Data && data.Data.Quantity) {
          this.request.TradeId = data['Data']["TradeId"];
          this.request.EquipmentsId = data['Data']["EquipmentsId"];
          this.request.CampanyName = data['Data']["CampanyName"];
          this.request.ItemCategoryId = data['Data']["ItemCategoryId"];
          this.request.IdentificationMark = data['Data']["IdentificationMark"];
          this.request.VoucherNumber = data['Data']["VoucherNumber"];
          this.request.Quantity = data['Data']["Quantity"];
          this.request.PricePerUnit = data['Data']["PricePerUnit"];
          this.request.TotalPrice = data['Data']["TotalPrice"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";
        }
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
  markDuplicateCodes() {
  const formArray = this.itemsFormArray.get('items') as FormArray;
  const seen = new Map<string, number[]>();

  // Track all values and their indexes
  formArray.controls.forEach((ctrl, idx) => {
    const code = ctrl.get('txtEquipmentCode')?.value?.trim();
    if (!code) return;

    if (!seen.has(code)) {
      seen.set(code, []);
    }
    seen.get(code)?.push(idx);
  });

  // Clear previous 'notUnique' errors
  formArray.controls.forEach(ctrl => {
    const field = ctrl.get('txtEquipmentCode');
    if (field?.hasError('notUnique')) {
      const errors = { ...field.errors };
      delete errors['notUnique'];
      field.setErrors(Object.keys(errors).length ? errors : null);
    }
  });

  // Add 'notUnique' error to duplicates
  seen.forEach(indexes => {
    if (indexes.length > 1) {
      indexes.forEach(idx => {
        const ctrl = formArray.at(idx).get('txtEquipmentCode');
        const errors = ctrl?.errors || {};
        errors['notUnique'] = true;
        ctrl?.setErrors(errors);
      });
    }
  });
}


  async saveData() {
  this.itemDetails.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  this.itemDetails.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.itemDetails.ItemId = this.ItemId;

    this.itemsFormArray.controls.forEach(control => {
      const code = (control.get('txtEquipmentCode')?.value || '').trim();
      if (code === '0') {
        control.get('txtEquipmentCode')?.setErrors({ invalidZero: true });
      }
    });


  //this.itemDetails.ItemDetailsId = this.ItemDetailsList.ItemDetailsId
  this.isSubmitted = true;
  if (this.EditeItemsRequestFormGroup.invalid) {
    return console.log("Form is invalid, cannot submit");
  }

  // Step 2: Custom validation for Not Working items (equipmentStatus == 2)
  let hasError = false;
  this.itemsFormArray.controls.forEach((group, index) => {
    const equipmentStatus = group.get('equipmentStatus')?.value;
    const isOption = group.get('isOption')?.value;
  });

  if (hasError) {
    this.toastr.warning("Please check 'Is Auction' for all 'Not Working' items After submitting.");
    return;
    }
  // Create a list of ItemsDetailsModel objects from the form data
    const itemsList: ItemsDetailsInterface[] = this.itemsFormArray.getRawValue().map((item: any, index: number) => ({
      EquipmentWorking: item.equipmentStatus,
      EquipmentCode: item.txtEquipmentCode,
      isOption: item.isOption,
      ItemId: this.ItemId,
      ItemDetailsId: item.ItemDetailsId,
      Item: this.ItemDetailsList[index]?.ItemCode
    }));

  try {
    // Add additional fields to the request if modifying an existing item
    if (this.ItemId) {
      this.itemDetails.ItemId = this.ItemId;
      this.itemDetails.ModifyBy = this.sSOLoginDataModel.UserID;
    } else {
      this.itemDetails.CreatedBy = this.sSOLoginDataModel.UserID;
    }
    await this.dteItemsMasterService.UpdateDTEItemData(itemsList).then((data: any) => {
      this.State = data['State'];
      this.Message = data['Message'];
      this.ErrorMessage = data['ErrorMessage'];

      if (this.State === EnumStatus.Success) {
        this.toastr.success(this.Message);
        this.GetAllItemDetails();
        this.routers.navigate(['/DteItemsMasterList']);
      } else if (this.State === EnumStatus.Error) {
        this.toastr.error(this.ErrorMessage);
      }
    });
    this.loaderService.requestStarted();
    this.isLoading = true;

  } catch (ex) {
    console.log(ex);
  }
  finally {
    setTimeout(() => {
      this.loaderService.requestEnded();
      this.isLoading = false;
    }, 200);
  }
}

  async getItemDetails(id: number) {
  try {
    this.loaderService.requestStarted();
    await this.dteItemsMasterService.GetDTEItemDetails(id)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data && data.Data.Quantity) {
          this.itemDetails.Item = data['Data']["Item"];
          this.itemDetails.Category = data['Data']["Category"];
          this.itemDetails.Quantity = data['Data']["Quantity"];
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";
        }
      }, error => console.error(error));
  }
  catch (Ex) {
    console.log(Ex);
  }
}

  async ResetControl() {
  this.isSubmitted = false;
  this.request = new ItemsDataModels();
  this.EditeItemsRequestFormGroup.reset({
    EquipmentCode: 0,
    EquipmentWorking: 0,
    isOption: false,
  });
  this.itemsFormArray.clear();
}

getRange(quantity: string | number): number[] {
  const qty = +quantity;  // Ensure quantity is a number
  return new Array(qty).fill(0).map((_, index) => index);
}

 
  clearIfZero(item: FormGroup, controlName: string) {
    if (item.get(controlName)?.value === '0' || item.get(controlName)?.value === 0) {
      item.get(controlName)?.setValue('');
    }
  }
  
  resetIfEmpty(item: FormGroup, controlName: string) {
    if (!item.get(controlName)?.value) {
      item.get(controlName)?.setValue('');
    }
  }

  async equipmentCodeDuplicate(currentValue: string, index: number, categoryName:string) {
    if (!currentValue) return;

    const normalized = currentValue.trim().toUpperCase(); // normalize for comparison
    if (!normalized) return;
    
    try {
      this.loaderService.requestStarted();

      debugger

      this.searchdata.ItemCategoryName = categoryName;
      this.searchdata.EquipmentsCode = currentValue;
      const data: any = await this.dteItemsMasterService.EquipmentCodeDuplicate(this.searchdata);

      // If API returns an array from SQL
      if (data && data.State === 3) {
        this.Message = data.Message;
        this.IsDuplicate = data.IsDuplicate;

        this.toastr.warning(`Duplicate Equipment Code: ${normalized}`)
        this.itemsFormArray.at(index).get('txtEquipmentCode')?.setValue('0');

       
      }
      // If API returns a single object
      else if (data && data.State === 1) {
        this.Message = data.Message;
        this.IsDuplicate = data.IsDuplicate;

        const otherValues = this.itemsFormArray.controls
          .map((ctrl, i) => i !== index ? (ctrl.get('txtEquipmentCode')?.value || '').trim().toUpperCase() : null)
          .filter(v => !!v); // remove null/empty

        if (otherValues.includes(normalized)) {
          /*alert();*/
          this.toastr.warning(`Duplicate Equipment Code: ${normalized}`)
          this.itemsFormArray.at(index).get('txtEquipmentCode')?.setValue('0');


        }

      }
    }
    catch (ex) {
      console.error('Error checking duplicate code:', ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

    // Collect all values excluding the current index
   


    
  }




//  equipmentCodeDuplicate(currentValue: string, categoryId: number) {
//  if (!currentValue) return;

//  const values = this.itemsFormArray.controls
//    .map(control => control.get('txtEquipmentCode')?.value)
//    .filter(value => value); // remove empty values

//  // Check duplicates excluding the current occurrence
//  const duplicateCount = values.filter(code => code === currentValue).length;

//  if (duplicateCount > 1) {
//    alert(`Duplicate Equipment Code: ${currentValue}`);
//    // Optionally reset the control value
//    const currentControl = this.itemsFormArray.controls.find(
//      control => control.get('txtEquipmentCode')?.value === currentValue
//    );
//    if (currentControl) {
//      currentControl.get('txtEquipmentCode')?.setValue('');
//    }
//  }
//}

  //async equipmentCodeDuplicate(code: string, categoryId: number) {
  //  debugger
  //  try {
  //    this.loaderService.requestStarted();

     

  //    this.searchdata.ItemCategoryId = categoryId;
  //    this.searchdata.EquipmentsCode = code;
  //    const data: any = await this.dteItemsMasterService.EquipmentCodeDuplicate(this.searchdata);

  //    // If API returns an array from SQL
  //    if (Array.isArray(data) && data.length > 0) {
  //      this.Message = data[0].Message;
  //      this.IsDuplicate = data[0].IsDuplicate;
  //    }
  //    // If API returns a single object
  //    else if (data) {
  //      this.Message = data.Message;
  //      this.IsDuplicate = data.IsDuplicate;
  //    }
  //  }
  //  catch (ex) {
  //    console.error('Error checking duplicate code:', ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

}
