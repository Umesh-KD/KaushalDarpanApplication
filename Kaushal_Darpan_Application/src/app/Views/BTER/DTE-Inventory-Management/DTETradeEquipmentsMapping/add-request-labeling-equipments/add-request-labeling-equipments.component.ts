import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../../Common/appsetting.service';
import { EnumRole, EnumStatus } from '../../../../../Common/GlobalConstants';
import { DTEItemsSearchModel } from '../../../../../Models/DTEInventory/DTEItemsDataModels';
import { DTETradeEquipmentsMappingData } from '../../../../../Models/DTEInventory/DTETradeEquipmentsMappingData';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { DTEEquipmentsMasterService } from '../../../../../Services/DTEInventory/DTEEquipmentsMaster/dteequipments-master.service';
import { DTEItemCategoriesMasterService } from '../../../../../Services/DTEInventory/DTEItemCategoriesMaster/dteItemcategories-master.service';
import { DteItemUnitMasterService } from '../../../../../Services/DTEInventory/DTEItemUnitMaster/DTEItemunit-master.service';
import { DteTradeEquipmentsMappingService } from '../../../../../Services/DTEInventory/DTETradeEquipmentsMapping/dtetrade-equipments-mapping.service';
import { LoaderService } from '../../../../../Services/Loader/loader.service';

@Component({
  selector: 'app-add-request-labeling-equipments',
  templateUrl: './add-request-labeling-equipments.component.html',
  styleUrls: ['./add-request-labeling-equipments.component.css'],
  standalone: false
})
export class AddRequestLabelingEquipmentsComponent {
  public request = new DTETradeEquipmentsMappingData()
  public TE_MappingId: number = 0;
  public ItemCategoryId: number = 0;
  public EquipmentsId: number = 0;
  public TradeId: number = 0;
  public SearchItemReq = new DTEItemsSearchModel()
  public TradeTypeId: number = 0;
  public RequestFormGroup!: FormGroup;
  public maxQty: number = 0;
  _EnumRole = EnumRole;
  public isRequested: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isSubmitted1: boolean = false;
  public isSubmitted2: boolean = false;
  public isSubmitted3: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = "";
  public TradeDDLList: any = [];
  public CategoryddlList: any = [];
  public EquipmentddlList: any = [];
  public ItemddlList: any = [];
  public categoriesList: any = [];
  public UnitDDLList: any = [];
  public InstituteMasterList: any = [];
  public FileName: string = '';
  constructor(
    private toastr: ToastrService,
    private itemUnitMasterService: DteItemUnitMasterService,
    private commonFunctionService: CommonFunctionService,
    private tradeEquipmentsMappingService: DteTradeEquipmentsMappingService,
    private equipmentsMasterService: DTEEquipmentsMasterService,
    private itemCategoriesService: DTEItemCategoriesMasterService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    public appsettingConfig: AppsettingService,
  ) { }


  async ngOnInit() {
    this.RequestFormGroup = this.formBuilder.group({
      ddlEquipmentsId: ['', [DropdownValidators]],
      ddlCategoryId: ['', [DropdownValidators]],
      ddlInstituteID: ['', [DropdownValidators]],
      txtTotalPrice: ['', [Validators.required]],
      txtPricePerUnit: ['', [Validators.required]],
      txtQuantity: [{ value: '', disabled: true }],
      ApprovedQuantity: ['', [Validators.required]],
      Specification: ['', [Validators.required]],
      //txtVoucherNumber: ['', [Validators.required]],
      txtVoucherNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4,}$/) // At least 4 digits
        ]
      ],
      IdentificationMark: [''],
      CampanyName: ['', Validators.required],
    });


    this.activatedRoute.paramMap.subscribe(params => {
      this.request.InstituteID = Number(params.get('id'));
      this.request.CategoryId = Number(params.get('category'));
      this.request.EquipmentId = Number(params.get('equipment'));
      this.request.Quantity = Number(params.get('quantity'));
      this.request.MappingId = Number(params.get('mappingid'));
      const indentDoc = params.get('indentdoc');
      this.request.IndentDocument = indentDoc || 'Indent does not exist !';
      console.log(this.request.IndentDocument);

      //this.FileName = indentDoc || '';
      if (Number(params.get('equipment')) > 0) {
        this.isRequested = true;
      }
      
      this.sSOLoginDataModel =  JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      if (
        this.sSOLoginDataModel.RoleID == this._EnumRole.DTEDegreeCourse1stYear || 
        this.sSOLoginDataModel.RoleID == this._EnumRole.DTEDegreeCourse2ndYear || 
        this.sSOLoginDataModel.RoleID == this._EnumRole.DTE || 
        this.sSOLoginDataModel.RoleID == this._EnumRole.DIRECTOR ||
        this.sSOLoginDataModel.RoleID == this._EnumRole.DTENON || 
        this.sSOLoginDataModel.RoleID == this._EnumRole.NodalVerifier || 
        this.sSOLoginDataModel.RoleID == this._EnumRole.Admin || 
        this.sSOLoginDataModel.RoleID == this._EnumRole.AdminNon || 
        this.sSOLoginDataModel.RoleID == this._EnumRole.DTELateral
      )  {
        this.RequestFormGroup.get('ddlInstituteID')?.disable();
        this.RequestFormGroup.get('ddlCategoryId')?.disable();
        this.RequestFormGroup.get('ddlEquipmentsId')?.disable();      

      }
    });

    this.TE_MappingId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    if (this.TE_MappingId > 0) {
      await this.GetByID(this.TE_MappingId);
    }
    await this.GetCategoryDDL();
    await this.CategoryWiseEquiments();
    await this.GetUnitDDL();
    await this.GetTradeDDL();
    await this.GetMasterData();    
  }

  get _RequestFormGroup() { return this.RequestFormGroup.controls; }

  async CategoryWiseEquiments() { 
    await this.GetEquipmentDDL();
    const selectedCategoryId = this.RequestFormGroup.get('ddlCategoryId')?.value;
    if (selectedCategoryId && selectedCategoryId > 0) {
      this.request.CategoryId = selectedCategoryId;
      this.GetEquipmentDDL();
    } else {
      this.EquipmentddlList = [];
      // this.request.EquipmentId = null;
      this.RequestFormGroup.get('ddlEquipmentsId')?.reset();
    }

  } 


  customSearch(term: string, item: any) {
    if (!term) return true;  // If no search term is provided, show all items.
    return item.Name.toLowerCase().includes(term.toLowerCase());  // Filter based on item Name
  }

  customSearch1(term: string, item: any) {
    if (!term) return true;  // If no search term is provided, show all items.
    return item.StreamName.toLowerCase().includes(term.toLowerCase());  // Filter based on item Name
  }

  //New Added

  calculateTotalPrice(): void {
   
    const quantity = this.request.ApprovedQuantity ?? 0;
    const pricePerUnit = this.request.PricePerUnit ?? 0;
    // Calculate total price
    this.request.TotalPrice = quantity * pricePerUnit;
  }

  onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '').slice(0, 4);

    // Clamp the value to min and max if needed
    const numericValue = Math.max(1, Math.min(Number(value), this.maxQty || Infinity));

    // Update the input field and model
    input.value = numericValue.toString();
    this.request.Quantity = numericValue;
    // this.calculateTotalPrice();
  }
  onApprovedQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '').slice(0, 4);

    // Clamp the value to min and max if needed
    const numericValue = Math.max(1, Math.min(Number(value), this.maxQty || Infinity));

    // Update the input field and model
    input.value = numericValue.toString();
    this.request.ApprovedQuantity = numericValue;
    if (
      this.request &&
      this.request.ApprovedQuantity != null &&
      this.request.Quantity != null &&
      this.request.ApprovedQuantity > this.request.Quantity
    ) {
      this.request.ApprovedQuantity = 0;
      this.toastr.warning('Approved Quantity should not be greater than Quantity');
      return;
    }
    this.calculateTotalPrice();
  }

  async EquimentsWiseQty() {
    const selectedItem = this.EquipmentddlList.find((item: any) => item.ID == this.request.EquipmentId);
    const qty = selectedItem ? selectedItem.Quantity : null;
    this.maxQty = qty
  }

  async saveData() {
   debugger
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.isSubmitted = true;


    const formValue = this.RequestFormGroup.getRawValue();

    if (
      formValue.CampanyName != null &&
      formValue.IdentificationMark != null &&
      formValue.ddlCategoryId != null &&
      formValue.ddlEquipmentsId != null &&
      formValue.txtPricePerUnit != null &&
      Number(formValue.txtPricePerUnit) > 0 &&
      formValue.ApprovedQuantity != null &&
      formValue.ApprovedQuantity > 0 &&
      formValue.txtTotalPrice != null &&
      formValue.txtTotalPrice > 0 &&
      formValue.txtVoucherNumber != null
    )
    { 

      //Show Loading
      this.loaderService.requestStarted();
      this.isLoading = true;

      try {

        if (this.TE_MappingId) {
          this.request.TE_MappingId = this.TE_MappingId
          this.request.ModifyBy = this.sSOLoginDataModel.UserID;
        } else {
          this.request.CreatedBy = this.sSOLoginDataModel.UserID;
        }
        this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        this.request.TradeIdTypeId = this.sSOLoginDataModel.Eng_NonEng;

        await this.tradeEquipmentsMappingService.SaveEquipmentsMappingRequestData(this.request)
          .then((data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message)
              this.ResetControl();
              
              this.routers.navigate(['/add-request-dte-equipments']);
              //this.GetAllData();
              //if (this.isRequested == true) {

              //}
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning('This request has already been actioned.');
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

    } else {
      return console.log("Form is invalid, cannot submit")
    }
    
  }

  async GetByID(id: number) {
    
    try {
      this.loaderService.requestStarted();

      await this.tradeEquipmentsMappingService.GetByID(id)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          this.request.TE_MappingId = data['Data']["TE_MappingId"];
          this.request.CategoryId = data['Data']["CategoryId"];
          this.GetCategoryDDL();
          this.request.EquipmentId = data['Data']["EquipmentId"];
          this.request.InstituteID = data['Data']["InstituteID"];
          this.request.TradeId = data['Data']["TradeId"];
          this.request.Quantity = data['Data']["Quantity"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
          this.request.IndentDocument = data['Data']["ModifyBy"];
          this.request.ApprovedQuantity = data['Data']["ApprovedQuantity"];
          console.log(data)
          
          this.RequestFormGroup.patchValue({
            ItemCategoryId: data['Data']['ItemCategoryId']
          })
         
           this.CategoryWiseEquiments();
          

          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
        

      //if (this.sSOLoginDataModel.RoleID == this._EnumRole.DTEDegreeCourse1stYear || this.sSOLoginDataModel.RoleID == this._EnumRole.DTEDegreeCourse2ndYear || this.sSOLoginDataModel.RoleID == this._EnumRole.DTE || this.sSOLoginDataModel.RoleID == this._EnumRole.DTENON || this.sSOLoginDataModel.RoleID == this._EnumRole.NodalVerifier || this.sSOLoginDataModel.RoleID == this._EnumRole.Admin || this.sSOLoginDataModel.RoleID == this._EnumRole.AdminNon || this.sSOLoginDataModel.RoleID == this._EnumRole.DTELateral)  {
      //  this.RequestFormGroup.get('ddlInstituteID')?.disable();
      //}

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
    this.isSubmitted1 = false;
    this.isSubmitted2 = false;
    this.isSubmitted3 = false;
    this.request = new DTETradeEquipmentsMappingData();
    this.RequestFormGroup.reset();
  }


  async GetCategoryDDL() {
    
    try {
      this.loaderService.requestStarted();
      await this.itemCategoriesService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          const selectOption = { ItemCategoryID: 0, Name: '--Select--' };
          this.CategoryddlList = [selectOption, ...data['Data']];
          console.log(this.CategoryddlList, 'test data categoryList');
          //this.CategoryddlList = data['Data'];
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
      this.isLoading = true;

      this.SearchItemReq.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.SearchItemReq.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.SearchItemReq.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.SearchItemReq.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.SearchItemReq.RoleID = this.sSOLoginDataModel.RoleID;

      await this.equipmentsMasterService.GetAllData(this.SearchItemReq).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        const selectOption = { EquipmentsId: 0, Name: '--Select--' };
        this.EquipmentddlList = [selectOption, ...data['Data']];
        this.EquipmentddlList = this.EquipmentddlList.filter((item: any) =>
          item.ItemCategoryID === this.RequestFormGroup.get('ddlCategoryId')?.value
        );

        // Reset selected Equipment ID
        //this.RequestFormGroup.get('ddlEquipmentsId')?.reset();
        //this.request.EquipmentId = null;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async GetTradeDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          const selectOption = { StreamID: 0, StreamName: '--Select--' };
          this.TradeDDLList = [selectOption, ...data['Data']];
          //this.TradeDDLList = data['Data'];
          //console.log(this.TradeDDLList)
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

  async GetUnitDDL() {
    try {
      this.loaderService.requestStarted();
      await this.itemUnitMasterService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UnitDDLList = data['Data'];
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

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
          console.log(this.InstituteMasterList,"InstituteMasterList")
        }, (error: any) => console.error(error));
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

  closeModal() {
    this.modalReference?.close();
    this.ResetControl();
  }

  validateNumber(event: KeyboardEvent): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.keyCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
