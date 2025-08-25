import { Component, Input } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { AppsettingService } from "../../../Common/appsetting.service";
import { DocumentDetailsService } from "../../../Common/document-details";
import { SweetAlert2 } from "../../../Common/SweetAlert2";
import { CommonFunctionService } from "../../../Services/CommonFunction/common-function.service";
import { EmitraPaymentService } from "../../../Services/EmitraPayment/emitra-payment.service";
import { LoaderService } from "../../../Services/Loader/loader.service";
import { StudentService } from "../../../Services/Student/student.service";
import { SSOLoginDataModel } from "../../../Models/SSOLoginDataModel";
import { EmitraRequestDetails, TransactionStatusDataModel } from "../../../Models/PaymentDataModel";
import { EnumStatus, EnumConfigurationType, EnumRole, EnumUserType, GlobalConstants, EnumMessageType, EnumDepartment } from "../../../Common/GlobalConstants";
import { AllotmentStatusDataModel, AllotmentStatusSearchModel } from "../../../Models/BTER/BTERAllotmentStatusDataModel";
import { AllotmentStatusService } from "../../../Services/BTER/BTERAllotmentStatus/allotment-status.service";
import { PreviewApplicationModel } from "../../../Models/ItiApplicationPreviewDataModel";
import { ReportService } from "../../../Services/Report/report.service";
import { HttpClient } from "@angular/common/http";
import { SSOLoginService } from "../../../Services/SSOLogin/ssologin.service";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { SMSMailService } from "../../../Services/SMSMail/smsmail.service";
import { PublicInfoDataModel } from "../../../Models/PublicInfoDataModel";
import { DateConfigService } from "../../../Services/DateConfiguration/date-configuration.service";
import { DateConfigurationModel } from "../../../Models/DateConfigurationDataModels";
import { StudentSearchModel } from "../../../Models/StudentSearchModel";

import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { ApplicationStatusService } from "../../../Services/ApplicationStatus/EmitraApplicationStatus.service";
import { UploadBTERFileModel, UploadFileModel } from "../../../Models/UploadFileModel";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-difference-form',
  templateUrl: './difference-form.component.html',
  styleUrls: ['./difference-form.component.css'],
  standalone: false
})

export class DifferenceFormComponent {
  @Input() ApplicationID: number = 0;
  @Input() CourseTypeId: number = 0;
  @Input() DepartmentId: number = 1;
  @Input() CourseTypeName: string = '';
  @Input() CourseTypeNameHi: string = '';
  @Input() TypeId: number = 0;
  public DocumentList: DocumentDetailsModel[] = []
  public State: number = 0;
  public Message: string = '';
  public UserID: number = 0
  public EndTermID: number = 0
  public CommonRemark: string = ''
  public ErrorMessage: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public AcademicYear: number = 0
  public CourseType:number=0
  public UserName: string = '';
  public overallRemark: string = '';
  emitraRequest = new EmitraRequestDetails();
  //public searchRequest = new AllotmentStatusSearchModel();
  public searchRequest = new StudentSearchModel();
  public ApplicationList:any  = [];

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
  public ShowEditOption: boolean = false;
  dateConfiguration = new DateConfigurationModel();

  public HelplineNumber: string = '';
  public ContactEmail: string = '';

  constructor(private loaderService: LoaderService, private commonservice: CommonFunctionService,
    private studentService: StudentService, private modalService: NgbModal, private toastr: ToastrService, private documentDetailsService: DocumentDetailsService,
    private emitraPaymentService: EmitraPaymentService,
    private sweetAlert2: SweetAlert2, private formBuilder: FormBuilder,
    private appsettingConfig: AppsettingService,
    private allotmentStatusService: AllotmentStatusService, private reportService: ReportService, private http: HttpClient, private sSOLoginService: SSOLoginService,
    private cookieService: CookieService, private routers: Router, private sMSMailService: SMSMailService, private dateMasterService: DateConfigService,
    private studentService1: ApplicationStatusService, 

  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
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



  EditOptionForm(MobileNo: any, CourseTypeId: any, CourseTypeName: any, ApplicationID: any) {
    this.Login(MobileNo, CourseTypeId, CourseTypeName, ApplicationID);
  }

  async GetDateDataList() {
    try {
      this.dateConfiguration.DepartmentID = this.DepartmentId;
      this.dateConfiguration.SSOID = this.sSOLoginDataModel != null ? this.sSOLoginDataModel.SSOID : "";
      this.dateConfiguration.CourseTypeID = this.CourseTypeId;
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

          if (data.Data.filter(function (dat: any) { return dat.TypeID == 150 && dat.DepartmentID == th.DepartmentId && dat.IsDateOpen == 1 }).length > 0) {
            this.ShowEditOption = true;
          } else {
            this.ShowEditOption = false;
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

  async GetStudentApplication() {

    this.searchRequest.DepartmentID = 1;
    this.searchRequest.MobileNumber = this.request.MobileNo;
    this.ApplicationList = [];
    try {
      this.loaderService.requestStarted();
      await this.studentService.GetReverApplication(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ApplicationList = data['Data'];    

       
            /* alert(this.request.IsSupplement)*/

            if (this.ApplicationList.length < 1 || this.ApplicationList.length == undefined || this.ApplicationList.length == null) {
              this.sweetAlert2.Info("No Application with Deficiency is Identified")
              this.ApplicationList = []
              return
            }
            
            console.log(this.ApplicationList)
          
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
    //this.AllotmentStatusList = [];
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

  async Login(MobileNo: any, CourseTypeId: any, CourseTypeName: any, ApplicationID:any) {


    this.isSubmitted = true;


    this.loaderService.requestStarted();
    try {
      await this.sSOLoginService.MobileLogin(MobileNo, CourseTypeId)
        .then(async (data: any) => {
          // set jwt token
          localStorage.setItem('authtoken', data.headers.get('x-authtoken'));
          //
          data = JSON.parse(JSON.stringify(data.body));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            ;
            this.sSOLoginDataModel = await data['Data'];
            this.sSOLoginDataModel.Eng_NonEng = CourseTypeId;
            this.sSOLoginDataModel.Eng_NonEngName = CourseTypeName;
            this.sSOLoginDataModel.Mobileno = MobileNo;
            this.sSOLoginDataModel.DepartmentID = 1;
            this.ApplicationID = ApplicationID;

            //set user session 
            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
            //set cookie
            this.cookieService.set('LoginStatus', "OK");

            //redirect
            //window.open('/dashboard', "_self");
            this.CloseModal();
            this.routers.navigate(['/EditOptionForm']);
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

    
    this.isSubmitted = true;

    if (this.sSOLoginDataModel.RoleID == 4) {

      //this.sSOLoginDataModel = await data['Data'];
      this.sSOLoginDataModel.Eng_NonEng = this.CourseTypeId;
      this.sSOLoginDataModel.Eng_NonEngName = this.CourseTypeName;
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
      await this.sMSMailService.SendMessage(this.request.MobileNo, EnumMessageType.Bter_OTP)
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
    debugger
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
         await this.GetStudentApplication();
          this.CloseModal();
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
  //CloseModal() {

  //  this.modalService.dismissAll();
  //}


  async openModal(content: any, ApplicationID: number, CourseType: number=0, AcademicYearID: number = 9, EndTermID:number=14) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    debugger
    this.ApplicationID = ApplicationID
    this.CourseType = CourseType
    this.ApplicationID = ApplicationID
    this.AcademicYear = AcademicYearID
    this.EndTermID = EndTermID
    this.GetDatabyID(ApplicationID)
  }

  //private getDismissReason(reason: any): string {
  //  if (reason === ModalDismissReasons.ESC) {
  //    return 'by pressing ESC';
  //  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //    return 'by clicking on a backdrop';
  //  } else {
  //    return `with: ${reason}`;
  //  }
  //}
  CloseModal() {

    this.modalService.dismissAll();
/*    this.DocumentList = []*/
/*    this.GetAllDataActionWise()*/
  }



  async GetDatabyID(ApplicationID: number) {

    this.ApplicationID = ApplicationID


    try {
      this.loaderService.requestStarted();

      await this.studentService1.GetByID(ApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DocumentList = data['Data'];
            this.DocumentList.forEach(e => e.FileName = '')
            this.DocumentList = this.DocumentList.map(doc => ({
              ...doc,
              DisplayColumnNameEn: doc.DisplayColumnNameEn.replace(/^Upload the scanned copy of /i, '') // Remove "upload the "
            }));

            this.CommonRemark = data['Data'][0]['CommonRemark']
            console.log(this.DocumentList)
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

  //document
  async UploadDocument(event: any, item: any) {
    try {
      //upload model
      let uploadModel: UploadBTERFileModel = {
        ApplicationID: this.ApplicationID.toString() ?? "0",
        AcademicYear: this.AcademicYear.toString() ?? "0",
        DepartmentID: '1',
        EndTermID: this.EndTermID.toString() ?? "0",
        Eng_NonEng: this.CourseType.toString() ?? "0",
        FileName: item.ColumnName ?? "",
        FileExtention: item.FileExtention ?? "",
        MinFileSize: item.MinFileSize ?? "",
        MaxFileSize: item.MaxFileSize ?? "",
        FolderName: item.FolderName ?? "",
        IsCopy: true 
      }
      debugger
      //call
      await this.documentDetailsService.UploadBTERDocument(event, uploadModel)
        .then((data: any) => {
        
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            //add/update document in js list

            const index = this.DocumentList.findIndex((x: any) =>
              x.DocumentMasterID == item.DocumentMasterID &&
              x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.DocumentList[index].FileName = data.Data[0].FileName;
              this.DocumentList[index].Dis_FileName = data.Data[0].Dis_FileName;
              this.DocumentList[index].OldFileName = data.Data[0].OldFileName;
            }
            //reset file type
            event.target.value = null;
            this.DocumentList.forEach(item => {
              item.validationError = '';
            });

          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
      debugger
      item.Dis_FileName = ''
      item.FileName = ''
      this.DeleteDocument(item)
      this.sweetAlert2.Warning("Please Upload Valid File Type");
    }
  }
  async DeleteDocument(item: any) {
    try {
      // delete from server folder

      let deleteModel = new DeleteDocumentDetailsModel()

      deleteModel.FolderName = item.FolderName ?? "";
      deleteModel.FileName = item.FileName;
      //call
      await this.documentDetailsService.DeleteBTERDocument(deleteModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.DocumentList.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.DocumentList[index].FileName = '';
              this.DocumentList[index].Dis_FileName = '';
            }
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async DocumentSave() {
    console.log(this.DocumentList);
    debugger
    // Check if all required documents are uploaded
    let isValidationFailed = false;

    this.DocumentList.forEach(item => {
      // Reset any previous error message
      item.validationError = '';

      // If both filenames are empty, mark as validation error
      if (!item.FileName || !item.Dis_FileName) {
        item.validationError = 'Please upload the required document.';
        isValidationFailed = true;
      } else {
        // Ensure file has valid extension if needed (optional validation)
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
        const fileExt = item.FileName.split('.').pop()?.toLowerCase();
        if (!allowedExtensions.includes(fileExt??"")) {
          item.validationError = 'Invalid file format. Allowed: PDF, JPG, PNG, DOC, DOCX';
          isValidationFailed = true;
        }
      }
    });

    if (isValidationFailed) {
      this.toastr.error("Please upload all required documents.");
      return;
    }

    // Set ModifyBy for all documents before saving
    this.DocumentList.forEach(e => {
      e.ModifyBy = this.sSOLoginDataModel.UserID;
    });

    // Confirmation before final save
    this.sweetAlert2.Confirmation(
      "Are you sure you want to upload this document? Please verify the details before proceeding.",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.DocumentList.forEach(e => {
              e.SubRemark = this.overallRemark
            })
            
            this.loaderService.requestStarted();

            await this.studentService1.SaveDocumentData(this.DocumentList).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (data.State === EnumStatus.Success) {
                this.toastr.success(data.Message);
                this.ApplicationList = [];
                this.CloseModal();
              } else if (data.State === EnumStatus.Error) {
                this.toastr.error(data.ErrorMessage);
              } else if (data.State === EnumStatus.Warning) {
                this.toastr.warning(data.ErrorMessage);
              }
            });
          } catch (Ex) {
            console.log(Ex);
          } finally {
            this.loaderService.requestEnded();
          }
        }
      }
    );
  }


  //async DocumentSave() {
  //  console.log(this.DocumentList)
  //  debugger
  //  this.toastr.error("Please Upload File ");
  //    alert("Please Upload File ");
  //  if (this.documentDetailsService.HasRequiredDocument(this.DocumentList)) {
  //    return;
  //  }
  //  this.DocumentList.forEach(e => {
  //    e.ModifyBy = this.sSOLoginDataModel.UserID

  //  })
  //  const isEmpty = this.DocumentList.some(x => x.FileName == '' && x.Dis_FileName == '')
  //  if (isEmpty) {
  //    this.toastr.error("Please Upload File ");
  //    alert("Please Upload File ");
  //    return
  //  }
  //  this.sweetAlert2.Confirmation("Are you sure you want to upload this document ? Please verify the details before proceeding.",
  //    async (result: any) => {
  //      //confirmed
  //      if (result.isConfirmed) {

  //        try {

  //          this.loaderService.requestStarted();
  //          await this.studentService1.SaveDocumentData(this.DocumentList).then((data: any) => {

  //            data = JSON.parse(JSON.stringify(data));
  //            this.State = data['State'];
  //            this.Message = data['Message'];
  //            this.ErrorMessage = data['ErrorMessage'];

  //            if (data.State == EnumStatus.Success) {

  //              this.toastr.success(data.Message);
  //              this.ApplicationList = []
  //              this.CloseModal()

  //            }
  //            if (data.State === EnumStatus.Error) {
  //              this.toastr.error(data.ErrorMessage);
  //            } else if (data.State === EnumStatus.Warning) {
  //              this.toastr.warning(data.ErrorMessage);
  //            }
  //          });
  //        } catch (Ex) {
  //          console.log(Ex);
  //        } finally {
  //          this.loaderService.requestEnded();
  //        }
  //      }
  //    });

  //}

  
  
}
