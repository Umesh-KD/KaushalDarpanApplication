import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumDepartment, EnumStatus, GlobalConstants, enumExamStudentStatus } from '../../../Common/GlobalConstants';
import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { StudentService } from '../../../Services/Student/student.service';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { CookieService } from 'ngx-cookie-service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { DateConfigService } from '../../../Services/DateConfiguration/date-configuration.service';
import { DateConfigurationModel } from '../../../Models/DateConfigurationDataModels';
import { Router } from '@angular/router';
import { CounsellingApplicationFormService } from '../../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { CounsellingApplicationSearchModel } from '../../../Models/CounsellingApplicationFormDataModel';
import { EnumRole } from '../../../Common/GlobalConstants';
import { MenuService } from '../../../Services/Menu/menu.service';
 import { ToastrModule } from 'ngx-toastr';
 import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
@Component({
  selector: 'app-candidate-sso-mapping-module',
  standalone: false,
  templateUrl: './candidate-sso-mapping-module.component.html',
  styleUrl: './candidate-sso-mapping-module.component.css'
})
export class CandidateSsoMappingModuleComponent implements OnInit, OnDestroy {
  public StreamMasterList: [] = [];
  public SemesterList: [] = [];
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public ApplicationNo: string = '';
  public DOB: string = '';
  public StudentDetailsModelList: any[] = [];
  public searchRequest = new CounsellingApplicationSearchModel();

  public DateConfigSetting: any = [];
  public DateConfigSetting1: any = [];
  public DateConfigSetting_Direct: any = [];
  public _EnumDepartment = EnumDepartment;
  public isShowGrid: boolean = false;
  public searchssoform!: FormGroup
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  public CandidateID: number = 0;
  sSOLoginDataModel = new SSOLoginDataModel();
  public isSubmitted: boolean = false
  encryptedParam!: string;
  public DefaultApplicationText: String = '';
  BTER: any;
  ITI: any;
  MapKeyEng: number = 0;
  DirectAdmissionMapKey: number = 0;
  BterMapKeyEng: number = 0;
  studentDetailsModel = new StudentDetailsModel();
  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  ShowBTERApply: boolean = false;
  dateConfiguration = new DateConfigurationModel();
  _EnumRole = EnumRole;
  constructor(
    private loaderService: LoaderService,
    private encryptionService: EncryptionService,
    private commonservice: CommonFunctionService,
    public appsettingConfig: AppsettingService,
    private studentService: StudentService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private sMSMailService: SMSMailService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private dateMasterService: DateConfigService,
    private router: Router,
    private counsellingApplicationFormService: CounsellingApplicationFormService,
    private menuService: MenuService,
    private toastr: ToastrService,
    private sSOLoginService:SSOLoginService
  ) { }

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

  async ngOnInit()
  {
    this.searchssoform = this.formBuilder.group({
      txtMobileNo: ['', Validators.required]
    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  encryptParameter(param: any) {
    return this.encryptionService.encryptData(param);
  }
  get _searchssoform() { return this.searchssoform.controls; }

  async onSearchClick()
  {
    await this.GetAllDataActionWise();
    
  }

  async ResetControl() {
    this.SemesterID = 0;
    this.StreamID = 0;
    this.ApplicationNo = '';
    this.isShowGrid = false;
    this.StudentDetailsModelList = [];
    this.studentDetailsModel = new StudentDetailsModel();
    this.searchRequest = new CounsellingApplicationSearchModel();
  }
  async GetStreamMaster() {
    this.StreamMasterList = [];
    try {
      this.loaderService.requestStarted();
      await this.commonservice.StreamMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StreamMasterList = data['Data'];
          }
          else {

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
  async GetSemesterMaster() {
    this.SemesterList = [];
    try {
      this.loaderService.requestStarted();

      await this.commonservice.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.SemesterList = data['Data'];
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

  async GetAllDataActionWise()
  {
    this.isSubmitted = true
    if (this.searchssoform.invalid)
    {
      return
    }
    this.isShowGrid = true;
    this.searchRequest.Action = '_GetCandidateSsoMapping';
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();

      await this.counsellingApplicationFormService.MapCandidateSSO(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
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

  async PayFees(item: any) { }
async BackToSSO() {
    console.log("BAck to SSO...");
    sessionStorage.removeItem('userid');
    sessionStorage.removeItem('LoginID');
    sessionStorage.clear();
    localStorage.clear();
    try {
      this.loaderService.requestStarted();
      //await this.menuService.BackToSSO(this.appsettingConfig.BacktoSSOURL?.toString());
      //await this.menuService.BackToSSO("https://ssotest.rajasthan.gov.in/sso");
      await this.sSOLoginService.BackToSSO();
      this.modalService.dismissAll();
    }
    catch (Ex) {
      console.log(Ex);

    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
    }
  }
  async VerifyOTP()
  {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try
        {

          //this.searchRequest.studentId = this.studentDetailsModel.StudentID;
          this.searchRequest.CandidateId = this.CandidateID;
          this.searchRequest.SSOID= this.sSOLoginDataModel.SSOID;
          /*    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;*/
          this.loaderService.requestStarted();
          await this.counsellingApplicationFormService.UpdateCandidateSsoMapping(this.searchRequest)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State == EnumStatus.Success)
              {
                this.toastrService.success(data.Message);
                //Set User cookie
                this.sSOLoginDataModel.CandidateID = this.searchRequest.CandidateId;
                this.sSOLoginDataModel.RoleID=this._EnumRole.CandidateRole;
                localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
                this.cookieService.set('LoginStatus', "OK");
                this.modalService.dismissAll();
                // setTimeout(() => {
                //   this.router.navigate(['/CandidateApplicationList']);
                // }, 1000);
                setTimeout(() => {
                  this.toastr.success(
                  'Your SSO ID successfully mapped, kindly re-login',
                  'Success'
                  );
                  this.BackToSSO();
                // this.authService.logout(); // if exists
                }, 500);
              }
              else
              {
                this.toastrService.success(data.Message);
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
        this.toastrService.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastrService.warning('Please Enter OTP');
    }
  }

  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      //this.studentDetailsModel.MobileNo = "7737348604";
      await this.sMSMailService.SendMessage(this.MobileNo, "OTP")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.startTimer();
            //open modal popup
            this.GeneratedOTP = data['Data'];
            if (isResend) {
              this.toastrService.success('OTP resent successfully');
            }
          }
          else {
            this.toastrService.warning('Something went wrong');
          }
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



  //Start Section Model
  async openModalGenerateOTP(content: any, item: any) {
    debugger;
    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = item.MobileNo;
    this.CandidateID = item.CandidateID
    this.SendOTP();
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
  CloseModal() {

    this.modalService.dismissAll();
  }

  resetOTPControls() {
    this.OTP = "";
    this.GeneratedOTP = "";

  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;


    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true; // Show the button when time is up
      }
    }, 1000); // Update every second
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  @ViewChild('content') content: ElementRef | any;

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  //Modal Section END



  async openModal(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });


  }




  


 


}

