import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ApplicationDatamodel, BterSearchmodel } from '../../../Models/ApplicationFormDataModel';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { DataServiceService } from '../../../Services/DataService/data-service.service';
import { JanAadharMemberDetails } from '../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { TSPTehsilDataModel } from '../../../Models/CommonMasterDataModel';
import { TspAreasService } from '../../../Services/Tsp-Areas/Tsp-Areas.service';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
declare function LoadData(): any;


@Component({
    selector: 'app-personal-details',
    templateUrl: './personal-details.component.html',
    styleUrls: ['./personal-details.component.css'],
    standalone: false
})
export class PersonalDetailsComponent implements OnInit {
  public PersonalDetailForm!: FormGroup
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  public CompanyMasterDDLList: any[] = [];
  public BoardList: any = []
  public request = new ApplicationDatamodel()
  /*  public addrequest = new SupplementaryDataModel()*/
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public errorMessage = '';
  public HrMasterFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public stateMasterDDL: any = []
  public PassingYearList: any = []
  public maritialList: any = []
  public CategoryBlist: any = []
  public CategoryAlist: any = []
  public CategoryDlist: any = []
  public isSupplement: boolean = false
  public NationalityList: any = []
  public ReligionList: any = []
  public category_CList: any = []
  public category_PreList: any = []
  public ApplicationID: number = 0;
  public searchrequest = new BterSearchmodel()
  public GenderList:any=''
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public TspTehsilRequest = new TSPTehsilDataModel()
  jsonData: any;
  public IsMinority: boolean=false
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public TspTehsilList: any = []
  public DevnarayanTehsilList: any = []
  public DevnarayanAreaList: any = []
  public TspDistrictList: any = []
  public filteredTehsilList: any = []
  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ApplicationService: BterApplicationForm,
    private toastr: ToastrService,
    private dataService: DataServiceService,
    private activatedRoute: ActivatedRoute,
    private tspAreaService: TspAreasService,
    private encryptionService: EncryptionService
  ) { }





  async ngOnInit() {
    // form group
    this.PersonalDetailForm = this.formBuilder.group(
      {
        txtName: [{ value: '', disabled: true }, Validators.required],
        /*   txtSSOID: ['', Validators.required],*/
        txtnameHindi: [{ value: '' }, Validators.required],
        txtEmail: ['', Validators.pattern(GlobalConstants.EmailPattern)],
        txtFather: [{ value: '', disabled: true }, Validators.required],
        txtFatherHindi: [{ value: '' }, Validators.required],
        txtDOB: [{ value: '', disablex: true }, Validators.required],
        txtMotherEngname: [{ value: '', disabled: true }, Validators.required],
        Gender: [{ value: '', disabled: true }],
        MobileNumber: [{ value: '', disabled: true }, Validators.required],
        /*   txtWhatsappMobileNumber: [''],*/
        txtMotherHindiname: [{ value: ''}, Validators.required],
        /*  txtLandlineNumber: [''],*/
        ddlIdentityProof: ['', [DropdownValidators]],
        txtDetailsofIDProof: ['', [Validators.required, this.validateIDLength.bind(this)]],

        ddlMaritial: ['', [DropdownValidators]],
        ddlReligion: ['', [DropdownValidators]],
        ddlNationality: ['', [DropdownValidators]],
        ddlCategoryA: [{ value: '', disabled: true }],
        ddlCategoryB: ['', [DropdownValidators]],
        ddlCategorycp: ['', Validators.required],
        ddlCategoryck: ['', Validators.required],
        ddlCategoryE: ['', [DropdownValidators]],
        ddlPrefential: [{ value: '', disabled: true }, [DropdownValidators]],
        IsMinority: [''],
        IsTSP: [''],
        IsSaharia: [''],
        TspDistrictID: [''],
        subCategory: [''],
        IsDevnarayan: [''],
        DevnarayanDistrictID: [''],
        DevnarayanTehsilID: [''],
        TSPTehsilID: [''],
        ddlCategoryD: ['', [DropdownValidators]]
      });
      

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    this.request.DepartmentID = EnumDepartment.BTER;
    /*    this.HRManagerID = Number(this.activatedRoute.snapshot.queryParamMap.get('HRManagerID')?.toString());*/

    //await this.loadDropdownData('Board')
    //await this.GetStateMatserDDL()
    //await this.GetPassingYearDDL()
    await this.GetMasterDDL()
    await this.GetDevnarayanTehsilList()


    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0")) 
    if (this.ApplicationID > 0)
    {
      this.searchrequest.ApplicationID = this.ApplicationID;
      await this.GetById()
     
    }

   // LoadData();


    this.PersonalDetailForm.valueChanges.pipe(
      debounceTime(500)  // Wait 500ms after the last input change
    ).subscribe(() => {
      LoadData();  // Trigger translation on value change
      setTimeout(() => {
        this.SetFoamData()
      }, .100);
    });

  }


  async GetTspTehsilList() {
    this.TspTehsilRequest.DistrictID = this.request.TspDistrictID
    try {
      this.loaderService.requestStarted();

      await this.tspAreaService.TSPArea_GetTehsil_DistrictWise(this.TspTehsilRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TspTehsilList = data['Data'];
          console.log("TspTehsilList", this.TspTehsilList)
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

  async selectDDID(districtID: number) {
    if (districtID > 0) {
      this.filteredTehsilList = this.DevnarayanTehsilList.filter((tehsil: any) =>
        Number(tehsil.DistrictID.toString().trim()) == Number(districtID)
      );
      console.log('Filtered Tehsils:', this.filteredTehsilList);
    } else {
      this.filteredTehsilList = [];
    }
  }



  SetFoamData() {
    // Assuming IndiTrans is available globally
    const inputFields = document.querySelectorAll('[gtranslate="true"]');
    inputFields.forEach((inputField: Element) => {
      // Ensure inputField is an HTMLInputElement
      const input = inputField as HTMLInputElement;
      const originalValue = input.value;

      // Only translate text fields with value
      if (originalValue) {
        // Trigger translation by assigning the original value
        input.value = originalValue;

        // Assuming Google Translate updates the field instantly,
        // we can directly access the translated text after the translation.
        setTimeout(() => {
          const translatedText = input.value;

          // Get the form control name from the 'formControlName' attribute
          const formControlName = input.getAttribute('formControlName');
          if (formControlName) {
            // Update the corresponding form control with the translated text
            this.PersonalDetailForm.get(formControlName)?.setValue(translatedText, { emitEvent: false });
          }
        }, 100);  // Timeout to ensure translation has time to complete
      }
    });
  }

  onClickCheckbox() {
    this.request.IsMinority = !this.request.IsMinority;
    if (!this.request.IsMinority) {
      this.request.IsMinority=false
    }
  }


  get _PersonalDetailForm() { return this.PersonalDetailForm.controls; }

  async SaveData() {
    try {

      this.isSubmitted = true;
      if (this.PersonalDetailForm.invalid) {
        return;
      }
      console.log(this.PersonalDetailForm)


      if (this.request.CategoryA == 3) {
        if (this.request.subCategory == 1) {
          this.request.IsTSP = true
          this.request.IsSaharia = false
        } else if (this.request.subCategory == 2) {
          this.request.IsSaharia = true
          this.request.IsTSP = false
          this.request.TspDistrictID = 0
          this.request.TSPTehsilID = 0
        } else if (this.request.subCategory == 3) {
          this.request.IsTSP = false
          this.request.IsSaharia = false
          this.request.TspDistrictID = 0
          this.request.TSPTehsilID = 0
        } else {
          this.toastr.error('Please Select उप वर्ग (Subcategory)');
          return
        }
      }


      if (this.request.IsTSP == true) {
        if (this.request.TspDistrictID == 0 || this.request.TspDistrictID == null || this.request.TspDistrictID == undefined) {
          this.toastr.error('Please Select अनुसूचित जिला (Tribal District)');
          return
        }
      } else {
        this.request.TspDistrictID = 0
      }

      if (this.request.IndentyProff == 1 && this.request.DetailID.length < 12) {
        this.toastr.warning("Invalid Aadhar Number");
        return
      } else if (this.request.IndentyProff == 2 && this.request.DetailID.length < 14) {
        this.toastr.warning("Invalid Aadhar Enrollment ID");
        return
      }

      if (this.request.IsDevnarayan == 1) {
        if(this.request.DevnarayanDistrictID == 0 || this.request.DevnarayanDistrictID == null || this.request.DevnarayanDistrictID == undefined) {
          this.toastr.warning('Please Select देवनारायण जिला (Devnarayan District)');
          return
        }
        if(this.request.DevnarayanTehsilID == 0 || this.request.DevnarayanTehsilID == null || this.request.DevnarayanTehsilID == undefined) {
          this.toastr.warning('देवनारायण तहसील (Devnarayan Tehsil)');
          return
        }
      }


      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.SSOID = this.sSOLoginDataModel.SSOID;
      console.log("form data", this.request)
      //save
      await this.ApplicationService.SavePersonalData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            /*    this.CancelData();*/
            /* this.routers.navigate(['/Hrmaster']);*/
            this.formSubmitSuccess.emit(true); // Notify parent of success
            this.tabChange.emit(2); // Move to the next tab (index 1)
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

  async GetById() {

    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetApplicationDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("Application Dataaaaaaaaaaaaaaaaaaaaaaaaaa",data);
          if (data['Data'] != null)
          { 
             this.request = data['Data']
            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0');
            const day = String(dob.getDate()).padStart(2, '0');
            this.request.DOB = `${year}-${month}-${day}`;
            this.request.Religion = data['Data']['Religion']

            console.log(data.Data.IsTSP,"tsp")
            if (data.Data.IsTSP == true) {
              this.request.subCategory = 1
              console.log("subCategory", this.request.subCategory)
            } else if (data.Data.IsSaharia == true) {
              this.request.subCategory = 2
            } else {
              this.request.subCategory = 3
            }

            if (this.request.IsPH == null) {
              this.request.IsPH = ''

            }
            if (this.request.IsKM == null) {
              this.request.IsKM=''
            }

            this.GetTspTehsilList()
            this.GetDevnarayanTehsilList()

            this.request.DevnarayanTehsilID = data.Data.DevnarayanTehsilID
            // this.selectDDID(this.request.DevnarayanDistrictID)
            // this.request.DevnarayanTehsilID = data.Data.DevnarayanTehsilID
            if (this.request.DetailID.length == 12) {
              this.request.IndentyProff=1
            }
          }

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

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('MaritalStatus')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /* console.log(data, 'ggg');*/
          this.maritialList = data['Data'];

        }, (error: any) => console.error(error)
      );
      await this.commonMasterService.GetCommonMasterDDLByType('CategoryD')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /* console.log(data, 'ggg');*/
          this.CategoryDlist = data['Data'];

        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.CategoryBDDLData(EnumDepartment.BTER)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.CategoryBlist = data['Data'];

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
      await this.commonMasterService.GetCommonMasterDDLByType('Category_C')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.category_CList = data['Data'];

        }, (error: any) => console.error(error)
      );
      
      await this.commonMasterService.GetCommonMasterData('PrefentialCategory')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*console.log(data, 'ggg');*/
          this.category_PreList = data['Data'];
          console.log(this.category_PreList,'category_PreList')

        }, (error: any) => console.error(error)
      );
      await this.commonMasterService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList)
        }, (error: any) => console.error(error)
      );
      await this.commonMasterService.GetCommonMasterData('DevnarayanDistrict')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DevnarayanAreaList = data['Data'];
          console.log("GenderList", this.DevnarayanAreaList)
        }, (error: any) => console.error(error)
        );
      // await this.commonMasterService.GetCommonMasterData('DevnarayanAreaTehsil')
      //   .then((data: any) => {
      //     data = JSON.parse(JSON.stringify(data));
      //     this.DevnarayanTehsilList = data['Data'];
      //     console.log("GenderList", this.DevnarayanTehsilList)
      //   }, (error: any) => console.error(error)
      // );
      await this.commonMasterService.GetCommonMasterData('TspDistrict')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TspDistrictList = data['Data'];
          console.log("TspDistrictList", this.TspDistrictList)
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

  async GetDevnarayanTehsilList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('DevnarayanAreaTehsil')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DevnarayanTehsilList = data['Data'];
          console.log("DevnarayanTehsilList", this.DevnarayanTehsilList)
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
  onIdentityProofChange() {
    this.PersonalDetailForm.get('txtDetailsofIDProof')?.updateValueAndValidity();
  }

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


  async ResetData()
  {

    this.request.Email = '';
    this.request.DOB = '';
    this.request.Gender = '';
    this.request.MobileNumber = '';
    this.request.WhatsNumber = '';
    this.request.LandlineNumber = '';
    this.request.IndentyProff = 0;
    this.request.DetailID = '';
    this.request.Maritial = 0;
    this.request.Religion = 0;
    this.request.Nationality = 0;
    this.request.CategoryA = 0;
    this.request.CategoryB = 0;
    this.request.CategoryC = 0;
    this.request.CategoryE = 0;
    this.request.Prefential = 0;


  }

  async FillMemberDetails()
  {
    try
    {

      this.request.StudentName = this.janaadharMemberDetails.nameEng;
      this.request.StudentNameHindi = this.janaadharMemberDetails.nameHnd;
      this.request.FatherName = this.janaadharMemberDetails.fnameEng;
      this.request.FatherNameHindi = this.janaadharMemberDetails.fnameHnd;
      this.request.MotherName = this.janaadharMemberDetails.mnameEng;
      this.request.MotherNameHindi = this.janaadharMemberDetails.mnameHnd;
      this.request.Gender = this.janaadharMemberDetails.gender;
      this.request.MobileNumber = this.janaadharMemberDetails.mobile;
      this.request.JanAadharMemberID = this.janaadharMemberDetails.janmemid;
      this.request.JanAadharNo = this.janaadharMemberDetails.janaadhaarId;
      var result = this.CategoryAlist.find((f: any) => f.CasteCategoryName == this.janaadharMemberDetails.category)
      if (result != null || result != undefined) {
        this.request.CategoryA=     result.CasteCategoryID;
      }


      const dateStr = this.janaadharMemberDetails.dob;  // Your input date string
      const [day, month, year] = dateStr.split('/');  // Split the date by "/"
      const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0]; // Convert to yyyy-MM-dd format
      this.request.DOB = formattedDate;
    }
    catch (ex)
    {
      console.log(ex);

    }


   
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  async Back() {

    this.tabChange.emit(0)
  }
}

