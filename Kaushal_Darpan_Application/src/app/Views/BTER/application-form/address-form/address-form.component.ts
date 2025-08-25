import { Component, EventEmitter, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { BterAddressDataModel, BterSearchmodel } from '../../../../Models/ApplicationFormDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { JanAadharMemberDetails } from '../../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';

@Component({
    selector: 'app-address-form',
    templateUrl: './address-form.component.html',
    styleUrls: ['./address-form.component.css'],
    standalone: false
})
export class AddressFormComponent {
  public SSOLoginDataModel = new SSOLoginDataModel()
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  public AddressDetailsFormGroup!: FormGroup;
  public CorsAddressDetailsFormGroup!: FormGroup;
  public formData = new BterAddressDataModel()
  public isSubmitted: boolean = false;
  isSameAddress: boolean = false;
  public StateMasterList: any = []
  public DistrictMasterList: any = []
  public DistrictCorMasterList: any = []
  public TehsilMasterList: any = []
  public TehsilCorMasterList: any = []
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public searchrequest = new BterSearchmodel()
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public ApplicationID: number=0;
  constructor(
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private ApplicationService: BterApplicationForm,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService
  ) { }

  async ngOnInit() {

    this.AddressDetailsFormGroup = this.formBuilder.group(
      {
        txtAddressLine1: ['', [Validators.required, Validators.maxLength(50)]],
        txtAddressLine2: ['', [Validators.required, Validators.maxLength(50)]],
        txtAddressLine3: ['',],
        ddlState: ['', [DropdownValidators]],
        ddlDistrict: ['', [DropdownValidators]],
        ddlBlockTehsil: [''],
        txtCityVillage: [''],
        txtPincode: ['', [Validators.required, Validators.pattern(GlobalConstants.PincodePattern)]],
        NonRajasthanBlockName: [''],
      });
    this.CorsAddressDetailsFormGroup = this.formBuilder.group(
      {
        CorstxtAddressLine1: ['', Validators.required],
        CorstxtAddressLine2: ['', Validators.required],
        CorstxtAddressLine3: ['',],
        CorsddlState: ['', [DropdownValidators]],
        CorsddlDistrict: ['', [DropdownValidators]],
        CorsddlBlockTehsil: [''],
        CorstxtCityVillage: [''],
        CorstxtPincode: ['', [Validators.required, Validators.pattern(GlobalConstants.PincodePattern)]],
        CorsNonRajasthanBlockName: [''],
      });

    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.SSOLoginDataModel.ApplicationFinalSubmit == 2) {
      this.formSubmitSuccess.emit(true); // Notify parent of success
      this.tabChange.emit(6); // Move to the next tab (index 1)
    }

    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    this.searchrequest.SSOID = this.SSOLoginDataModel.SSOID



    if (this.SSOLoginDataModel.ApplicationID > 0) {
      this.searchrequest.ApplicationID = this.SSOLoginDataModel.ApplicationID;
      this.GetById();
    }
    this.searchrequest.DepartmentID = 1;
    await this.GetStateMaterData();
  }



  ValidateBlockTehsil() {
    if (this.formData.StateID == 6)//For Rajsthan Users
    {
      this.formData.NonRajasthanBlockName = '';
      this.AddressDetailsFormGroup.controls['ddlBlockTehsil'].setValidators([DropdownValidators]);
      this.AddressDetailsFormGroup.controls['NonRajasthanBlockName'].clearValidators();
    }
    else {
      this.formData.TehsilID = 0;
      this.AddressDetailsFormGroup.controls['ddlBlockTehsil'].clearValidators();
      this.AddressDetailsFormGroup.controls['NonRajasthanBlockName'].setValidators([Validators.required]);
    }

    if (this.formData.CorsStateID == 6)//For Rajsthan Users
    {
      this.formData.NonRajasthanBlockName = '';
      this.CorsAddressDetailsFormGroup.controls['CorsddlBlockTehsil'].setValidators([DropdownValidators]);
      this.CorsAddressDetailsFormGroup.controls['CorsNonRajasthanBlockName'].clearValidators();
    }
    else {
      this.formData.CorsTehsilID = 0;
      this.CorsAddressDetailsFormGroup.controls['CorsddlBlockTehsil'].clearValidators();
      this.CorsAddressDetailsFormGroup.controls['CorsNonRajasthanBlockName'].setValidators([Validators.required]);
    }

    this.AddressDetailsFormGroup.controls['ddlBlockTehsil'].updateValueAndValidity();
    this.AddressDetailsFormGroup.controls['NonRajasthanBlockName'].updateValueAndValidity();
    this.CorsAddressDetailsFormGroup.controls['CorsddlBlockTehsil'].updateValueAndValidity();
    this.CorsAddressDetailsFormGroup.controls['CorsNonRajasthanBlockName'].updateValueAndValidity();
  }

  EnableDisableCorsAddressDetail(isSelected: boolean)
  {

    if (isSelected)
    {
      this.CorsAddressDetailsFormGroup.controls['CorstxtAddressLine1'].disable();
      this.CorsAddressDetailsFormGroup.controls['CorstxtAddressLine2'].disable();

      this.CorsAddressDetailsFormGroup.controls['CorstxtAddressLine3'].disable();
      this.CorsAddressDetailsFormGroup.controls['CorsddlState'].disable();
      this.CorsAddressDetailsFormGroup.controls['CorsddlDistrict'].disable();
      //this.CorsAddressDetailsFormGroup.controls['CorsddlBlockTehsil'].disable();
      //this.CorsAddressDetailsFormGroup.controls['CorstxtCityVillage'].disable();
      this.CorsAddressDetailsFormGroup.controls['CorstxtPincode'].disable();

    } else
    {
      this.CorsAddressDetailsFormGroup.controls['CorstxtAddressLine1'].enable();
      this.CorsAddressDetailsFormGroup.controls['CorstxtAddressLine2'].enable();

      this.CorsAddressDetailsFormGroup.controls['CorstxtAddressLine3'].enable();
      this.CorsAddressDetailsFormGroup.controls['CorsddlState'].enable();
      this.CorsAddressDetailsFormGroup.controls['CorsddlDistrict'].enable();
     /* this.CorsAddressDetailsFormGroup.controls['CorsddlBlockTehsil'].enable();*/
      /*this.CorsAddressDetailsFormGroup.controls['CorstxtCityVillage'].enable();*/
      this.CorsAddressDetailsFormGroup.controls['CorstxtPincode'].enable();
    }
  }






  get _AddressDetailsFormGroup() { return this.AddressDetailsFormGroup.controls; }
  get _CorsAddressDetailsFormGroup() { return this.CorsAddressDetailsFormGroup.controls; }

  async GetStateMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.StateMasterList = data['Data'];
          console.log(this.StateMasterList);
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


  async ddlState_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(this.formData.StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
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

  async ddlCorState_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(this.formData.CorsStateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictCorMasterList = data['Data'];
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

  async ddlDistrict_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.formData.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList = data['Data'];
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

  async ddlCorDistrict_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.formData.CorsDistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilCorMasterList = data['Data'];
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


  async saveAddressDetails() {
    
    try {
      this.isSubmitted = true;
     /* this.ValidateBlockTehsil();*/
      if (this.AddressDetailsFormGroup.invalid || this.CorsAddressDetailsFormGroup.invalid) {
        /*     alert('Please fill all required fields.');*/
        return;
      }

      this.formData.CorsNonRajasthanBlockName = "";
      this.formData.NonRajasthanBlockName = "";

      this.loaderService.requestStarted();
      this.formData.DepartmentID = EnumDepartment.BTER;
      this.formData.ModifyBy = this.SSOLoginDataModel.UserID
      console.log('Permanent Address:', this.AddressDetailsFormGroup.value);
      console.log('Correspondence Address:', this.CorsAddressDetailsFormGroup.value);
      await this.ApplicationService.SaveAddressData(this.formData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            /*  this.CancelData();*/
            this.formSubmitSuccess.emit(true);
            this.tabChange.emit(2); 
            /* this.routers.navigate(['/Hrmaster']);*/
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
  toggleAddress(event: Event) {
    this.isSameAddress = (event.target as HTMLInputElement).checked;

    if (this.AddressDetailsFormGroup.invalid) {
      (event.target as HTMLInputElement).checked = false;
      this.toastr.warning('कृपया स्थायी पता अनुभाग में सभी आवश्यक फ़ील्ड भरें। ')
      this.isSameAddress = false;
      return;
    }


    if (this.isSameAddress) {
      
      this.syncAddress();
      this.EnableDisableCorsAddressDetail(true)
    } else {
      this.formData.CorsNonRajasthanBlockName = this.formData.NonRajasthanBlockName;
      this.EnableDisableCorsAddressDetail(false)
    }
  }


  async GetById() {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetAddressDatabyID(this.searchrequest)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
        
          if (data['Data'] != null) {
            
            this.formData = data['Data']

             this.ddlState_Change();
             this.ddlCorState_Change();
            this.formData.DistrictID = data['Data']['DistrictID']
            this.formData.CorsDistrictID = data['Data']['CorsDistrictID']
             this.ddlDistrict_Change();
            this.ddlCorDistrict_Change();
            
            this.formData.TehsilID = data['Data']['TehsilID']
            this.formData.CorsTehsilID = data['Data']['CorsTehsilID']
            this.formData.StateID = data['Data']['StateID']

          }

         
          
          console.log(data['Data'], 'ffff');
          this.formData.ApplicationID = data['Data']['ApplicationID']
          //const btnSave = document.getElementById('btnSave')
          //if (btnSave) btnSave.innerHTML = "Update";
          //const btnReset = document.getElementById('btnReset')
          //if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();  
      }, 200);
    }
  }

  

  async CancelData() {
    this.formData.CorsAddressLine1 = ''
    this.formData.CorsAddressLine2 = ''
    this.formData.CorsAddressLine3 = ''
    this.formData.CorsDistrictID = 0
    this.formData.CorsStateID = 0
    this.formData.CorsCityVillage = ''
    this.formData.CorsPincode = ''
    this.formData.CorsTehsilID = 0
    this.formData.AddressLine1 = ''
    this.formData.AddressLine2 = ''
    this.formData.AddressLine3 = ''
    this.formData.DistrictID = 0
    this.formData.StateID = 0
    this.formData.TehsilID = 0
    this.formData.Pincode = ''
    this.formData.CityVillage = ''
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  async Back()
  {
    this.tabChange.emit(0)
  }


  syncAddress() {
    if (this.isSameAddress) {
      this.formData.CorsAddressLine1 = this.formData.AddressLine1;
      this.formData.CorsAddressLine2 = this.formData.AddressLine2;
      this.formData.CorsAddressLine3 = this.formData.AddressLine3;
      
 
      this.formData.CorsStateID = this.formData.StateID;
/*      this.ddlCorState_Change()*/

      this.formData.CorsDistrictID = this.formData.DistrictID;
  
      this.formData.CorsCityVillage = this.formData.CityVillage;
      this.formData.CorsPincode = this.formData.Pincode;
      this.ddlCorDistrict_Change()
      this.formData.CorsTehsilID = this.formData.TehsilID;
      this.formData.CorsNonRajasthanBlockName = this.formData.NonRajasthanBlockName;
    }
  }



}
