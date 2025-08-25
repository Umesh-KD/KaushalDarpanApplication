import { Component, EventEmitter, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { BterAddressDataModel, BterSearchmodel } from '../../../Models/ApplicationFormDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { JanAadharMemberDetails } from '../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';

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
  public TehsilMasterList: any = []
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

  ngOnInit(): void {

    this.AddressDetailsFormGroup = this.formBuilder.group(
      {
        txtAddressLine1: ['', [Validators.required, Validators.maxLength(50)]],
        txtAddressLine2: ['', [Validators.required, Validators.maxLength(50)]],
        txtAddressLine3: ['',],
        ddlState: ['', [DropdownValidators]],
        ddlDistrict: ['', [DropdownValidators]],
        ddlBlockTehsil: ['', [DropdownValidators]],
        txtCityVillage: ['', Validators.required],
        txtPincode: ['', [Validators.required, Validators.pattern(GlobalConstants.PincodePattern)]],
      });
    this.CorsAddressDetailsFormGroup = this.formBuilder.group(
      {
        CorstxtAddressLine1: ['', Validators.required],
        CorstxtAddressLine2: ['', Validators.required],
        CorstxtAddressLine3: ['',],
        CorsddlState: ['', [DropdownValidators]],
        CorsddlDistrict: ['', [DropdownValidators]],
        CorsddlBlockTehsil: ['', [DropdownValidators]],
        CorstxtCityVillage: ['', Validators.required],
        CorstxtPincode: ['', [Validators.required, Validators.pattern(GlobalConstants.PincodePattern)]],
      });

    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));


    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    this.searchrequest.SSOID = this.SSOLoginDataModel.SSOID
    this.GetStateMaterData();


    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0")) 
    if (this.ApplicationID > 0) {
      this.searchrequest.ApplicationID = this.ApplicationID;
      this.GetById();
    }


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
      this.CorsAddressDetailsFormGroup.controls['CorsddlBlockTehsil'].disable();
      this.CorsAddressDetailsFormGroup.controls['CorstxtCityVillage'].disable();
      this.CorsAddressDetailsFormGroup.controls['CorstxtPincode'].disable();

    } else
    {
      this.CorsAddressDetailsFormGroup.controls['CorstxtAddressLine1'].enable();
      this.CorsAddressDetailsFormGroup.controls['CorstxtAddressLine2'].enable();

      this.CorsAddressDetailsFormGroup.controls['CorstxtAddressLine3'].enable();
      this.CorsAddressDetailsFormGroup.controls['CorsddlState'].enable();
      this.CorsAddressDetailsFormGroup.controls['CorsddlDistrict'].enable();
      this.CorsAddressDetailsFormGroup.controls['CorsddlBlockTehsil'].enable();
      this.CorsAddressDetailsFormGroup.controls['CorstxtCityVillage'].enable();
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

  async saveAddressDetails() {
    try {
      this.isSubmitted = true;
      if (this.AddressDetailsFormGroup.invalid || this.CorsAddressDetailsFormGroup.invalid) {
        /*     alert('Please fill all required fields.');*/
        return;
      }
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
            this.tabChange.emit(3); 
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
            this.ddlState_Change()
            this.formData.DistrictID = data['Data']['DistrictID']
            this.formData.CorsDistrictID = data['Data']['CorsDistrictID']
            this.ddlDistrict_Change()
            this.formData.TehsilID = data['Data']['TehsilID']
            this.formData.CorsTehsilID = data['Data']['CorsTehsilID']

          }
          console.log(data['Data'], 'ffff');
          this.formData.ApplicationID = data['Data']['ApplicationID']
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

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
    this.tabChange.emit(1)
  }


  syncAddress() {
    if (this.isSameAddress) {
      this.formData.CorsAddressLine1 = this.formData.AddressLine1;
      this.formData.CorsAddressLine2 = this.formData.AddressLine2;
      this.formData.CorsAddressLine3 = this.formData.AddressLine3;
      this.formData.CorsDistrictID = this.formData.DistrictID;
      this.formData.CorsStateID = this.formData.StateID;
      this.formData.CorsCityVillage = this.formData.CityVillage;
      this.formData.CorsPincode = this.formData.Pincode;
      this.formData.CorsTehsilID = this.formData.TehsilID;
    }
  }



}
