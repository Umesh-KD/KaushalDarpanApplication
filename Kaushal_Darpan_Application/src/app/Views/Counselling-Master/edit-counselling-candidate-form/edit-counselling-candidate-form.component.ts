import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../../app/Services/CommonFunction/common-function.service';
import { GlobalConstants, EnumStatus } from '../../../Common/GlobalConstants';
import { CounsellingApplicationFormDataModel, CounsellingApplicationSearchModel } from '../../../Models/CounsellingApplicationFormDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CounsellingApplicationFormService } from '../../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
@Component({
  selector: 'app-edit-counselling-candidate-form',
  templateUrl: './edit-counselling-candidate-form.component.html',
  styleUrl: './edit-counselling-candidate-form.component.css',
  standalone: false
})
export class EditCounsellingCandidateFormComponent {
  public PersonalDetailForm!: FormGroup
  public PersonalDetailFormEditAdmin!: FormGroup
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public errorMessage = '';
  public isSubmitted: boolean = false;
  public CandidateID: number = 0;

  public GenderList: any = []
  public ReligionList: any = []
  public NationalityList: any = []
  public CategoryAlist: any = []
  public maritalList: any = []
  public DistrictMasterList: any = []
  public SpouseDistrictMasterList: any = []
  public SpouseDistrictMasterByAdminList: any = []

  public request = new CounsellingApplicationFormDataModel();
  public requestfromAdmin = new CounsellingApplicationFormDataModel();
  public appRequest = new CounsellingApplicationSearchModel();
  public SSOLoginDataModel = new SSOLoginDataModel()
public categoryBOptions = [
  { id: 1, name: 'Widow' },
  { id: 2, name: 'Divorcee' },
  { id: 3, name: 'Single Women' },
  { id: 4, name: 'None of above' }
];

public filteredCategoryBOptions = [...this.categoryBOptions];
public categoryBOptionsN = [
  { id: 1, name: 'Widow' },
  { id: 2, name: 'Divorcee' },
  { id: 3, name: 'Single Women' },
  { id: 4, name: 'None of above' }
];

public filteredCategoryBOptionsN = [...this.categoryBOptionsN];
  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private routers: Router,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService,
    private counsellingApplicationFormService: CounsellingApplicationFormService,
  ) { }
  async ngOnInit() {
    this.PersonalDetailForm = this.formBuilder.group({
      CandidateName: ['', Validators.required],
      FatherName: ['', Validators.required],
      MotherName: ['', Validators.required],
      GenderId: [0, [DropdownValidators]],
      DOB: ['', Validators.required],
      CategoryA_ID: [0, [DropdownValidators]],
      CategoryB_ID: [0, [DropdownValidators]],
      MobileNo: ['', Validators.required],
      Email: ['', [Validators.pattern(GlobalConstants.EmailPattern)]],
      AadharNo: ['', Validators.required],
      RollNumber: ['', Validators.required],
      Designation: ['', Validators.required],
      MeritNo: ['', Validators.required],
      SelectionCategoryID: [0, [DropdownValidators]],
      HomeDistrictID: [0, [DropdownValidators]],
      Remark: [''],
      IsPH: [''],
      IsSportsPerson: [''],
      IsExServicemen: [''],
      IsShahidDependent: [''],
      IsAnyIncurableDiseases: [''],
      IsSpouseInSameService: [''],
      ReligionID: [0, [DropdownValidators]],
      NationalityID: [0, [DropdownValidators]],
      MaritalID: [0, [DropdownValidators]],
      IsMinority: ['',],
      SpouseDistrictID: [0],
    });
    this.PersonalDetailFormEditAdmin = this.formBuilder.group({

      Add_GenderId: [0, [DropdownValidators]],
      Add_CategoryB_ID: [0, [DropdownValidators]],
      Add_CategoryA_ID: [0, [DropdownValidators]],
      Add_SelectionCategoryID: [0, [DropdownValidators]],
      Add_IsPH: [''],
      Add_IsSportsPerson: [''],
      Add_IsExServicemen: [''],
      Add_IsShahidDependent: [''],
      Add_IsAnyIncurableDiseases: [''],
      Add_IsSpouseInSameService: [''],
      Add_MaritalID: [0, [DropdownValidators]],
      Add_IsMinority: ['',],
      SpouseDistrictIDByAdmin: [0],
    });
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CandidateID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"))
    await this.GetMasterDDL();
    await this.GetDistrictList();
    await this.GetApplicationDataByID_Counselling();

    this.PersonalDetailForm.disable();
    this.PersonalDetailFormEditAdmin.disable();
this.filterCategoryB(this.request.MaritalID);
this.filterCategoryBN(this.request.MaritialID_ByAdmin);

  }

  get _PersonalDetailForm() { return this.PersonalDetailForm.controls; }
  get _PersonalDetailFormEditAdmin() { return this.PersonalDetailFormEditAdmin.controls; }

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
      await this.commonFunctionService.GetCommonMasterDDLByType('MaritalStatus')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /* console.log(data, 'ggg');*/
          this.maritalList = data['Data'];

        }, (error: any) => console.error(error)
        );

      await this.commonFunctionService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.CategoryAlist = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonFunctionService.GetCommonMasterDDLByType('Nationality')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.NationalityList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonFunctionService.GetCommonMasterData('Religion')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /* console.log(data, 'ggg');*/
          this.ReligionList = data['Data'];

        }, (error: any) => console.error(error)
        );

      await this.commonFunctionService.GetCommonMasterData('Gender')
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

  async SaveDataFromAdmin() {
    console.log('value check', this.PersonalDetailFormEditAdmin.value);

    await this.refreshValidators();
    if (this.PersonalDetailFormEditAdmin.invalid) {
      this.toastr.error("Please fill all the required fields");
      Object.keys(this.PersonalDetailFormEditAdmin.controls).forEach(key => {
        const control = this.PersonalDetailFormEditAdmin.get(key);

        if (control && control.invalid) {
          // this.toastr.error(`Control ${key} is invalid`);
          console.error(`Control ${key} is invalid`);
          Object.keys(control.errors!).forEach(errorKey => {
            this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
          });
        }
      });
      return;
    }
    try {
      this.request.CandidateID = this.CandidateID
      this.request.ModifyBy = this.SSOLoginDataModel.UserID

      this.request.AcademicYearID = 9 //this.SSOLoginDataModel.FinancialYearID
      await this.counsellingApplicationFormService.SavePersonalDetailsFromAdmin(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          // this.routers.navigate(['/CounsellingAllotmentList'])
          await this.GetApplicationDataByID_Counselling();
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

  async ResetData() { }

  async GetApplicationDataByID_Counselling() {
    try {
      this.appRequest.CandidateId = this.CandidateID;
      await this.counsellingApplicationFormService.GetApplicationDataByID_Counselling(this.appRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          // this.toastr.success(data.Message);
          this.request = data.Data
          this.requestfromAdmin = data.Data
          //this.onSpouseServiceChange(this.requestfromAdmin.IsSpouseInSameService_ByAdmin);
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

  async GetDistrictList() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
          this.SpouseDistrictMasterList = data['Data'];
          this.SpouseDistrictMasterByAdminList = data['Data'];
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

  async refreshValidators() {
    if (this.requestfromAdmin.GenderId != 98) {
      this.PersonalDetailFormEditAdmin.controls['Add_CategoryB_ID'].clearValidators();
      this.PersonalDetailFormEditAdmin.controls['Add_CategoryB_ID'].updateValueAndValidity();
    }
  }


  editPersonalDetails() {
    this.PersonalDetailFormEditAdmin.enable();
    console.log(this.PersonalDetailFormEditAdmin.value);
    console.log('request', this.requestfromAdmin);

  }

  editPersonalDetailsDisable() {
    this.PersonalDetailFormEditAdmin.disable();
  }

  async Back() {
    this.routers.navigate(['/CounsellingAllotmentList'])
  }
  filterCategoryB(maritalId: any) {
     maritalId = Number(maritalId);
  // Reset selection
  debugger;
  this.PersonalDetailForm.get('CategoryB_ID')?.setValue(0);

  if (maritalId == 146) { 
    // Widow selected
    this.filteredCategoryBOptions = this.categoryBOptions.filter(x => x.id !== 2);
  } 
  else if (maritalId == 64) { 
    // Divorcee selected
    this.filteredCategoryBOptions = this.categoryBOptions.filter(x => x.id !== 1);
  } 
  else {
    // Default – show all
    this.filteredCategoryBOptions = [...this.categoryBOptions];
  }
}
 filterCategoryBByText(maritalText: string) {
  this.PersonalDetailForm.get('CategoryB_ID')?.setValue(0);

  if (maritalText === 'Widow') {
    this.filteredCategoryBOptions =
      this.categoryBOptions.filter(x => x.name !== 'Divorcee');
  }
  else if (maritalText === 'Divorcee') {
    this.filteredCategoryBOptions =
      this.categoryBOptions.filter(x => x.name !== 'Widow');
  }
  else {
    this.filteredCategoryBOptions = [...this.categoryBOptions];
  }
}
 filterCategoryBN(maritalIdN: any) {
     maritalIdN = Number(maritalIdN);
  // Reset selection
  debugger;
  this.PersonalDetailForm.get('Add_CategoryB_ID')?.setValue(0);

  if (maritalIdN == 146) { 
    // Widow selected
    this.filteredCategoryBOptionsN = this.categoryBOptionsN.filter(x => x.id !== 2);
  } 
  else if (maritalIdN == 64) { 
    // Divorcee selected
    this.filteredCategoryBOptionsN = this.categoryBOptionsN.filter(x => x.id !== 1);
  } 
  else {
    // Default – show all
    this.filteredCategoryBOptionsN = [...this.categoryBOptionsN];
  }
}
 filterCategoryBByTextN(maritalText: string) {
  this.PersonalDetailForm.get('Add_CategoryB_ID')?.setValue(0);

  if (maritalText === 'Widow') {
    this.filteredCategoryBOptionsN =
      this.categoryBOptionsN.filter(x => x.name !== 'Divorcee');
  }
  else if (maritalText === 'Divorcee') {
    this.filteredCategoryBOptionsN =
      this.categoryBOptionsN.filter(x => x.name !== 'Widow');
  }
  else {
    this.filteredCategoryBOptionsN = [...this.categoryBOptionsN];
  }
}
onSpouseServiceChange(isInService?: boolean) {
  const spouseDistrict = this.PersonalDetailFormEditAdmin.get('SpouseDistrictIDByAdmin');

  if (isInService === true) {
    spouseDistrict?.setValidators([DropdownValidators]);
  } else {
    spouseDistrict?.clearValidators();
    spouseDistrict?.setValue(0);   // reset value
  }

  spouseDistrict?.updateValueAndValidity();
}
}
