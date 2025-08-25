import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { AddressDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { EnumDepartment, EnumStatus } from '../../../../Common/GlobalConstants';
import { ItiApplicationSearchmodel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-iti-direct-address-form',
  standalone: false,
  templateUrl: './iti-direct-address-form.component.html',
  styleUrl: './iti-direct-address-form.component.css'
})
export class ITIDirectAddressFormComponent {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public AddressDetailsFormGroup!: FormGroup;
  public formData = new AddressDetailsDataModel()
  public isSubmitted: boolean = false;
  public StateMasterList: any = []
  public DistrictMasterList: any = []
  public TehsilMasterList: any = []
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public searchRequest = new ItiApplicationSearchmodel()
  public ApplicationID: number = 0;
  public PersonalDetails: any = []

constructor(
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
  private ItiApplicationFormService: ItiApplicationFormService,
  private activatedRoute: ActivatedRoute,
  private encryptionService: EncryptionService
  ) { }

  ngOnInit(): void {
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.AddressDetailsFormGroup = this.formBuilder.group(
      {
        AddressLine1: ['', Validators.required],
        AddressLine2: ['', Validators.required],
        txtAddressLine3: [''],
        State: ['', [DropdownValidators]],
        District: ['0', [DropdownValidators]],
        BlockTehsil: ['', [DropdownValidators]],
        CityVillage: ['', Validators.required],
        Pincode: ['', Validators.required],
        NonRajasthanBlockName: [''],
      });

    this.GetStateMaterData();
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0")) 
    if (this.ApplicationID > 0)
    {
      this.searchRequest.ApplicationID = this.ApplicationID;
      this.formData.ApplicationID =  this.ApplicationID;
      this.GetById()
      this.GetPersonalDetailById()
    }
  }

  ValidateBlockTehsil()
  {
    if (this.formData.StateID == 6)//For Rajsthan Users
    {
      this.formData.NonRajasthanBlockName = '';
      this.AddressDetailsFormGroup.controls['BlockTehsil'].setValidators([DropdownValidators]);
      this.AddressDetailsFormGroup.controls['NonRajasthanBlockName'].clearValidators();
    }
    else
    {
      this.formData.TehsilID = 0;
      this.AddressDetailsFormGroup.controls['BlockTehsil'].clearValidators();
      this.AddressDetailsFormGroup.controls['NonRajasthanBlockName'].setValidators([Validators.required]);
    }
    this.AddressDetailsFormGroup.controls['BlockTehsil'].updateValueAndValidity();
    this.AddressDetailsFormGroup.controls['NonRajasthanBlockName'].updateValueAndValidity();
  }
  get _AddressDetailsFormGroup() { return this.AddressDetailsFormGroup.controls; }

  async GetStateMaterData()
  {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StateMasterList = data['Data'];
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

  async SaveAddressDetails() {
    this.isSubmitted = true;
    this.ValidateBlockTehsil();
    if (this.AddressDetailsFormGroup.invalid) {
      this.toastr.error("Please fill required fields");
      return;
    }
    
    try
    {
      this.loaderService.requestStarted();

      this.formData.ModifyBy = this.SSOLoginDataModel.UserID;
      this.formData.SSOID = this.SSOLoginDataModel.SSOID;
     

      await this.ItiApplicationFormService.SaveAddressDetailsData(this.formData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.tabChange.emit(4)
          }
          else {
            this.toastr.error(data.ErrorMessage)
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

  ResetAddressDetails()
  {
    this.isSubmitted = false;
    this.formData = new AddressDetailsDataModel();
    this.DistrictMasterList = [];
    this.TehsilMasterList = [];
    this.formData.ApplicationID = this.ApplicationID; 
  }

  async GetById() {
    this.searchRequest.SSOID = this.SSOLoginDataModel.SSOID

    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetAddressDetailsbyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.formData = data['Data']
          this.formData.StateID = data.Data.StateID
          this.ddlState_Change()
          this.formData.DistrictID = data.Data.DistrictID
          this.ddlDistrict_Change()
          this.formData.TehsilID = data.Data.TehsilID

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

  filterNumber(input: string): string {
    return input.replace(/[^0-9]/g, '');
  }

  async Back() {
    this.tabChange.emit(2)
  }

  async GetPersonalDetailById() {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetApplicationDatabyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("What I got from DB", data.Data)
          if (data['Data'] != null){ 
            this.PersonalDetails = data['Data'];
            console.log("PersonalDetails",this.PersonalDetails)
          }
          
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
