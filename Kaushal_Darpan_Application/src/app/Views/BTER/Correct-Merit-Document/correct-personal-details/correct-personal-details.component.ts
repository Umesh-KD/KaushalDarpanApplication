import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationStudentDatamodel, IStudentJanAadharDetailModel, JanAadharMemberDetails, SearchApplicationStudentDatamodel, StudentJanAadharDetailModel } from '../../../../Models/StudentJanAadharDetailModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants, EnumStatus, EnumDepartment, EnumApplicationFromStatus, EnumCasteCategory, EnumCourseType, EnumRole, EnumConfigurationType, EnumDirectAdmissionType, EnumCourseType1 } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { AssignRoleRightsModel, UserMasterModel } from '../../../../Models/UserMasterDataModel';
import { DropdownValidators, DropdownValidators1, DropdownValidatorsString, DropdownValidatorsString1 } from '../../../../Services/CustomValidators/custom-validators.service';
import { StudentJanAadharDetailService } from '../../../../Services/StudentJanAadharDetail/student-jan-aadhar-detail.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { DataServiceService } from '../../../../Services/DataService/data-service.service'
import { DateConfigService } from '../../../../Services/DateConfiguration/date-configuration.service';
import { DateConfigurationModel } from '../../../../Models/DateConfigurationDataModels';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { ItiTradeSearchModel, StreamDDL_InstituteWiseModel, TSPTehsilDataModel } from '../../../../Models/CommonMasterDataModel';
import { TspAreasService } from '../../../../Services/Tsp-Areas/Tsp-Areas.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';
import { BterSearchmodel } from '../../../../Models/ApplicationFormDataModel';
declare function LoadData(): any;
@Component({
  selector: 'app-correct-personal-details',
  standalone: false,
  templateUrl: './correct-personal-details.component.html',
  styleUrl: './correct-personal-details.component.css'
})
export class CorrectPersonalDetailsComponent {
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  StudentJanDetailFormGroup!: FormGroup;
  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  @Input() TypeId: number = 0;
  @Input() ApplicationID: number = 0;


  isModalOpen: boolean = false;
  TradeList: any = [];
  tradeSearchRequest = new ItiTradeSearchModel();
  DirectAdmissionTypeID: number = 0;
  IsDirectAdmission: boolean = false;
  public State: number = 0;
  public SuccessMessage: any = [];
  public Message: any = [];
  public IsView: boolean = false;
  public errorMessage = '';
  public ErrorMessage: any = [];
  public CategoryAlist: any = []
  public ApplicationDetail: any = []
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public IsMainRole: boolean = false;
  public PrefentialCategoryList: any = [];
  public ID: number = 0;
  public JAN_AADHAR: string = '';
  public ModifyBy: number = 0;
  public IsShowDropdown: boolean = false
  public IsShowDrop: boolean = false
  public IsShow: boolean = false
  public AdharMemberList: IStudentJanAadharDetailModel[] = [];
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  closeResult: string | undefined;
  showResendButton: boolean = false;
  timeLeft: number = GlobalConstants.DefaultTimerOTP;
  private interval: any;
  public GenderList: any = []
  public IsFinalSubmit: number = 0
  public status: number = 0
  public IsPaymentSuccess: boolean = false
  // public ApplicationID: any = 0;
  public DepartmentID: any = 0;
  public CourseTypeId: any = 0;
  public ENR_ID: any = 0;
  public PageTitle: string = '';
  public maxDate: string = '';
  public AdmissionDateList: any = []
  public courseTypeList: any = []
  request = new StudentJanAadharDetailModel();
  dateConfiguration = new DateConfigurationModel();
  public _enumDepartment = EnumDepartment
  public searchRequest = new SearchApplicationStudentDatamodel();
  _EnumRole = EnumRole
  public model = new ApplicationStudentDatamodel()
  _EnumDirectAdmissionType = EnumDirectAdmissionType
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public resendModel = new IStudentJanAadharDetailModel()
  public streamSearchRequest = new StreamDDL_InstituteWiseModel()
  sSOLoginDataModel = new SSOLoginDataModel();
  BranchMasterList: any = []
  public ResposeOTPModel = new IStudentJanAadharDetailModel();
  public _EnumCourseType1 = EnumCourseType1
  public FormRequestValidateOTP = this.VerifyOTP
  public IsJailAdmission: boolean = false
  public IsFirst: boolean = true
  public IsSecond: boolean = true
  public IsThird: boolean = true
  public IsBack: boolean = false
  public searchrequest = new BterSearchmodel()
  public maritialList: any = []
  public CategoryBlist: any = []
  public CategoryDlist: any = []
  public isSupplement: boolean = false
  public NationalityList: any = []
  public ReligionList: any = []
  public category_CList: any = []
  public IdentityProofList: any = []
  public filteredTehsilList: any = []
  public TspTehsilList: any = []
  public DevnarayanTehsilList: any = []
  public DevnarayanAreaList: any = []
  public TspDistrictList: any = []
  public TspTehsilRequest = new TSPTehsilDataModel();

  public AdmissionStartDate: string = "";

  constructor(
    private commonMasterService: CommonFunctionService,
    private StudentJanAadharDetailService: StudentJanAadharDetailService,
    private Router: Router,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router,
    private _fb: FormBuilder,
    private sMSMailService: SMSMailService,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private dataService: DataServiceService,
    private dateMasterService: DateConfigService,
    private encryptionService: EncryptionService,
    private tspAreaService: TspAreasService,
    private ApplicationService: BterApplicationForm,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    debugger
    console.log("ApplicaitonID", this.ApplicationID)
    this.StudentJanDetailFormGroup = this.formBuilder.group(
      {
        ddlPreferentialCategory: ['', [DropdownValidators]],
        ddlPreferentialType: ['', [DropdownValidators]],
        txtJanAadhaar: [''],
        txtName: ['', Validators.required],
        txtnameHindi: [{ value: '' }, Validators.required],
        txtFather: ['', Validators.required],
        txtMotherEngname: ['', Validators.required],
        txtDOB: ['', [Validators.required, this.minimumAgeValidator(10)]],
        email: ['', [Validators.pattern(GlobalConstants.EmailPattern)]],
        /*  txtMobileNumber: ['', Validators.required],*/
        ddlIdentityProof: [0, [DropdownValidators1]],
        txtFatherHindi: [{ value: '' }, Validators.required],
        txtMotherHindiname: [{ value: '' }, Validators.required],
        ddlCategoryA: [0, [DropdownValidators1]],
        Gender: [0, [DropdownValidatorsString]],
        CertificateNo: ['', Validators.required],
        txtGeneratDate: ['', Validators.required],
        DepartmentName: ['', Validators.required],
        //ddlCourseType: ['', [DropdownValidators]],
        txtMobileNumber: ['', [Validators.required, Validators.pattern(GlobalConstants.MobileNumberPattern)]],
        txtDetailsofIDProof: ['', [Validators.required, this.validateIDLength.bind(this)]],
        TradeLevel: [''],
        TradeID: [''],
        DirectAdmissionTypeID: [''],
        BranchID: [''],
        Apaarid: [''],
        ddlMaritial: ['', [DropdownValidators]],
        ddlReligion: ['', [DropdownValidators]],
        ddlNationality: ['', [DropdownValidators]],
        ddlCategoryB: [0, [DropdownValidators1]],
        ddlCategorycp: ['', [DropdownValidatorsString1]],
        ddlCategoryck: ['', [DropdownValidatorsString1]],
        ddlCategoryE: [0, [DropdownValidators1]],
        /*ddlPrefential: [{ value: ''}, [DropdownValidators]],*/
        IsMinority: [''],
        IsTSP: [''],
        IsSaharia: [''],
        TspDistrictID: [''],
        subCategory: [0, [DropdownValidators1]],
        //IsDevnarayan: [''],
        //DevnarayanDistrictID: ['', [DropdownValidators]],
        //DevnarayanTehsilID: ['', [DropdownValidators]],
        TSPTehsilID: [''],
        ddlCategoryD: ['', [DropdownValidators1]],
        ddlIsMBCCertificate: [0, [DropdownValidators1]]
      });
    /*this.StudentJanDetailFormGroup.get('ddlCategoryA')?.disable();*/
    this.IdentityProofList = [{ Id: '1', Name: 'Aadhar Number' }, { Id: '2', Name: 'Aadhar Enrolment ID' }, { Id: '3', Name: 'Jan Aadhar Id' }]

    //this.CheckDepartmentID();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // this.model.DepartmentID = 1;
    // this.model.IsMBCCertificate = 0;
    // this.model.coursetype = this.sSOLoginDataModel.Eng_NonEng;
    // this.model.MobileNumber = this.sSOLoginDataModel.Mobileno;
    // this.DepartmentID = 1;
    // if (this.model.MobileNumber != '' && this.model.MobileNumber != undefined && this.model.MobileNumber != null) {
    //   //if (this.model.MobileNumber == this.sSOLoginDataModel.SSOID) {
    //   this.StudentJanDetailFormGroup.get('txtMobileNumber')?.disable();
    // } else {
    //   this.StudentJanDetailFormGroup.get('txtMobileNumber')?.enable();
    // }

    await this.GetMasterData();
    await this.GetPrefentialCategory(0)
    await this.GetMasterDDL()
    //await this.GetDevnarayanTehsilList()
    await this.GetPrefentialCategory(0);

    this.courseTypeList = this.commonMasterService.ConvertEnumToList(EnumCourseType1);
    this.setMaxDate();

    this.IsShow = true;

    if(this.ApplicationID>0) {
      this.searchrequest.ApplicationID = this.ApplicationID;
      this.model.ApplicationID = this.ApplicationID;
      await this.GetById();
    }
    this.model.coursetype = this.sSOLoginDataModel.Eng_NonEng
  }

  get _StudentJanDetailFormGroup() { return this.StudentJanDetailFormGroup.controls; }

  async GetById() {
    this.isSubmitted = false;
    try {

      this.loaderService.requestStarted();
      await this.ApplicationService.GetApplicationDatabyID(this.searchrequest)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {

            this.model = data['Data']
            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0');
            const day = String(dob.getDate()).padStart(2, '0');
            this.model.DOB = `${year}-${month}-${day}`;
            this.model.Religion = data['Data']['Religion']
            this.model.Gender = data['Data']['Gender']

            if (data.Data.IsTSP == true) {
              this.model.subCategory = 1
            } else if (data.Data.IsSaharia == true) {
              this.model.subCategory = 2
            } else {
              this.model.subCategory = 3
            }

            if (this.model.IsPH == null) {
              this.model.IsPH = ''

            }
            if (this.model.IsKM == null) {
              this.model.IsKM = ''
            }

            this.model.PrefentialCategoryType = data.Data.PrefentialCategoryType
            this.GetTspTehsilList();
            //this.GetDevnarayanTehsilList();
            // this.GetPrefentialCategory(this.model.PrefentialCategoryType)
            //this.GetPreferentialCategory();
            //this.selectDDID(this.model.DevnarayanDistrictID)


            this.model.ENR_ID = data['Data']['Prefential']
            var th = this;
            this.Showdropdown().then(function () {
              //th.model.IndentyProff = data['Data']['IndentyProff']
              //th.cdr.detectChanges();
              //th.cdr.markForCheck();
            });

            this.changeMaritalStatus();
            this.model.CategoryD = data['Data']['CategoryD']
            console.log(this.model.CategoryD, "CategoryD Data")


            if (this.model.MobileNumber == this.sSOLoginDataModel.SSOID) {
              this.StudentJanDetailFormGroup.get('txtMobileNumber')?.disable();
            } else {
              this.StudentJanDetailFormGroup.get('txtMobileNumber')?.enable();
            }

            //this.model.DevnarayanTehsilID = data['Data']['DevnarayanTehsilID']
            // this.selectDDID(this.request.DevnarayanDistrictID)
            // this.request.DevnarayanTehsilID = data.Data.DevnarayanTehsilID
            //if (this.model.DetailID.length == 12) {
            //  this.model.IndentyProff = 1
            //}
            this.changeKM();
            //this.changeMaritalStatus();

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

  async GetCategoryDList() {
    await this.commonMasterService.GetCategoryDMasterDDL(this.model.Maritial)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        this.CategoryDlist = data['Data'];

      }, (error: any) => console.error(error)
      );
  }

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('MaritalStatus')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.maritialList = data['Data'];

        }, (error: any) => console.error(error)
        );

      // await this.GetCategoryDList(); 

      await this.commonMasterService.CategoryBDDLData(EnumDepartment.BTER)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryBlist = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryAlist = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterDDLByType('Nationality')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.NationalityList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('Religion')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ReligionList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterDDLByType('Category_C')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.category_CList = data['Data'];

        }, (error: any) => console.error(error)
        );


      //await this.commonMasterService.GetCommonMasterData('Gender')
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.GenderList = data['Data'];
      //    console.log("GenderList", this.GenderList)
      //  }, (error: any) => console.error(error)
      //  );
      await this.commonMasterService.GetCommonMasterData('DevnarayanDistrict')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DevnarayanAreaList = data['Data'];
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

  async GetTspTehsilList() {
    this.TspTehsilRequest.DistrictID = this.model.TspDistrictID
    try {
      this.loaderService.requestStarted();

      await this.tspAreaService.TSPArea_GetTehsil_DistrictWise(this.TspTehsilRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TspTehsilList = data['Data'];
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



  validateIDLength(control: any) {
    const identityProof = this.StudentJanDetailFormGroup?.get('ddlIdentityProof')?.value; // Access the value correctly
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



  async GetDevnarayanTehsilList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('DevnarayanAreaTehsil')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DevnarayanTehsilList = data['Data'];
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

  setMaxDate(): void {
    if (this.DepartmentID == EnumDepartment.ITI) {
      const today = new Date();
      const julyFirstThisYear = new Date(today.getFullYear(), 6, 1);
      const fourteenYearsAgo = new Date(julyFirstThisYear);
      fourteenYearsAgo.setFullYear(julyFirstThisYear.getFullYear() - 14);
      this.maxDate = fourteenYearsAgo.toISOString().split('T')[0];
    } else {
      const today = new Date();
      const julyFirstThisYear = new Date(today.getFullYear(), 6, 1);
      const tenYearsAgo = new Date(julyFirstThisYear);
      tenYearsAgo.setFullYear(julyFirstThisYear.getFullYear() - 10);
      this.maxDate = tenYearsAgo.toISOString().split('T')[0];
    }
  }

  minimumAgeValidator(minYears: number) {
    return (control: AbstractControl) => {
      const inputDate = new Date(control.value);
      const today = new Date();
      const julyFirstThisYear = new Date(today.getFullYear(), 6, 1);
      const minDate = new Date(julyFirstThisYear);
      minDate.setFullYear(today.getFullYear() - minYears);

      if (control.value && inputDate > minDate) {
        return { invalidAge: true };
      }
      return null;
    };
  }

  async GetPreferentialCategory() {
    this.IsShow = true
    this.GetPrefentialCategory(this.model.PrefentialCategoryType);
    if (this.model.PrefentialCategoryType != 1) {
      this.model.CategoryA = 1;
      this.StudentJanDetailFormGroup.get('ddlCategoryA')?.disable();
      //this.IdentityProofList = [{ Id: '1', Name: 'Aadhar Number' }, { Id: '2', Name: 'Aadhar Enrolment ID' }]
      this.IdentityProofList.splice(2, 1)
    } else {
      this.StudentJanDetailFormGroup.get('ddlCategoryA')?.enable();
      //this.IdentityProofList = [{ Id: '1', Name: 'Aadhar Number' }, { Id: '2', Name: 'Aadhar Enrolment ID' }, { Id: '3', Name: 'Jan Aadhar Id' }]
      if (this.IdentityProofList.filter(function (dt: any) { return dt.Id == 3 }).length == 0) {
        this.IdentityProofList.push({ Id: '3', Name: 'Jan Aadhar Id' });
      }
    }

  }

  changeKM() {
    if (this.model.IsKM == "1") {
      this.model.PrefentialCategoryType = 2;
      this.model.CategoryA = 1;
      this.StudentJanDetailFormGroup.get('ddlCategoryA')?.disable();
    } else {
      this.Showdropdown();
    }
  }


  Showdrop() {
    if (this.request.JAN_AADHAR > '0') {
      this.IsShowDrop = true
    }
    else {
      this.IsShowDrop = false
    }
  }

  onInput(event: any): void {
    const inputValue = event.target.value;

    // Remove non-digit characters
    const onlyDigits = inputValue.replace(/\D/g, '');

    // Update the input value with only digits
    event.target.value = onlyDigits;

    // Optionally, update the ngModel if needed
    this.model.MobileNumber = onlyDigits;
  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;


    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true;
      }
    }, 1000);
  }
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;


  }

  ResendOTP() {
    this.SendOTP(this.resendModel)
    this.resendModel = new IStudentJanAadharDetailModel()


  }

  async SendJanaadharOTP(row: IStudentJanAadharDetailModel) {
    try {
      this.Swal2.Confirmation("Are you sure you want to Generate OTP ?", async (result: any) => {
        // Check if the user confirmed the action
        if (result.isConfirmed) {
          this.SendOTP(row)
        }
      });

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

  async SendOTP(row: IStudentJanAadharDetailModel) {
    this.resendModel = row
    await this.StudentJanAadharDetailService.SendJanaadharOTP(row)
      .then((data: any) => {


        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];

        if (this.State == EnumStatus.Success) {
          this.startTimer();
          this.toastr.success('OTP sent Successfully')
          this.ResposeOTPModel = data['Data'];
          this.openModalGenerateOTP(this.modal_GenrateOTP, row);

        }
        else {
          this.toastr.error(this.ErrorMessage)
        }

      }, (error: any) => console.error(error)
      );


  }

  async VerifyOTP() {

    if (this.OTP.length > 0) {
      try {
        this.isSubmitted = true;
        this.loaderService.requestStarted();
        this.ResposeOTPModel.OTP = this.OTP;
        await this.StudentJanAadharDetailService.VerifyOTP(this.ResposeOTPModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {

              this.CloseModal();
              this.IsShow = true;
              this.IsShowDropdown = false;
              this.janaadharMemberDetails = data.Data;
              this.GetApplicationId("SearchByMemberID");
              this.FillMemberDetails();

              this.toastr.success("Succesfully Verified")
            }
            else {
              this.toastr.warning('Invalid OTP Please Try Again');
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
    else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  CloseModal() {

    this.modalService.dismissAll();
  }

  async openModalGenerateOTP(content: any, row: IStudentJanAadharDetailModel) {

    // Any additional logic or actions can be placed here if needed

    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  toggleIsMainRole(row: IStudentJanAadharDetailModel): void {

    // Set IsMainRole to false for all rows
    /* this.AdharMemberList.forEach(r => r.IsMainRole = 0);*/

    // Set the clicked row's IsMainRole to true
    row.IsMainRole = 1;

  }
  async GetMasterData() {
    try {
      this.loaderService.requestStarted();


      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.CategoryAlist = data['Data'];

        }, (error: any) => console.error(error)
        );


      await this.commonMasterService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (this.model.coursetype == EnumCourseType1.DiplomaNonEngineering1stYear || 
            this.model.coursetype == EnumCourseType1.DegreeCourse1stYearNonEngg ||
            this.model.coursetype == EnumCourseType1.DegreeCourse2ndYearLateralNonEngg
          ) {
            this.GenderList = [{ "Name": "Female", "ID": "98" }, { "Name": "Transgender", "ID": "99" }];
          } else {
            this.GenderList = data['Data'];
          }

        }, (error: any) => console.error(error)
        );


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


  async GetPrefentialCategory(typeId: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.PrefentialCategoryMaster(this.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, typeId)
        .then((data: any) => {
          ;
          data = JSON.parse(JSON.stringify(data));
          this.PrefentialCategoryList = data['Data'];

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

  async GetDetailsByJanAadhaar() {
    if (this.request.JAN_AADHAR.length < 10 || this.request.JAN_AADHAR.length > 12) {
      this.toastr.error("Invalid Janadhar Details")
    }
    try {
      this.loaderService.requestStarted();
      await this.StudentJanAadharDetailService.JanAadhaarMembersList(this.request.JAN_AADHAR)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.AdharMemberList = data.Data;
            /*     this.request = data['Data'];*/

            this.request.Name = data['Data']['NAME'];
          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning(data.Message + " Please check Janadhar/ Adhar Number again")
          } else {
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


  async Showdropdown() {
    var th = this;
    var data = this.PrefentialCategoryList.filter(function (dta: any) { return dta.ID == th.model.ENR_ID });
    if (data != undefined && data.length > 0) {
      this.model.PrefentialCategoryType = data.length > 0 ? data[0].TypeID : 0;
      this.StudentJanDetailFormGroup.get('ddlPreferentialType')?.disable();
    }

    if (this.model.ENR_ID != 5 && this.model.PrefentialCategoryType == 2) {
      this.model.CategoryA = 1;
      this.StudentJanDetailFormGroup.get('ddlCategoryA')?.disable();
      this.StudentJanDetailFormGroup.get('ddlCategoryck')?.enable();
      //this.IdentityProofList = [{ Id: '1', Name: 'Aadhar Number' }, { Id: '2', Name: 'Aadhar Enrolment ID' }]
      this.IdentityProofList.splice(2, 1)
    } else {
      this.StudentJanDetailFormGroup.get('ddlCategoryA')?.enable();
      this.StudentJanDetailFormGroup.get('ddlCategoryck')?.disable();
      this.model.IsKM = "0";
      if (this.IdentityProofList.filter(function (dt: any) { return dt.Id == 3 }).length == 0) {
        this.IdentityProofList.push({ Id: '3', Name: 'Jan Aadhar Id' });
      }
    }

    //this.items.push(newItem);
    //this.items.splice(index, 1);


    if (this.model.PrefentialCategoryType == 2) {
      this.model.CategoryA = 1
      this.model.CategoryB = 0
      this.model.CategoryC = 0
      this.model.CategoryD = 0
      this.model.CategoryE = 0
      this.model.IsPH = '0'
      this.model.IsTSP = false
      this.model.IsDevnarayan = 0
      this.model.IsEws = 0
      this.model.IsRajasthani = false
      this.model.DevnarayanTehsilID = 0
      this.model.DevnarayanDistrictID = 0
      this.model.TSPTehsilID = 0
      this.model.TspDistrictID = 0
      ///this.StudentJanDetailFormGroup.get('ddlCategoryA')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();


      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();

    }
    else {

      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.setValidators(Validators.required);
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.setValidators(DropdownValidators1);
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.setValidators(DropdownValidatorsString1);
      if (this.model.Gender != "97" && this.model.Maritial != 62) {
        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.setValidators(DropdownValidators1);
        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
      } else {
        this.model.CategoryD = 0;
      }

      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.setValidators(DropdownValidators1);


      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();

      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();


    }
  }

  async SaveData() {
    try {
      debugger
      this.isSubmitted = true;
      this.model.RoleID = this.sSOLoginDataModel.RoleID;
      if (this.model.DepartmentID == EnumDepartment.BTER) {
        this.refereshDepartmentValidator(true)
      } else {
        this.refereshDepartmentValidator(false)
      }
      

      //if (this.model.coursetype == EnumCourseType1.DiplomaNonEngineering1stYear && this.model.Gender !== '98' && this.DepartmentID == EnumDepartment.BTER) {
      //  this.toastr.error("Diploma Non-Engineering (1st Year) is Only valid for female")
      //  return;
      //}

      if (this.model.CategoryA == EnumCasteCategory.OBC || this.model.CategoryA == EnumCasteCategory.MBC || this.model.CategoryA == EnumCasteCategory.EWS) {
        this.refreshBranchRefValidation(true)
      } else {
        this.refreshBranchRefValidation(false)
        this.model.CasteCertificateNo = '';
        this.model.CertificateGeneratDate = '';
      }

      if (this.model.CategoryA == EnumCasteCategory.MBC) {
        this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.setValidators(DropdownValidators1);
        this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.updateValueAndValidity();

      } else {
        this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.clearValidators();
        this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.updateValueAndValidity();
      }

      if (this.model.ENR_ID == 6) {
        this.refreshDepartmentNameRefValidation(true)
      } else {
        this.refreshDepartmentNameRefValidation(false)
      }

      /*if (this.model.ENR_ID == 5) {*/
      this.model.JanAadharNo = ''
      this.model.JanAadharMemberID = ''
      //} else {

      //}
      this.model.JanAadharNo


      //if (this.StudentJanDetailFormGroup.invalid) {
      //  return;
      //}

      //if (this.model.JAN_AADHAR.length == 12) {
      //  this.model.AadharNo = this.model.JAN_AADHAR
      //}

      if (this.model.CategoryA == 3 && this.model.ENR_ID ==5) {
        this.StudentJanDetailFormGroup.get('subCategory')?.clearValidators();
        if (this.model.subCategory == 1) {
          this.model.IsTSP = true
          this.model.IsSaharia = false
        } else if (this.model.subCategory == 2) {
          this.model.IsSaharia = true
          this.model.IsTSP = false
          this.model.TspDistrictID = 0
          this.model.TSPTehsilID = 0
        } else if (this.model.subCategory == 3) {
          this.model.IsTSP = false
          this.model.IsSaharia = false
          this.model.TspDistrictID = 0
          this.model.TSPTehsilID = 0
        } else {
          this.StudentJanDetailFormGroup.get('subCategory')?.setValidators(DropdownValidators1);
          //55this.toastr.error('Please Select उप वर्ग (Subcategory)');
          // return
        }
        this.StudentJanDetailFormGroup.get('subCategory')?.updateValueAndValidity();


      } else {
        this.StudentJanDetailFormGroup.get('subCategory')?.clearValidators()
        this.StudentJanDetailFormGroup.get('subCategory')?.updateValueAndValidity();
      }



      if (this.model.IsTSP == true) {
        if (this.model.TspDistrictID == 0 || this.model.TspDistrictID == null || this.model.TspDistrictID == undefined) {
          this.StudentJanDetailFormGroup.get('TspDistrictID')?.setValidators(DropdownValidators1);
          this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();
          //55this.toastr.error('Please Select अनुसूचित जिला (Tribal District)');
          //return
        }
      } else {
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();
        this.model.TspDistrictID = 0
      }

      if (this.model.IndentyProff == 1 && this.model.DetailID.length < 12) {
        this.toastr.warning("Invalid Aadhar Number");
        //return
      } else if (this.model.IndentyProff == 2 && this.model.DetailID.length < 14) {
        this.toastr.warning("Invalid Aadhar Enrollment ID");
        //return
      }

      //if (this.model.IsDevnarayan == 1) {
      //  if (this.model.DevnarayanDistrictID == 0 || this.model.DevnarayanDistrictID == null || this.model.DevnarayanDistrictID == undefined) {
      //    this.toastr.warning('Please Select देवनारायण जिला (Devnarayan District)');
      //    return
      //  }
      //  if (this.model.DevnarayanTehsilID == 0 || this.model.DevnarayanTehsilID == null || this.model.DevnarayanTehsilID == undefined) {
      //    this.toastr.warning('देवनारायण तहसील (Devnarayan Tehsil)');
      //    return
      //  }
      //}




      this.isLoading = true;
      this.loaderService.requestStarted();
      this.model.ModifyBy = this.sSOLoginDataModel.UserID;
      this.model.DepartmentID = this.DepartmentID;
      this.model.SSOID = this.sSOLoginDataModel.SSOID;
      this.model.ENR_ID = this.model.ENR_ID;
      if (this.model.ENR_ID == 5) {
        this.model.IsRajasthani = true
      } else {
        this.model.IsRajasthani = false
      }
      //if (this.model.CategoryA == 9 && this.model.DepartmentID == EnumDepartment.BTER) {
      //  this.model.IsEws = 1
      //} else {
      //  this.model.IsEws = 0
      //}

      //saveF


      if (this.model.PrefentialCategoryType == 2) {
        this.model.CategoryA = 1
        this.model.CategoryB = 0
        this.model.CategoryC = 0
        this.model.CategoryD = 0
        this.model.CategoryE = 0
        this.model.IsPH = '0'
        this.model.IsTSP = false
        this.model.IsDevnarayan = 0
        this.model.IsEws = 0
        this.model.IsRajasthani = false
        this.model.DevnarayanTehsilID = 0
        this.model.DevnarayanDistrictID = 0
        this.model.TSPTehsilID = 0
        this.model.TspDistrictID = 0
        ///this.StudentJanDetailFormGroup.get('ddlCategoryA')?.clearValidators();
        this.StudentJanDetailFormGroup.get('ddlCategoryB')?.clearValidators();
        this.StudentJanDetailFormGroup.get('ddlCategorycp')?.clearValidators();
        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.clearValidators();
        this.StudentJanDetailFormGroup.get('ddlCategoryE')?.clearValidators();
        //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.clearValidators();
        //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.clearValidators();
        //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.clearValidators();
        this.StudentJanDetailFormGroup.get('TSPTehsilID')?.clearValidators();
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();


        //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();
        //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
        //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
        //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();




      }
      else {

        //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.setValidators(Validators.required);
        this.StudentJanDetailFormGroup.get('ddlCategoryB')?.setValidators(DropdownValidators1);
        this.StudentJanDetailFormGroup.get('ddlCategorycp')?.setValidators(DropdownValidatorsString1);
        //this.StudentJanDetailFormGroup.get('ddlCategoryD')?.setValidators(DropdownValidators1);
        this.StudentJanDetailFormGroup.get('ddlCategoryE')?.setValidators(DropdownValidators1);


        //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();
        //this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();

        if (this.model.Gender != "97" && this.model.Maritial != 62) {
          this.StudentJanDetailFormGroup.get('ddlCategoryD')?.setValidators(DropdownValidators1);

        } else {
          this.StudentJanDetailFormGroup.get('ddlCategoryD')?.clearValidators();
          this.model.CategoryD = 0;
        }
        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
        

      }

    
      if (this.model.CategoryA != 3 || (this.model.CategoryA == 3 && (this.model.subCategory == 2 || this.model.subCategory == 3))) {
        this.model.IsTSP = false
        this.model.TSPTehsilID = 0
        this.model.TspDistrictID = 0
        this.StudentJanDetailFormGroup.get('subCategory')?.clearValidators();
        this.StudentJanDetailFormGroup.get('TSPTehsilID')?.clearValidators();
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();

        this.StudentJanDetailFormGroup.get('subCategory')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();

      }


      if (this.model.CategoryA == 3 && this.model.IsTSP == true) {
        this.StudentJanDetailFormGroup.get('TSPTehsilID')?.setValidators(Validators.required);
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.setValidators(Validators.required);

        this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();
      }




      //new Date(x.To_Date)

      if (this.StudentJanDetailFormGroup.invalid) {
        this.toastr.error('fill required detals');
        // Object.keys(this.StudentJanDetailFormGroup.controls).forEach(key => {
        //  const control = this.StudentJanDetailFormGroup.get(key);

        //  if (control && control.invalid) {
        //    this.toastr.error(`Control ${key} is invalid`);
        //    Object.keys(control.errors!).forEach(errorKey => {
        //      this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
        //    });
        //  }
        // });
        return;
      }
      this.submitFormdata();

    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async submitFormdata() {
    this.model.isCorrectMerit = true
    await this.StudentJanAadharDetailService.SaveDTEApplicationData(this.model)
      .then((data: any) => {
        this.State = data['State'];
        ;
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {
          this.toastr.success(this.Message)
          // this.sSOLoginDataModel.ApplicationID = data['Data'];
          // localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));

        }
        else {
          this.ApplicationID = 0;
          if (data.Data == -7) {
            this.toastr.error("Age must not be less then 14 year!");
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }
      })
  }

  changeCategoryA() {
    if (this.model.CategoryA != 5) {
      this.model.IsDevnarayan = 0;
    }
    if (this.model.CategoryA != 3) {
      this.model.subCategory = 0;
    }

  }


  async changeMaritalStatus() {
    await this.GetCategoryDList();
  }

  async GetApplicationId(Action: string) {
    try {

      this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
      this.searchRequest.DepartmentID = this.DepartmentID;
      this.searchRequest.Action = Action
      this.searchRequest.JanAadharMemberId = this.janaadharMemberDetails.janmemid;

      if (this.IsDirectAdmission && this.sSOLoginDataModel.DepartmentID == EnumDepartment.ITI) {
        this.searchRequest.RoleID = EnumRole.ITIPrincipal
      }
      this.loaderService.requestStarted();
      if (this.DepartmentID === EnumDepartment.BTER) {
        this.searchRequest.CourseTypeID = this.model.coursetype
      } else {
        this.searchRequest.CourseTypeID = 0
      }
      await this.StudentJanAadharDetailService.GetApplicationId(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ApplicationDetail = data.Data;
        this.State = data['State'];
        data['Data'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];

        if (this.State == EnumStatus.Success) {
          this.ApplicationID = this.ApplicationDetail[0].ApplicationID;
          this.IsFinalSubmit = this.ApplicationDetail[0].IsFinalSubmit;
          if (this.ApplicationID > 0) {
            if (this.DepartmentID === EnumDepartment.BTER) {
              if (this.IsFinalSubmit == EnumApplicationFromStatus.FinalSave) {
                this.routers.navigate(['/PreviewForm'], {
                  queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
                });
                //  window.open(`/PreviewForm?AppID=${this.encryptionService.encryptData(this.ApplicationID)}`, "_self");
              } else {
                this.routers.navigate(['/Applicationform'], {
                  queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
                });
                //window.open(`/Applicationform?AppID=${this.encryptionService.encryptData(this.ApplicationID) }`, "_self");
              }


            }
            else if (this.DepartmentID === EnumDepartment.ITI) {
              if (this.IsFinalSubmit == EnumApplicationFromStatus.FinalSave) {
                this.routers.navigate(['/Itipreviewform'], {
                  queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
                });
                //window.open(`/Itipreviewform?AppID=${this.encryptionService.encryptData(this.ApplicationID) }`, "_self");
              } else {
                this.routers.navigate(['/ApplicationFormTab'], {
                  queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
                });
                //window.open(`/ApplicationFormTab?AppID=${this.encryptionService.encryptData(this.ApplicationID) }`, "_self");
              }
            }
          }
          this.ResetData();

        }
      }, (error: any) => console.error(error))
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


  async ResetData() {
    this.isSubmitted = false;
    this.model.ApplicationID = 0;
    this.model.StudentName = '';
    this.model.FatherName = '';
    this.model.MotherName = '';
    this.model.Email = '';
    this.model.DOB = '';
    this.model.Gender = '0';
    this.model.MobileNumber = '';
    this.model.CasteCertificateNo = '';
    this.model.CertificateGeneratDate = '';
    this.model.CategoryA = 0;

    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }

  async CheckDepartmentID() {
    //Set DepartmentID
    let deptid = this.router.snapshot.queryParamMap.get('deptid');
    this.DepartmentID = Number(this.encryptionService.decryptData(deptid ?? "0"));
    let directAdmission = this.router.snapshot.queryParamMap.get('isDirectAdmission')
    this.IsDirectAdmission = Boolean(this.encryptionService.decryptData(directAdmission ?? "false"));
    let jailAdmission = this.router.snapshot.queryParamMap.get('isJailAdmission')
    this.IsJailAdmission = Boolean(this.encryptionService.decryptData(jailAdmission ?? "false"));
    if (this.DepartmentID > 0) {
      if (this.DepartmentID == 1) {
        this.IsView = true;
      }
      else if (this.DepartmentID == 2) {
        this.IsView = false;
      }
    }
    else {
      /*    window.open(`/StudentDashboard`, "_self");*/
      //this.routers.navigate(['/StudentDashboard']);

    }
  }


  async FillMemberDetails() {
    try {
      this.model.StudentName = this.janaadharMemberDetails.nameEng;
      this.model.FatherName = this.janaadharMemberDetails.fnameEng;
      this.model.MotherName = this.janaadharMemberDetails.mnameEng;
      this.model.Gender = this.janaadharMemberDetails?.gender == 'Male' ? '97' : this.janaadharMemberDetails?.gender == 'Female' ? '98' : '99';
      this.model.MobileNumber = this.janaadharMemberDetails.mobile;
      this.model.Email = this.janaadharMemberDetails.email;
      this.model.JanAadharMemberID = this.janaadharMemberDetails.janmemid;
      this.model.JanAadharNo = this.janaadharMemberDetails.janaadhaarId;
      /*this.model.ENR_ID = this.janaadharMemberDetails.enrid;*/

      var result = this.CategoryAlist.find((f: any) => f.CasteCategoryName == this.janaadharMemberDetails.category)
      if (result != null || result != undefined) {
        this.model.CategoryA = result.CasteCategoryID;

      }
      const dateStr = this.janaadharMemberDetails.dob;  // Your input date string
      const [day = '', month = '', year = ''] = dateStr?.split('/') ?? [];  // Split the date by "/"
      const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0]; // Convert to yyyy-MM-dd format
      this.model.DOB = formattedDate;

      if (this.model.DOB !== '') {
        this.StudentJanDetailFormGroup.get('txtDOB')?.disable();
      }
      if (this.model.StudentName != '') {
        this.StudentJanDetailFormGroup.get('txtName')?.disable();
      }
    }
    catch (ex) {
      console.log(ex);

    }
  }

  // Added on 2025-01-25 #Pradeep 
  async GetDateDataList() {
    try {
      this.dateConfiguration.DepartmentID = this.DepartmentID;
      this.dateConfiguration.SSOID = this.sSOLoginDataModel.SSOID;
      await this.dateMasterService.GetDateDataList(this.dateConfiguration)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AdmissionDateList = data['Data'];
          const today = new Date();
          const deptID = this.DepartmentID;
          var activeCourseID: any = [];

          if (this.AdmissionDateList.length > 0) {
            this.AdmissionStartDate = this.AdmissionDateList[0].From_Date;
          }

        
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  selectCourseType(value: any) {
    if (value == EnumCourseType1.Diploma1stYearEng) {
      this.IsFirst = true
      this.IsSecond = false
      this.IsThird = false
      this.IsBack = true
    } else if (value == EnumCourseType1.Diploma2ndYearEngLateralAdmission) {
      this.IsFirst = false
      this.IsSecond = false
      this.IsThird = true
      this.IsBack = true
    } else if (value == EnumCourseType1.DiplomaNonEngineering1stYear) {
      this.IsFirst = false
      this.IsSecond = true
      this.IsThird = false
      this.IsBack = true
    }
    this.model.coursetype = value;
    this.StudentJanDetailFormGroup.get('ddlCourseType')?.setValue(value);
    this.onSelectCourseType(); // trigger your original change function
  }

  OnBack() {
    this.IsBack = false
    this.IsFirst = true
    this.IsSecond = true
    this.IsThird = true
    this.model = new ApplicationStudentDatamodel()

  }


  refereshDepartmentValidator(isvalidate: boolean) {
    this.StudentJanDetailFormGroup.get('ddlCourseType')?.clearValidators();
    if (isvalidate) {
      this.StudentJanDetailFormGroup.get('ddlCourseType')?.setValidators([DropdownValidators]);
    }
    this.StudentJanDetailFormGroup.get('ddlCourseType')?.updateValueAndValidity();
  }


  refreshBranchRefValidation(isValidate: boolean) {
    // clear
    this.StudentJanDetailFormGroup.get('txtGeneratDate')?.clearValidators();
    this.StudentJanDetailFormGroup.get('CertificateNo')?.clearValidators();

    // set
    if (isValidate) {
      this.StudentJanDetailFormGroup.get('txtGeneratDate')?.setValidators(Validators.required);
      this.StudentJanDetailFormGroup.get('CertificateNo')?.setValidators(Validators.required);

    }
    // update
    this.StudentJanDetailFormGroup.get('txtGeneratDate')?.updateValueAndValidity();
    this.StudentJanDetailFormGroup.get('CertificateNo')?.updateValueAndValidity();

  }

  filterString(input: string): string {
    return input.replace(/[^a-zA-Z0-9. ]/g, '');
  }

  async GetTradeListDDL() {
    try {
      this.tradeSearchRequest.TradeLevel = this.model.TradeLevel
      this.tradeSearchRequest.CollegeID = this.sSOLoginDataModel.InstituteID

      this.tradeSearchRequest.action = '_getDatabyCollege'
      this.loaderService.requestStarted();
      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeList = data.Data
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  onSelectCourseType() {
    // this.GetApplicationId("SearchBySSO");

    if (this.IsDirectAdmission) {
      this.model.InstituteID = this.sSOLoginDataModel.InstituteID
      if (this.IsDirectAdmission && this.DepartmentID == EnumDepartment.ITI) {
        this.model.DirectAdmissionTypeID = EnumDirectAdmissionType.DirectAdmission
      } else if (this.IsDirectAdmission && this.DepartmentID == EnumDepartment.BTER) {
        this.model.DirectAdmissionTypeID = EnumDirectAdmissionType.DirectAdmission
      }
    } else if (this.IsJailAdmission) {
      this.model.InstituteID = this.sSOLoginDataModel.InstituteID
      this.model.DirectAdmissionTypeID = EnumDirectAdmissionType.JailAdmission
    } else {
      if (this.sSOLoginDataModel.RoleID != EnumRole.Emitra) {
        this.GetApplicationId("SearchBySSO");
      }
    }

    this.GetStreamMasterInstituteWise()
  }

  async GetStreamMasterInstituteWise() {
    try {
      this.loaderService.requestStarted();
      this.streamSearchRequest.InstituteID = 9
      this.streamSearchRequest.StreamType = this.model.coursetype
      await this.commonMasterService.StreamDDL_InstituteWise(this.streamSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BranchMasterList = data['Data'];
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


  refreshDepartmentNameRefValidation(isValidate: boolean) {
    // clear
    this.StudentJanDetailFormGroup.get('DepartmentName')?.clearValidators();


    // set
    if (isValidate) {
      this.StudentJanDetailFormGroup.get('DepartmentName')?.setValidators(Validators.required);


    }
    // update
    this.StudentJanDetailFormGroup.get('DepartmentName')?.updateValueAndValidity();


  }

  async selectDDID(districtID: number) {
    if (districtID > 0) {
      this.filteredTehsilList = this.DevnarayanTehsilList.filter((tehsil: any) =>
        Number(tehsil.DistrictID.toString().trim()) == Number(districtID)
      );
    } else {
      this.filteredTehsilList = [];
    }
  }


  onIdentityProofChange() {
    this.StudentJanDetailFormGroup.get('txtDetailsofIDProof')?.updateValueAndValidity();
  }


  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
