import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EncryptionService } from '../../../ITI/idffund-details/idffund-details.component';
import { CounsellingApplicationFormDataModel, CounsellingApplicationSearchModel } from '../../../../Models/CounsellingApplicationFormDataModel';
import { CounsellingApplicationFormService } from '../../../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-candidate-personal-details',
  standalone: false,
  templateUrl: './candidate-personal-details.component.html',
  styleUrl: './candidate-personal-details.component.css'
})
export class CandidatePersonalDetailsComponent {
  public PersonalDetailForm!: FormGroup
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public errorMessage = '';
  public isSubmitted: boolean = false;

  public GenderList: any = []
  public ReligionList: any = []
  public NationalityList: any = []
  public CategoryAlist: any = []
  public maritalList: any = []

  public request = new CounsellingApplicationFormDataModel();
  public appRequest = new CounsellingApplicationSearchModel();

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService,
    private counsellingApplicationFormService: CounsellingApplicationFormService,
  ) {}
  async ngOnInit() {
    this.PersonalDetailForm = this.formBuilder.group({
      SSOID: ['', Validators.required],
      CandidateName: ['', Validators.required],
      FatherName: ['', Validators.required],
      MotherName: ['', Validators.required],
      GenderId: [0, [DropdownValidators]],
      DOB: ['', Validators.required],
      CategoryA_ID: [0, [DropdownValidators]],
      MobileNo: ['', Validators.required],
      Email: ['', [Validators.pattern(GlobalConstants.EmailPattern)]],
      Address1: ['', Validators.required],
      Address2: ['', Validators.required],
      Address3: [''],
      StateID: [0, [DropdownValidators]],
      DistrictID: [0, [DropdownValidators]],
      BlockID: [0, [DropdownValidators]],
      Pincode: ['', Validators.required],
      AadharNo: ['', Validators.required],
      JanAadharNo: ['', Validators.required],
      Remark: [''],
      
      ReligionID: [0, [DropdownValidators]],
      NationalityID: [0, [DropdownValidators]],
      MaritalID: [0, [DropdownValidators]],
      IsMinority: ['',],
    });

    await this.GetMasterDDL();

    await this.GetApplicationDataByID_Counselling();
  }

  get _PersonalDetailForm() { return this.PersonalDetailForm.controls; }

  validateIDLength(control: any) {
    const identityProof = this.PersonalDetailForm?.get('ddlIdentityProof')?.value; // Access the value correctly
    const value = control.value; // This is the value of the current input

    if (identityProof === '1' && value?.length !== 12) {
      this.errorMessage = 'Aadhar Number must be exactly 12 digits.';
      return { invalidLength: true };
    } else if (identityProof === '2' && value?.length !== 14) {
      this.errorMessage = 'Aadhar Enrollment ID must be exactly 14 digits.';
      return { invalidLength: true };
    }
    return null; // Validation passed
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('MaritalStatus')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /* console.log(data, 'ggg');*/
          this.maritalList = data['Data'];

        }, (error: any) => console.error(error)
      );

      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.CategoryAlist = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterDDLByType('Nationality')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.NationalityList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('Religion')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /* console.log(data, 'ggg');*/
          this.ReligionList = data['Data'];

        }, (error: any) => console.error(error)
        );
      
      await this.commonMasterService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
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

  async SaveData() {
    try {
      this.request.CandidateID = 1
      await this.counsellingApplicationFormService.SavePersonalDetails(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.tabChange.emit(1);
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async ResetData() {}

  async Back() {
    this.tabChange.emit(0)
  }

  async GetApplicationDataByID_Counselling() {
    try {
      this.appRequest.CandidateId = 1
      await this.counsellingApplicationFormService.GetApplicationDataByID_Counselling(this.appRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.request = data.Data
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }
}
