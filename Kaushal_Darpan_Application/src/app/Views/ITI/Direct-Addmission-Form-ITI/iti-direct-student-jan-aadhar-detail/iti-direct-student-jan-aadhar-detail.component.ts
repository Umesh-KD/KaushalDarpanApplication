import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationStudentDatamodel, IStudentJanAadharDetailModel, JanAadharMemberDetails, SearchApplicationStudentDatamodel, StudentJanAadharDetailModel } from '../../../../Models/StudentJanAadharDetailModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants, EnumStatus, EnumDepartment, EnumApplicationFromStatus, EnumCasteCategory, EnumCourseType, EnumRole, EnumConfigurationType, EnumDirectAdmissionType, EnumCourseType1, EnumMessageType } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { AssignRoleRightsModel, UserMasterModel } from '../../../../Models/UserMasterDataModel';
import { DropdownValidators, DropdownValidatorsString } from '../../../../Services/CustomValidators/custom-validators.service';
import { StudentJanAadharDetailService } from '../../../../Services/StudentJanAadharDetail/student-jan-aadhar-detail.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { DataServiceService } from '../../../../Services/DataService/data-service.service'
import { DateConfigService } from '../../../../Services/DateConfiguration/date-configuration.service';
import { DateConfigurationModel } from '../../../../Models/DateConfigurationDataModels';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { ItiTradeSearchModel, StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { ApplicationMessageDataModel } from '../../../../Models/ApplicationMessageDataModel';

@Component({
  selector: 'app-iti-direct-student-jan-aadhar-detail',
  standalone: false,
  templateUrl: './iti-direct-student-jan-aadhar-detail.component.html',
  styleUrl: './iti-direct-student-jan-aadhar-detail.component.css'
})
export class ITIDirectStudentJanAadharDetailComponent {
  StudentJanDetailFormGroup!: FormGroup;
  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  isModalOpen: boolean = false;
  TradeList: any = [];
  tradeSearchRequest = new ItiTradeSearchModel();
  DirectAdmissionTypeID: number = 0;
  IsDirectAdmission: boolean = false;
  public State: number = 0;
  public SuccessMessage: any = [];
  public Message: any = [];
  public DataResult: any = [];
  public IsView: boolean = false;
  public ErrorMessage: any = [];
  public CategoryAlist: any = []
  public ApplicationDetail: any = []
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public IsMainRole: boolean = false;
  public PrefentialCategoryList: any = [];
  public PrefentialCategoryList_temp: any = [];
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
  public ApplicationID: any = 0;
  public DepartmentID: any = 0;
  public ENR_ID: any = 0;
  public PageTitle: string = '';
  public maxDate: string = '';
  public AdmissionDateList: any = []
  public courseTypeList: any = []
  request = new StudentJanAadharDetailModel();
  dateConfiguration = new DateConfigurationModel();
  public searchRequest = new SearchApplicationStudentDatamodel();
  public model = new ApplicationStudentDatamodel()
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public resendModel = new IStudentJanAadharDetailModel()
  public streamSearchRequest = new StreamDDL_InstituteWiseModel()
  sSOLoginDataModel = new SSOLoginDataModel();
  public messageModel = new ApplicationMessageDataModel()
  public ResposeOTPModel = new IStudentJanAadharDetailModel();

  BranchMasterList: any = []
  public _enumDepartment = EnumDepartment
  _EnumRole = EnumRole
  _EnumDirectAdmissionType = EnumDirectAdmissionType
  public _EnumCourseType1 = EnumCourseType1
  public FormRequestValidateOTP = this.VerifyOTP
  public IsJailAdmission: boolean = false
  public IsFirst: boolean = true
  public IsSecond: boolean = true
  public IsThird: boolean = true
  public IsBack: boolean = false
  public showPref: boolean = false
  public FromDate: string = ''
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  public Address: any = {
    addressEng: '',
    districtName: '',
    block_city: '',
    gp: '',
    village: '',
    pin: '',
    addressHnd: ''
  }

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
  ) { }

  async ngOnInit() {

    this.StudentJanDetailFormGroup = this.formBuilder.group(
      {
        Domicile: ['', [DropdownValidators]],
        ddlPreferentialCategory: ['', Validators.required],
        txtJanAadhaar: [''],
        txtName: ['', Validators.required],
        txtFather: ['', Validators.required],
        txtMotherEngname: ['', Validators.required],
        txtDOB: ['', [Validators.required, this.minimumAgeValidator(14)]],
        email: ['', [Validators.required, Validators.pattern(GlobalConstants.EmailPattern)]],
        /*  txtMobileNumber: ['', Validators.required],*/
        ddlCategoryA: ['', [DropdownValidators]],
        Gender: [0, [DropdownValidatorsString]],
        CertificateNo: ['', Validators.required],
        txtGeneratDate: ['', Validators.required],
        DepartmentName: ['', Validators.required],
        ddlCourseType: ['', [DropdownValidators]],
        txtMobileNumber: ['', [Validators.required, Validators.pattern(GlobalConstants.MobileNumberPattern)]],
        TradeLevel: [''],
        TradeID: [''],
        DirectAdmissionTypeID: [''],
        BranchID: [''],
        Apaarid: ['']
      });
    
    await this.CheckDepartmentID();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetMasterData();

    if (this.IsDirectAdmission) {
      //this.model.InstituteID = this.sSOLoginDataModel.InstituteID
      if (this.IsDirectAdmission && this.DepartmentID == EnumDepartment.ITI) {
        // this.model.DirectAdmissionTypeID = EnumDirectAdmissionType.DirectAdmission
        this.model.DirectAdmissionTypeID = 1
        if (this.sSOLoginDataModel.RoleID != EnumRole.Emitra) {
          this.GetApplicationId('SearchBySSO')
        }
      } else if (this.IsDirectAdmission && this.DepartmentID == EnumDepartment.BTER) {
        this.model.DirectAdmissionTypeID = EnumDirectAdmissionType.DirectAdmission
      }
    } else if (this.IsJailAdmission) {
      this.model.InstituteID = this.sSOLoginDataModel.InstituteID
      this.model.DirectAdmissionTypeID = EnumDirectAdmissionType.JailAdmission
    } else {
      if (this.DepartmentID == EnumDepartment.ITI && this.sSOLoginDataModel.RoleID != EnumRole.Emitra) {
        this.GetApplicationId('SearchBySSO')
      }
      // }
      console.log("nothing")
    }

    this.courseTypeList = this.commonMasterService.ConvertEnumToList(EnumCourseType1);
    this.setMaxDate();

    this.GetDateDataList();
  }
  get _StudentJanDetailFormGroup() { return this.StudentJanDetailFormGroup.controls; }



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
      if (!control.value) return null;
      debugger
      const inputDate = new Date(control.value);
      const baseDate = new Date(this.FromDate); // reference date (e.g., admission date)

      // Normalize both dates to remove time part (set to 00:00:00)
      const dob = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
      const minAllowedDOB = new Date(
        baseDate.getFullYear() - minYears,
        baseDate.getMonth(),
        baseDate.getDate()
      );

      if (dob.getTime() > minAllowedDOB.getTime()) {
        return { invalidAge: true }; // Too young
      }

      return null;
    };
  }




  Showdropdown() {
    if (this.request.ENR_ID == 5) {
      this.IsShowDropdown = true
    }
    else {
      this.IsShowDropdown = false
    }
    if (this.request.ENR_ID != 5 && this.request.ENR_ID != 0) {
      this.IsShow = true
    }
    else {
      this.IsShow = false
    }

    if (this.request.ENR_ID != 5) {
      this.model.CategoryA = 1
      this.StudentJanDetailFormGroup.controls['ddlCategoryA'].disable();
    } else {
      this.model.CategoryA = 0
      this.StudentJanDetailFormGroup.controls['ddlCategoryA'].enable();
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
        console.log(data);
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
          .then(async (data: any) => {
            debugger
            data = JSON.parse(JSON.stringify(data));
            console.log(data);
            if (this.State == EnumStatus.Success) {
              if(data.Data.janmemid == null || data.Data.janmemid == undefined || data.Data.janmemid == " " || data.Data.janaadhaarId == null || data.Data.janaadhaarId == undefined || data.Data.janaadhaarId == " "){
                this.janaadharMemberDetails.janaadhaarId = this.resendModel.JAN_AADHAR
                this.janaadharMemberDetails.janmemid = this.resendModel.JAN_MEMBER_ID
              } else {
                this.janaadharMemberDetails = data.Data;
              }

              this.CloseModal();
              this.IsShow = true;
              this.IsShowDropdown = false;
              this.Address = data.Data.Address;
              await this.GetApplicationId("SearchByMemberID");
              await this.FillMemberDetails();

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
    console.log(row)

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
      await this.commonMasterService.PrefentialCategoryMaster(this.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.PrefentialCategoryList = data['Data'];

          console.log(this.PrefentialCategoryList, "list")
        }, error => console.error(error));

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
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList)
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
            console.log(this.AdharMemberList, "adhar");
            /*     this.request = data['Data'];*/

            this.request.Name = data['Data']['NAME'];
            console.log(this.request, "request");
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

  openOTP() {

    this.isSubmitted = true;
    if (this.model.DepartmentID == EnumDepartment.BTER) {
      this.refereshDepartmentValidator(true)
    } else {
      this.refereshDepartmentValidator(false)
    }

    if (this.model.coursetype == EnumCourseType1.DiplomaNonEngineering1stYear && this.model.Gender !== '98' && this.DepartmentID == EnumDepartment.BTER) {
      this.toastr.error("Diploma Non-Engineering (1st Year) is Only valid for female")
      return;
    }

    if (this.model.CategoryA == EnumCasteCategory.OBC) {
      this.refreshBranchRefValidation(true)
    } else {
      this.refreshBranchRefValidation(false)
    }

    if (this.request.ENR_ID == 6) {
      this.refreshDepartmentNameRefValidation(true)
    } else {
      this.refreshDepartmentNameRefValidation(false)
    }

    if (this.StudentJanDetailFormGroup.invalid) {
      return;
    }

    if (this.request.JAN_AADHAR.length == 12) {
      this.model.AadharNo = this.request.JAN_AADHAR
    }

    this.isLoading = true;
    this.loaderService.requestStarted();
    this.model.ModifyBy = this.sSOLoginDataModel.UserID;
    this.model.DepartmentID = this.DepartmentID;
    this.model.SSOID = this.sSOLoginDataModel.SSOID;
    this.model.ENR_ID = this.request.ENR_ID;
    if (this.model.ENR_ID == 8) {
      this.model.IsRajasthani = false
    } else {
      this.model.IsRajasthani = true
    }
    //if (this.model.CategoryA == 9 && this.model.DepartmentID == EnumDepartment.BTER) {
    //  this.model.IsEws = 1
    //} else {
    //  this.model.IsEws = 0
    //}

    //saveF

    if (this.model.DepartmentID == EnumDepartment.ITI) {
      if (this.model.Email == null || this.model.Email == "") {
        this.toastr.error("Please Enter Email Address")
        return
      }
    }


    this.childComponent.MobileNo = this.model.MobileNumber
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.SaveData()
    })
  }

  async SaveData() {
    try {
      this.isSubmitted = true;
      if (this.model.DepartmentID == EnumDepartment.BTER) {
        this.refereshDepartmentValidator(true)
      } else {
        this.refereshDepartmentValidator(false)
      }

      if (this.model.coursetype == EnumCourseType1.DiplomaNonEngineering1stYear && this.model.Gender !== '98' && this.DepartmentID == EnumDepartment.BTER) {
        this.toastr.error("Diploma Non-Engineering (1st Year) is Only valid for female")
        return;
      }

      if (this.model.CategoryA == EnumCasteCategory.OBC) {
        this.refreshBranchRefValidation(true)
      } else {
        this.refreshBranchRefValidation(false)
      }

      if (this.request.ENR_ID == 6) {
        this.refreshDepartmentNameRefValidation(true)
      } else {
        this.refreshDepartmentNameRefValidation(false)
      }

      if (this.StudentJanDetailFormGroup.invalid) {
        return;
      }

      if (this.request.JAN_AADHAR.length == 12) {
        this.model.AadharNo = this.request.JAN_AADHAR
      }

      this.isLoading = true;
      this.loaderService.requestStarted();
      this.model.ModifyBy = this.sSOLoginDataModel.UserID;
      this.model.DepartmentID = this.DepartmentID;
      this.model.SSOID = this.sSOLoginDataModel.SSOID;
      this.model.ENR_ID = this.request.ENR_ID;
      this.model.RoleID = this.sSOLoginDataModel.RoleID;
      if (this.model.ENR_ID == 8) {
        this.model.IsRajasthani = false
      } else {
        this.model.IsRajasthani = true
      }
      //if (this.model.CategoryA == 9 && this.model.DepartmentID == EnumDepartment.BTER) {
      //  this.model.IsEws = 1
      //} else {
      //  this.model.IsEws = 0
      //}

      //saveF

      if (this.model.DepartmentID == EnumDepartment.ITI) {
        if (this.model.Email == null || this.model.Email == "") {
          this.toastr.error("Please Enter Email Address")
          return
        }
      }


      if (this.Address) {
        this.model.adds_addressEng = this.Address.addressEng;
        this.model.adds_addressHnd = this.Address.addressHnd;
        this.model.adds_block_city = this.Address.block_city;
        this.model.adds_districtName = this.Address.districtName;
        this.model.adds_gp = this.Address.gp;
        this.model.adds_pin = this.Address.pin;
        this.model.adds_village = this.Address.village;

      }

      this.model.InstituteID = this.sSOLoginDataModel.InstituteID

      // this.Address

      await this.StudentJanAadharDetailService.SavePersonalData(this.model)
        .then((data: any) => {
          this.State = data['State'];
          this.DataResult = data['Data'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.ApplicationID = data['Data'];
            this.SendApplicationMessage();
            console.log(this.DepartmentID + "DepartmentID");
            console.log(EnumDepartment.ITI + "EnumDepartment");

            if (this.DepartmentID === EnumDepartment.BTER) {
              /*  window.open(`/Applicationform?AppID=${this.encryptionService.encryptData(this.ApplicationID)}`, "_self");*/
              this.routers.navigate(['/Applicationform'], {
                queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
              });

            }
            else if (this.DepartmentID === EnumDepartment.ITI) {
              /*   window.open(`/ApplicationFormTab?AppID=${this.encryptionService.encryptData(this.ApplicationID)}`, "_self");*/
              this.routers.navigate(['/direct-admission-application-form'],
                {
                  queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
                });

            }
            this.ResetData();
          }
          else {
            this.ApplicationID = 0;
            if (this.DataResult == '-5') //check module list
            {
              this.toastr.warning('An application with this mobile number already exists.');
            }
            else if (this.DataResult == '-6')//check module list
            {
              this.toastr.warning('You’ve already applied for this course.');
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          }
        })
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

  async SendApplicationMessage() {
    try {
      this.loaderService.requestStarted();
      this.messageModel.MobileNo = this.model.MobileNumber;
      this.messageModel.MessageType = EnumMessageType.FormSubmit;
      this.messageModel.ApplicationNo = this.ApplicationID.toString();
      await this.sMSMailService.SendApplicationMessage(this.messageModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            console.log('Message sent successfully', data);
          } else {
            console.log('Something went wrong', data);
          }
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetApplicationId(Action: string) {
    try {

      this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
      this.searchRequest.DepartmentID = this.DepartmentID;
      this.searchRequest.Action = Action
      this.searchRequest.JanAadharMemberId = this.janaadharMemberDetails.janmemid;

      // if (this.IsDirectAdmission && this.sSOLoginDataModel.DepartmentID == EnumDepartment.ITI) {
      //   this.searchRequest.RoleID = EnumRole.ITIPrincipal
      // }
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
          this.IsPaymentSuccess = this.ApplicationDetail[0].IsPaymentSuccess;
          if (this.ApplicationID > 0) {
            if (this.DepartmentID === EnumDepartment.ITI) {
              if (this.IsFinalSubmit == EnumApplicationFromStatus.FinalSave) {
                this.routers.navigate(['/Itipreviewform'], {
                  queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
                });
                //window.open(`/Itipreviewform?AppID=${this.encryptionService.encryptData(this.ApplicationID) }`, "_self");
              } else {
                this.routers.navigate(['/direct-admission-application-form'], {
                  queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
                });
                //window.open(`/ApplicationFormTab?AppID=${this.encryptionService.encryptData(this.ApplicationID) }`, "_self");
              }
            }
          }
          this.ResetData();

        }
        console.log(this.ApplicationDetail, "ApplicationDetail")
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
    //this.ApplicationID = Number(this.encryptionService.decryptData(deptid??"0"));

    //this.ApplicationID = this.router.snapshot.queryParamMap.get('ApplicationID');
    this.DepartmentID = Number(this.encryptionService.decryptData(deptid ?? "0"));

    let directAdmission = this.router.snapshot.queryParamMap.get('isDirectAdmission')
    this.IsDirectAdmission = Boolean(this.encryptionService.decryptData(directAdmission ?? "false"));
    let jailAdmission = this.router.snapshot.queryParamMap.get('isJailAdmission')
    this.IsJailAdmission = Boolean(this.encryptionService.decryptData(jailAdmission ?? "false"));
    console.log("directAdmission", this.IsDirectAdmission)
    //this.DepartmentID = 2;
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
      this.routers.navigate(['/StudentDashboard']);

    }
  }


  async FillMemberDetails() {
    try {
      console.log(this.janaadharMemberDetails, "hhh")
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
      // const [day, month, year] = dateStr?.split('/');  // Split the date by "/"
      const [day = '', month = '', year = ''] = dateStr?.split('/') ?? [];
      const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0]; // Convert to yyyy-MM-dd format
      this.model.DOB = formattedDate;

      // if(this.model.DOB !== '') {
      //   this.StudentJanDetailFormGroup.get('txtDOB')?.disable();
      // }
      // if (this.model.StudentName != '') {
      //   this.StudentJanDetailFormGroup.get('txtName')?.disable();
      // }
    }
    catch (ex) {
      console.log(ex);

    }
  }





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

          if (this.DepartmentID == EnumDepartment.BTER) {
            this.AdmissionDateList.filter((x: any) => {
              if (new Date(x.To_Date) > today && x.TypeID == EnumConfigurationType.Admission && x.DepartmentID == deptID && x.CourseTypeID == EnumCourseType1.Diploma2ndYearEngLateralAdmission) {
                activeCourseID.push(3);
              } else if
                (new Date(x.To_Date) > today && x.TypeID == EnumConfigurationType.Admission && x.DepartmentID == deptID && x.CourseTypeID == EnumCourseType1.Diploma1stYearEng) {
                activeCourseID.push(1);
              }
              else if (new Date(x.To_Date) > today && x.TypeID == EnumConfigurationType.Admission && x.DepartmentID == deptID && x.CourseTypeID == EnumCourseType1.DiplomaNonEngineering1stYear)
                activeCourseID.push(2);
            })
          }

          if (this.DepartmentID == EnumDepartment.ITI) {

            var lnth = this.AdmissionDateList.filter(function (x: any) { return new Date(x.To_Date) > today && new Date(x.From_Date) < today && x.TypeID == EnumConfigurationType.Admission && x.DepartmentID == deptID }).length
            if (lnth <= 0) {
              this.toastr.warning("Date for ITI Admission is Closed or Not Open");
              this.routers.navigate(['/dashboard']);

            }

            const admissionEntry = this.AdmissionDateList.find((e: any) => e.TypeID == 148);
            this.FromDate = admissionEntry ? admissionEntry.From_Date : null;
            console.log(this.FromDate, "from date")
          }


          this.courseTypeList = this.courseTypeList.filter((course: any) => activeCourseID.includes(course.value));
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
          console.log("BranchMasterList", this.BranchMasterList)
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

  async changeDomicile (val: number) {
    if(val == 1) {
      this.showPref = true
      this.model.IsRajasthani = true
      this.PrefentialCategoryList_temp = this.PrefentialCategoryList
      this.request.ENR_ID = 5
      this.StudentJanDetailFormGroup.controls['ddlPreferentialCategory'].disable();
      
      this.Showdropdown()
    } else if (val == 2) {
      this.showPref = true
      this.AdharMemberList = [];
      this.request.ENR_ID = 0
      this.StudentJanDetailFormGroup.controls['ddlPreferentialCategory'].enable();
      this.PrefentialCategoryList_temp = this.PrefentialCategoryList.filter((x: any) => x.ID != 5)
      this.Showdropdown()
    }
  }
}
