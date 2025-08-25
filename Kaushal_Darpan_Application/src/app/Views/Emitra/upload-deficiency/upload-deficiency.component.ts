import { Component, Input } from '@angular/core';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { DateConfigurationModel } from '../../../Models/DateConfigurationDataModels';
import { PublicInfoDataModel } from '../../../Models/PublicInfoDataModel';
import { EnumConfigurationType, EnumDepartment, EnumRole, EnumStatus, EnumUserType, GlobalConstants } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from "../../../Services/CommonFunction/common-function.service";
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { DocumentDetailsService } from '../../../Common/document-details';
import { AllotmentStatusSearchModel, AllotmentStatusDataModel } from '../../../Models/BTER/BTERAllotmentStatusDataModel';
import { PreviewApplicationModel } from '../../../Models/ItiApplicationPreviewDataModel';
import { EmitraRequestDetails, TransactionStatusDataModel } from '../../../Models/PaymentDataModel';
import { AllotmentStatusService } from '../../../Services/BTER/BTERAllotmentStatus/allotment-status.service';
import { DateConfigService } from '../../../Services/DateConfiguration/date-configuration.service';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { ReportService } from '../../../Services/Report/report.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { StudentService } from '../../../Services/Student/student.service';

@Component({
  selector: 'app-upload-deficiency',
  standalone:false,
  templateUrl: './upload-deficiency.component.html',
  styleUrl: './upload-deficiency.component.css'
})
export class UploadDeficiencyComponent {
  @Input() ApplicationID: number = 0;
  @Input() CourseTypeId: number = 0;
  @Input() DepartmentId: number = 1;
  @Input() CourseTypeName: string = '';
  @Input() CourseTypeNameHi: string = '';
  @Input() FinancialYearName: number = 0;
  @Input() TypeId: number = 0;

  public State: number = 0;
  public Message: string = '';
  public UserID: number = 0
  public ErrorMessage: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public UserName: string = '';
 
  emitraRequest = new EmitraRequestDetails();
  public searchRequest = new AllotmentStatusSearchModel();
  public AllotmentStatusList: AllotmentStatusDataModel[] = [];

  public PublicInfoList: PublicInfoDataModel[] = [];
  public PublicInfoDownloadsList: PublicInfoDataModel[] = [];
  public PublicInfoHighlightsList: PublicInfoDataModel[] = [];
  public PublicInfoNoteList: PublicInfoDataModel[] = [];


  public sendRequest = new AllotmentStatusDataModel();
  public isSubmitted: boolean = false;
  public request = new PreviewApplicationModel();
  public transactionStatusDataModel = new TransactionStatusDataModel();
  closeResult: string | undefined;
  captchaInput: string = '';
  captchaImageUrl: string = 'assets/images/captcha.jpg';

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public requestPublic = new PublicInfoDataModel();
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  public showApplybutton: boolean = false;
  public hideApplyButton: boolean = false;
  public ShowCommingSoon: boolean = false;
  dateConfiguration = new DateConfigurationModel();

  public HelplineNumber: string = '';
  public ContactEmail: string = '';


  constructor(
    private loaderService: LoaderService, 
    private commonservice: CommonFunctionService,
    private studentService: StudentService, 
    private modalService: NgbModal, 
    private toastr: ToastrService, 
    private documentDetailsService: DocumentDetailsService,
    private emitraPaymentService: EmitraPaymentService,
    private sweetAlert2: SweetAlert2, 
    private formBuilder: FormBuilder,
    private appsettingConfig: AppsettingService,
    private allotmentStatusService: AllotmentStatusService, 
    private reportService: ReportService, 
    private http: HttpClient, 
    private sSOLoginService: SSOLoginService,
    private cookieService: CookieService, 
    private routers: Router, 
    private sMSMailService: SMSMailService, 
    private dateMasterService: DateConfigService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //debugger
    if (this.CourseTypeId == 1) {
      this.HelplineNumber = '+91-9461172833';
      this.ContactEmail = 'technicaladvisorceg@gmail.com';
    }
    else if (this.CourseTypeId == 2) {
      this.HelplineNumber = '+91-8619637821';
      this.ContactEmail = 'mahila.admission@gmail.com';
    }
    else if (this.CourseTypeId == 3) {
      this.HelplineNumber = ' +91-9461172833';
      this.ContactEmail = 'technicaladvisorceg@gmail.com';
    }
    else if (this.CourseTypeId == 4) {
      this.HelplineNumber = '+91-8619637821';
      this.ContactEmail = 'mahila.admission@gmail.com';
    }
    else if (this.CourseTypeId == 5) {
      this.HelplineNumber = ' +91-8619637821';
      this.ContactEmail = 'dte.Lateral@rajasthan.gov.in';
    }

    await this.GetDateDataList();
    await this.GetPublicInfo();
  }

 



  async GetDateDataList() {
    try {
      this.dateConfiguration.DepartmentID = this.DepartmentId;
      this.dateConfiguration.SSOID = this.sSOLoginDataModel != null ? this.sSOLoginDataModel.SSOID : "";
      this.dateConfiguration.CourseTypeID= this.CourseTypeId;
      await this.dateMasterService.GetDateDataList(this.dateConfiguration)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          //this.AdmissionDateList = data['Data'];
          const today = new Date();        
          var activeCourseID: any = [];
          var th = this;
          if (data.Data.filter(function (dat: any) { return dat.TypeID == 1 && dat.CourseTypeID == th.CourseTypeId && dat.DepartmentID == th.DepartmentId && dat.IsDateOpen == 1 }).length > 0) {
            this.hideApplyButton = true;
          } else {
            this.hideApplyButton = false;
          }

          if (this.sSOLoginDataModel.SSOID == 'RJJP198919016890') {
            this.hideApplyButton = true;
          }

          if (this.hideApplyButton == false) {
            this.ShowCommingSoon = true;
          }

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async GetPublicInfo() {
    
    try {

      this.requestPublic.CourseTypeId = this.CourseTypeId
      this.requestPublic.CreatedBy = 0
      this.requestPublic.DepartmentId = 1;
      this.loaderService.requestStarted();
      this.requestPublic.Actoin = 'LIST';
      this.requestPublic.PageNumber = 1
      this.requestPublic.PageSize = 999999;
      await this.commonservice.PublicInfo(this.requestPublic)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PublicInfoList = data.Data;
          this.PublicInfoDownloadsList = this.PublicInfoList.filter(function (dat: any) { return dat.PublicInfoTypeId == 1 });
          this.PublicInfoHighlightsList = this.PublicInfoList.filter(function (dat: any) { return dat.PublicInfoTypeId == 2 });
          this.PublicInfoNoteList = this.PublicInfoList.filter(function (dat: any) { return dat.PublicInfoTypeId == 3 });

        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        //this.loaderService.requestEnded();
      }, 200);
    }
  }


  DownloadFile(FileName: string): void {
    if (FileName != '') {
      const fileUrl = this.appsettingConfig.StaticFileRootPathURL + GlobalConstants.PublicInfoDocument + "/" + FileName;
      this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = this.generateFileName('pdf');
        downloadLink.click();
        window.URL.revokeObjectURL(url);
      });
    }
  }



  onInput(event: any): void {
    const inputValue = event.target.value;

    // Remove non-digit characters
    const onlyDigits = inputValue.replace(/\D/g, '');

    // Update the input value with only digits
    event.target.value = onlyDigits;

    // Optionally, update the ngModel if needed
    this.MobileNo = onlyDigits;
  }

  async ResetControl() {
    this.searchRequest.ApplicationNo = '';
    this.searchRequest.DOB = '';
    this.AllotmentStatusList = [];
  }

  refreshCaptcha() {

    // This function will change the CAPTCHA image URL (this can be used to trigger a new CAPTCHA)
    // You can append a query parameter like a timestamp to prevent the browser from caching the image
    this.captchaImageUrl = 'assets/images/captcha.jpg?timestamp=' + new Date().getTime();
  }


  async ApplyConfirmmation() {
    await this.sweetAlert2.Confirmation("Are you sure you want to apply for the " + this.CourseTypeName + " admission ? <br>क्या आप " + (this.CourseTypeNameHi == undefined ? this.CourseTypeName : this.CourseTypeNameHi) + " के लिए आवेदन करना चाहते हैं?",
      async (result: any) => {
        if (result.isConfirmed) {
          
          if (this.TypeId == 0) {
            this.showApplybutton = true;
          } else {
            this.SSOLogin();
          }
        }
      });
  }

  async DownloadAllotmentLetter(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.reportService.DownloadAllotmentLetter(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data);
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

  async GetAllotmentStatusList() {
    this.Login();
  }

  RedirectEmitraPaymentRequest(pMERCHANTCODE: any, pENCDATA: any, pServiceURL: any) {

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", pServiceURL);

    //Hidden Encripted Data
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "ENCDATA");
    hiddenField.setAttribute("value", pENCDATA);
    form.appendChild(hiddenField);

    //Hidden Service ID
    var hiddenFieldService = document.createElement("input");
    hiddenFieldService.setAttribute("type", "hidden");
    hiddenFieldService.setAttribute("name", "SERVICEID");
    hiddenFieldService.setAttribute("value", this.emitraRequest.ServiceID);
    form.appendChild(hiddenFieldService);
    //Hidden Service ID
    var MERCHANTCODE = document.createElement("input");
    MERCHANTCODE.setAttribute("type", "hidden");
    MERCHANTCODE.setAttribute("name", "MERCHANTCODE");
    MERCHANTCODE.setAttribute("value", pMERCHANTCODE);
    form.appendChild(MERCHANTCODE);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  async SavePreview(content: any, ApplicationID: number) {
    ////this.IsShowViewStudent = true;
    this.request.ApplicationID = ApplicationID
    //this.GetById();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    /*await this.GetById();*/
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

  async CloseModel() {
    this.loaderService.requestStarted();
    setTimeout(() => {
      this.modalService.dismissAll();
      this.loaderService.requestEnded();
    }, 200);
  }


  async PayApplicationFees() {


    ;
    this.emitraRequest = new EmitraRequestDetails();
    //Set Parameters for emitra
    this.emitraRequest.Amount = Number(this.sendRequest.FeeAmount);
    this.emitraRequest.ApplicationIdEnc = this.sendRequest.ApplicationID.toString();
    this.emitraRequest.ServiceID = this.sendRequest.ServiceID.toString();
    this.emitraRequest.ID = this.sendRequest?.UniqueServiceID ?? 0;
    this.emitraRequest.UserName = this.sendRequest.StudentName;
    this.emitraRequest.MobileNo = this.sendRequest.MobileNo;
    this.emitraRequest.StudentID = this.sendRequest.AllotmentId;
    this.emitraRequest.SemesterID = 0;
    this.emitraRequest.ExamStudentStatus = 0;
    this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
    this.emitraRequest.DepartmentID = EnumDepartment.BTER;
    this.emitraRequest.FeeFor = 'AllotmentFee'
    // this.emitraRequest.CourseTypeID = this.sendRequest.CourseType;
    this.emitraRequest.TypeID = EnumConfigurationType.SeatAllotment;
    if (this.sSOLoginDataModel.RoleID == EnumRole.Emitra || this.sSOLoginDataModel.UserType == EnumUserType.GOVT) {
      this.emitraRequest.IsKiosk = true;
    }



    this.loaderService.requestStarted();
    try {
      await this.emitraPaymentService.EmitraApplicationPayment(this.emitraRequest)
        .then(async (data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            await this.RedirectEmitraPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA, data.Data.PaymentRequestURL)
          }
          else {
            let displayMessage = this.Message ?? this.ErrorMessage;
            this.toastr.error(displayMessage)
          }
        })
    }
    catch (ex) {

      console.log(ex)

    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DownloadChallan() {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.searchrequest.ApplicationID;
      console.log("searchrequest", this.sendRequest)
      await this.reportService.DownloadChallan(this.sendRequest.ApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data);
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

  DownloadFile11(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  async CheckPaymentSataus() {
    try {
      this.transactionStatusDataModel.TransactionID = this.sendRequest.TransactionID;
      this.transactionStatusDataModel.DepartmentID = this.sendRequest.DepartmentID;
      this.transactionStatusDataModel.PRN = this.sendRequest.PRN;
      this.transactionStatusDataModel.ServiceID = this.sendRequest.ServiceID;
      this.transactionStatusDataModel.ApplicationID = this.sendRequest.ApplicationID.toString();

      await this.emitraPaymentService.EmitraApplicationVerifyPaymentStatus(this.transactionStatusDataModel)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            if (data.Data?.STATUS == 'SUCCESS' || data.Data?.STATUS == 'Success') {
              if (data.Data?.PRN) {
                //this.router.navigate(['/ApplicationPaymentStatus'], { queryParams: { TransID: data.Data.PRN } });
                window.open(`/ApplicationPaymentStatus?TransID=${data.Data.PRN}`, "_self")
              }
            }
            else {
              this.toastr.error(this.Message)
            }
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async Login() {


    this.isSubmitted = true;


    this.loaderService.requestStarted();
    try {
      await this.sSOLoginService.MobileLogin(this.MobileNo, this.CourseTypeId)
        .then(async (data: any) => {
          // set jwt token
          localStorage.setItem('authtoken', data.headers.get('x-authtoken'));
          //
          data = JSON.parse(JSON.stringify(data.body));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {            
            this.sSOLoginDataModel = await data['Data'];
            this.sSOLoginDataModel.Eng_NonEng = this.CourseTypeId;
            this.sSOLoginDataModel.FinancialYearID = this.FinancialYearName;
            this.sSOLoginDataModel.Eng_NonEngName = this.CourseTypeName;
            this.sSOLoginDataModel.Mobileno = this.MobileNo;
            this.sSOLoginDataModel.DepartmentID = 1;
            this.ApplicationID = data['Data'].ApplicationID;

            //set user session 
            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
            //set cookie
            this.cookieService.set('LoginStatus', "OK");

            //redirect
            //window.open('/dashboard', "_self");
            this.CloseModal();
            this.routers.navigate(['/DTEApplicationform']);
          }
          else {
            this.toastr.error(this.Message);

          }
        }, (error: any) => {
          if (error.name == "HttpErrorResponse") {
            this.toastr.warning("Unable to service request.!");
          }
        });
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

  async SSOLogin() {
    debugger
    
    this.isSubmitted = true;

    if (this.sSOLoginDataModel.RoleID == 4) {

      //this.sSOLoginDataModel = await data['Data'];
      this.sSOLoginDataModel.Eng_NonEng = this.CourseTypeId;
      this.sSOLoginDataModel.Eng_NonEngName = this.CourseTypeName;
      this.sSOLoginDataModel.FinancialYearID = this.FinancialYearName;
      this.sSOLoginDataModel.Mobileno = "";
      this.sSOLoginDataModel.DepartmentID = 1;
      this.ApplicationID = 0;

      //set user session 
      localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
      //set cookie
      this.cookieService.set('LoginStatus', "OK");

      //redirect
      //window.open('/dashboard', "_self");
      this.CloseModal();
      this.routers.navigate(['/DTEApplicationform']);


    } else {
      this.loaderService.requestStarted();
      try {
        await this.sSOLoginService.MobileLogin(this.sSOLoginDataModel.SSOID, this.CourseTypeId)
          .then(async (data: any) => {
            
            // set jwt token
            localStorage.setItem('authtoken', data.headers.get('x-authtoken'));
            //
            data = JSON.parse(JSON.stringify(data.body));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {              
              this.sSOLoginDataModel = await data['Data'];
              this.sSOLoginDataModel.Eng_NonEng = this.CourseTypeId;
              this.sSOLoginDataModel.FinancialYearID = this.FinancialYearName;
              this.sSOLoginDataModel.Eng_NonEngName = this.CourseTypeName;
              this.sSOLoginDataModel.Mobileno = this.MobileNo;
              this.sSOLoginDataModel.DepartmentID = 1;
              this.ApplicationID = data['Data'].ApplicationID;

              //set user session 
              localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
              //set cookie
              this.cookieService.set('LoginStatus', "OK");

              //redirect
              //window.open('/dashboard', "_self");
              this.CloseModal();
              this.routers.navigate(['/DTEApplicationform']);
            }
            else {
              this.toastr.error(this.Message);

            }
          }, (error: any) => {
            if (error.name == "HttpErrorResponse") {
              this.toastr.warning("Unable to service request.!");
            }
          });

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
  }

  get MaskedMobileNo(): string {
    if (!this.MobileNo || this.MobileNo.length < 5) return this.MobileNo;

    const visibleDigits = this.MobileNo.slice(-5); // last 5 digits
    return 'XXXXX' + visibleDigits;
  }

  async openModalGenerateOTP(content: any) {

    if (this.MobileNo == "") {
      return;
    }

    this.OTP = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.SendOTP();
    
  }


  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      this.request.MobileNo = this.MobileNo;
      await this.sMSMailService.SendMessage(this.request.MobileNo, "OTP")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.startTimer();
            //open modal popup
            this.GeneratedOTP = data['Data'];
            if (isResend) {
              this.toastr.success('OTP resent successfully');
            }
          }
          else {
            this.toastr.warning('Something went wrong');
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

  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.Login();
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
        this.toastr.error('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastr.warning('Please Enter OTP');
    }
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


  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  CloseModal() {

    this.modalService.dismissAll();
  }
}
