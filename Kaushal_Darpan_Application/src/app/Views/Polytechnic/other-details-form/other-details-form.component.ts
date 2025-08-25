import { Component, EventEmitter, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { BterOptionsDetailsDataModel, BterOtherDetailsModel, BterSearchmodel } from '../../../Models/ApplicationFormDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { ToastrService } from 'ngx-toastr';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { JanAadharMemberDetails } from '../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';

@Component({
    selector: 'app-other-details-form',
    templateUrl: './other-details-form.component.html',
    styleUrls: ['./other-details-form.component.css'],
    standalone: false
})
export class OtherDetailsFormComponent
{
  public SSOLoginDataModel = new SSOLoginDataModel()
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  public ManagmentTypeList: any = []
  public DistrictMasterList: any = []
  public InstituteMasterList: any = []
  public SchemelIst: any = []
  public ParentIncome: any = []
  public BranchName: any = []
  public ResidenceList: any = []
  public formData = new BterOtherDetailsModel()
  public OtherFormGroup!: FormGroup
  public AddedChoices: any[] = []  // Array to hold added choices
  public isSubmitted: boolean = false
  public IsShowDropdown:boolean=false
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public searchrequest = new BterSearchmodel()
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public janaadharMemberDetails = new JanAadharMemberDetails();
  public ApplicationID: number = 0;
  constructor(
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private ApplicationService: BterApplicationForm,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService
  ) { }

  ngOnInit(): void {
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.OtherFormGroup = this.formBuilder.group(
      {
        ParentsIncome: ['', [DropdownValidators]],
        ApplyScheme: ['', [DropdownValidators]],
        EWS: ['', [DropdownValidators]],
        //Residence: ['', [DropdownValidators]],
        IncomeSource: [''],
      });
    this.formData.DepartmentID = EnumDepartment.BTER;
    this.Showdropdown()
    this.GetMasterDDL()




    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0")) 
    if (this.ApplicationID > 0) {
      this.searchrequest.ApplicationID = this.ApplicationID;
      this.GetById();
    }

  }

  get _OtherFormGroup() { return this.OtherFormGroup.controls; }

  Showdropdown() {
    if (this.formData.ParentsIncome == 71) {
      this.OtherFormGroup.get('IncomeSource')?.enable()
      this.IsShowDropdown = true
    }
    else {
      this.IsShowDropdown = false
      this.formData.EWS = 0
      this.formData.ApplyScheme=0
      this.formData.IncomeSource = ''
      this.OtherFormGroup.get('IncomeSource')?.disable()
    }
  }

  refreshBranchRefValidation(isValidate: boolean) {

    // clear
    this.OtherFormGroup.get('ApplyScheme')?.clearValidators();
    
    this.OtherFormGroup.get('EWS')?.clearValidators();
 
    // set
    if (isValidate) {
   
      this.OtherFormGroup.get('ApplyScheme')?.setValidators([DropdownValidators]);
      if (this.formData.CategoryA == 1) { this.OtherFormGroup.get('EWS')?.setValidators([DropdownValidators]); }
   
    }
    // update
    this.OtherFormGroup.get('ApplyScheme')?.updateValueAndValidity();
    this.OtherFormGroup.get('EWS')?.updateValueAndValidity();
  
  }


    
     
  async SaveData() {
    try {
      this.isSubmitted = true;
      if (this.IsShowDropdown) {
        this.refreshBranchRefValidation(true);
      } else {
        this.refreshBranchRefValidation(false);
      }




      if (this.OtherFormGroup.invalid) {
        return
      }
      if (this.formData.ParentsIncome == 71 && this.formData.IncomeSource == '') {
        this.toastr.error("Please Enter माता-पिता की आय राशि में (Parent's Income In Amount)")
        return
      }
      if (this.formData.ParentsIncome == 71 && Number(this.formData.IncomeSource) > 800000) {
        this.toastr.error("Incomne should be less that 8 Lakh")
        return
      }
      if (this.formData.EWS == 2) {
        this.formData.EWS=0
      }
/*      this.isLoading = true;*/

      this.loaderService.requestStarted();

      this.formData.ModifyBy = this.SSOLoginDataModel.UserID;
      this.formData.DepartmentID = EnumDepartment.BTER;


      //save
      await this.ApplicationService.SaveOtherData(this.formData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            /*    this.CancelData();*/
            this.formSubmitSuccess.emit(true);
            this.tabChange.emit(4)
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

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetCommonMasterDDLByType('ParentIncome')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.ParentIncome = data['Data'];

        }, (error: any) => console.error(error)
        );

      await this.commonFunctionService.GetCommonMasterDDLByType('ApplyScheme')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.SchemelIst = data['Data'];

        }, (error: any) => console.error(error)
      );
      await this.commonFunctionService.GetCommonMasterDDLByType('Residence')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.ResidenceList = data['Data'];

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


  async GetById() {
    this.isSubmitted = false;
    this.searchrequest.SSOID = this.SSOLoginDataModel.SSOID
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetOtherDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ada');
          this.formData.ApplicationID = data['Data']['ApplicationID']
         
          if (data['Data'] != null) {

            this.formData = data['Data'];
            this.Showdropdown()
            if (this.formData.CategoryA == 9) {
              this.formData.EWS=1
              this.OtherFormGroup.controls['EWS'].disable();
            }
            if (this.formData.EWS == 0) {
              this.formData.EWS=2
            }
          }
          /* alert(this.request.IsSupplement)*/
          console.log(data['Data'], 'gfff');

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


  async Resetrow() {

    this.formData.ParentsIncome = 0;
    this.formData.ApplyScheme = 0;
    this.formData.EWS = 0;
    this.formData.Residence = 0;
    this.formData.IncomeSource = '';



  }

  async Back() {
    this.tabChange.emit(2)
  }


}
