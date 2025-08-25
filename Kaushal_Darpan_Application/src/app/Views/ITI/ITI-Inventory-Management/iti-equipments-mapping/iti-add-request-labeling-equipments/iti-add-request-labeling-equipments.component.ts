import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants, EnumStatus, EnumDepartment } from '../../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ITITradeDataModels, ITITradeSearchModel } from '../../../../../Models/ITITradeDataModels';
import { ItiTradeService } from '../../../../../Services/iti-trade/iti-trade.service';
import { ItemCategoriesDataModels } from '../../../../../Models/ItemCategoriesDataModels';
import { EquipmentsDataModels } from '../../../../../Models/EquipmentsDataModels';
import { DTETradeEquipmentsMappingData } from '../../../../../Models/DTEInventory/DTETradeEquipmentsMappingData';
import { DTEItemCategoriesDataModels } from '../../../../../Models/DTEInventory/DTEItemCategoriesDataModels';
import { DTEEquipmentsDataModel } from '../../../../../Models/DTEInventory/DTEEquipmentsDataModel';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { DTEItemsSearchModel } from '../../../../../Models/DTEInventory/DTEItemsDataModels';
import { ITIInventoryService } from '../../../../../Services/ITI/ITIInventory/iti-inventory.service';

@Component({
  selector: 'app-iti-add-request-labeling-equipments',
  templateUrl: './iti-add-request-labeling-equipments.component.html',
  styleUrls: ['./iti-add-request-labeling-equipments.component.css'],
  standalone: false
})
export class ITIAddRequestLabelingEquipmentsComponent {
  public searchTradeRequest = new ITITradeSearchModel();
  public request = new DTETradeEquipmentsMappingData()
  public requestTrade = new ITITradeDataModels()
  public requestCategorie = new DTEItemCategoriesDataModels()
  public requestEquipments = new DTEEquipmentsDataModel()
  public TE_MappingId: number = 0;
  public ItemCategoryId: number = 0;
  public EquipmentsId: number = 0;
  public TradeId: number = 0;
  public SearchItemReq = new DTEItemsSearchModel()
  public TradeTypeId: number = 0;
  public RequestFormGroup!: FormGroup;
  public CategoriesRequestFormGroup!: FormGroup;
  public EquipmentsRequestFormGroup!: FormGroup;
  TradegroupForm!: FormGroup;
  public maxQty: number = 0;

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
  showCollege: boolean = true;
  quantity: number = 0; 
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private itiInventoryService: ITIInventoryService,
    private commonFunctionService: CommonFunctionService,
    private ItiTradeService: ItiTradeService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal) { }


  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.request.InstituteID = Number(params.get('id'));
      this.request.CategoryId = Number(params.get('category'));
      this.request.EquipmentId = Number(params.get('equipment'));
      this.request.Quantity = Number(params.get('quantity'));
      if (Number(params.get('equipment')) > 0) {
        this.isRequested = true;
      }

    });
    this.RequestFormGroup = this.formBuilder.group({
      //ddlEquipmentsId: ['', [DropdownValidators]],
      //ddlCategoryId: ['', [DropdownValidators]],
      // ddlinstituteid: ['', [dropdownvalidators]],
      //txtTotalPrice: ['', [Validators.required]],
      //txtQuantity: ['', [Validators.required]],
      ddlEquipmentsId: [{ value: '', disabled: false }, [DropdownValidators]],
      ddlCategoryId: [{ value: '', disabled: false }, [DropdownValidators]],
      ddlInstituteID: [{ value: '', disabled: false }, [DropdownValidators]],
      txtTotalPrice: [{ value: '', disabled: false }, [Validators.required]],
      txtPricePerUnit: ['', [Validators.required]],
      txtQuantity: [{ value: '', disabled: false }, [Validators.required]],
      txtVoucherNumber: ['', [Validators.required]],
      IdentificationMark: ['', Validators.required],
      CampanyName: ['', Validators.required],
    });
    this.CategoriesRequestFormGroup = this.formBuilder.group({
      ItemCategoryName: ['', [Validators.required, Validators.pattern(GlobalConstants.NameNoNumbersPattern),]],
    });


    this.EquipmentsRequestFormGroup = this.formBuilder.group({
      txtName: ['', [Validators.required, Validators.pattern(GlobalConstants.NameNoNumbersPattern),]],
      Specification: ['', Validators.required],
      UnitId: ['', [DropdownValidators]],
    });


    this.TradegroupForm = this.fb.group({
      txtTradeName: ['', [Validators.required, Validators.pattern(GlobalConstants.NameNoNumbersPattern),]],
      txtTradeCode: ['', [Validators.required, Validators.pattern(GlobalConstants.AllowNumbersPattern),]],
      //txtTradeCode: ['', Validators.required],
    });

    this.TE_MappingId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetCategoryDDL();
    await this.CategoryWiseEquiments();
    await this.GetUnitDDL();
    await this.GetTradeDDL();
    await this.GetMasterData();
    if (this.TE_MappingId > 0) {
      await this.GetByID(this.TE_MappingId);
    }
    debugger  
    this.activatedRoute.params.subscribe(params => {
      this.quantity = +params['quantity'] || 0;
      this.showCollege = true; // always show dropdown

      // Step 3: Disable ddlInstituteID if quantity exists in URL
      if (this.quantity > 0) {
        this.RequestFormGroup.get('ddlInstituteID')?.disable();
        this.RequestFormGroup.get('txtQuantity')?.disable();
        this.RequestFormGroup.get('txtTotalPrice')?.disable();
        this.RequestFormGroup.get('ddlCategoryId')?.disable();
        this.RequestFormGroup.get('ddlEquipmentsId')?.disable();
      } else {
        this.RequestFormGroup.get('ddlInstituteID')?.enable();
        this.RequestFormGroup.get('txtQuantity')?.enable();
        this.RequestFormGroup.get('txtTotalPrice')?.enable();
        this.RequestFormGroup.get('ddlCategoryId')?.enable();
        this.RequestFormGroup.get('ddlEquipmentsId')?.enable();
      }
    });
  }

  get _RequestFormGroup() { return this.RequestFormGroup.controls; }
  get _CategoriesRequestFormGroup() { return this.CategoriesRequestFormGroup.controls; }
  get _EquipmentsRequestFormGroup() { return this.EquipmentsRequestFormGroup.controls; }
  get _TradeRequestFormGroup() { return this.TradegroupForm.controls; }

  async CategoryWiseEquiments() {
    

    await this.GetEquipmentDDL();

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
    debugger;
    const quantity = this.request.Quantity ?? 0;
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
    this.calculateTotalPrice();
  }

  async EquimentsWiseQty() {

    const selectedItem = this.EquipmentddlList.find((item: any) => item.ID == this.request.EquipmentId);
    const qty = selectedItem ? selectedItem.Quantity : null;
    this.maxQty = qty


  }

  async saveData() {
    debugger;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.isSubmitted = true;

    if (this.RequestFormGroup.value.CampanyName != null &&
      this.RequestFormGroup.value.IdentificationMark != null &&
      this.RequestFormGroup.getRawValue().ddlCategoryId != null &&
      this.RequestFormGroup.getRawValue().ddlEquipmentsId != null &&
      this.RequestFormGroup.getRawValue().ddlInstituteID != null &&
      this.RequestFormGroup.value.txtPricePerUnit != null &&
      Number(this.RequestFormGroup.value.txtPricePerUnit) > 0 &&
      this.RequestFormGroup.getRawValue().txtQuantity != null &&
      this.RequestFormGroup.getRawValue().txtQuantity > 0 &&
      this.RequestFormGroup.getRawValue().txtTotalPrice != null &&
      this.RequestFormGroup.getRawValue().txtTotalPrice > 0 &&
      this.RequestFormGroup.value.txtVoucherNumber != null) {
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
        this.request.OfficeID = this.sSOLoginDataModel.OfficeID;
        this.request.RoleID = this.sSOLoginDataModel.RoleID;
        this.request.TradeIdTypeId = this.sSOLoginDataModel.Eng_NonEng;

        await this.itiInventoryService.SaveEquipmentsMappingRequestData(this.request)
          .then((data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message)
              this.ResetControl();
              
              this.routers.navigate(['/iti-equipments-mapping']);
              //this.GetAllData();
              //if (this.isRequested == true) {

              //}
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

      await this.itiInventoryService.GetEquipmentsMappingByID(id)
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
          console.log(data)

         
           this.CategoryWiseEquiments();
          

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
    this.isSubmitted1 = false;
    this.isSubmitted2 = false;
    this.isSubmitted3 = false;
    this.requestCategorie = new ItemCategoriesDataModels();
    this.requestEquipments = new EquipmentsDataModels();
    this.requestTrade = new ITITradeDataModels();
  
    this.request.VoucherNumber = null;
    this.request.IdentificationMark = '';
    this.request.CompanyName = '';
    this.request.PricePerUnit = null;

    this.CategoriesRequestFormGroup.reset();
    this.TradegroupForm.reset();
    this.EquipmentsRequestFormGroup.reset();
  }


  async GetCategoryDDL() {
    
    try {
      this.loaderService.requestStarted();
      await this.itiInventoryService.GetAllCategoryMaster()
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
      this.SearchItemReq.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.SearchItemReq.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.SearchItemReq.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.SearchItemReq.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.SearchItemReq.RoleID = this.sSOLoginDataModel.RoleID;
      await this.itiInventoryService.GetAllEquipmentsMaster(this.SearchItemReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          const selectOption = { EquipmentsId: 0, Name: '--Select--' };
          this.EquipmentddlList = [selectOption, ...data['Data']];
          this.EquipmentddlList = this.EquipmentddlList.filter((item: any) => item.ItemCategoryID == this.request.CategoryId)
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
      // await this.commonFunctionService.StreamMaster()
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
      await this.itiInventoryService.GetAllItemUnitMaster()
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


  async onEquipmentSubmit(model: any) {
    try {
      this.isSubmitted1 = false;
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async onCategorySubmit(model: any) {
    try {
      this.isSubmitted3 = false;
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async onTradeSubmit(model: any) {
    this.isSubmitted2 = false;
    try {
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  async saveCategoriesData() {
    this.isSubmitted3 = true;
    if (this.CategoriesRequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.ItemCategoryId) {
        this.requestCategorie.ItemCategoryID = this.ItemCategoryId
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      await this.itiInventoryService.SaveCategoryMaster(this.requestCategorie)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetCategoryDDL();
            this.closeModal();
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


  async saveEquipmentsData() {
    this.isSubmitted1 = true;
    if (this.EquipmentsRequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.EquipmentsId) {
        this.requestEquipments.EquipmentsId = this.EquipmentsId
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      await this.itiInventoryService.SaveEquipmentsMasterData(this.requestEquipments)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetEquipmentDDL();
            this.closeModal();
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


  async saveTradeData() {
    this.isSubmitted2 = true;
    //this.isSubmitted = true;
    if (this.TradegroupForm.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.requestTrade.TradeTypeId = 1;

    try {

      if (this.TradeId) {
        this.requestTrade.TradeId = this.TradeId
        this.requestTrade.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.requestTrade.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      await this.ItiTradeService.SaveData(this.requestTrade)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetTradeDDL();
            this.closeModal();
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

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
          console.log('Institute Master List',this.InstituteMasterList)
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
}
