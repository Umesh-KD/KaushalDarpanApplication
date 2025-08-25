import { Component, Input } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AppsettingService } from "../../../Common/appsetting.service";
import { DocumentDetailsService } from "../../../Common/document-details";
import { SweetAlert2 } from "../../../Common/SweetAlert2";
import { CommonFunctionService } from "../../../Services/CommonFunction/common-function.service";
import { EmitraPaymentService } from "../../../Services/EmitraPayment/emitra-payment.service";
import { LoaderService } from "../../../Services/Loader/loader.service";
import { StudentService } from "../../../Services/Student/student.service";
import { SSOLoginDataModel } from "../../../Models/SSOLoginDataModel";
import { EmitraRequestDetails, TransactionStatusDataModel } from "../../../Models/PaymentDataModel";
import { EnumStatus, EnumConfigurationType, EnumRole, EnumUserType, GlobalConstants, EnumDepartment, EnumEmitraService, EnumFeeFor } from "../../../Common/GlobalConstants";
import { AllotmentStatusDataModel, AllotmentStatusSearchModel } from "../../../Models/BTER/BTERAllotmentStatusDataModel";
import { AllotmentStatusService } from "../../../Services/BTER/BTERAllotmentStatus/allotment-status.service";
import { PreviewApplicationModel } from "../../../Models/ItiApplicationPreviewDataModel";
import { ReportService } from "../../../Services/Report/report.service";
import { HttpClient } from "@angular/common/http";
import { DateConfigurationModel } from "../../../Models/DateConfigurationDataModels";
import { DateConfigService } from "../../../Services/DateConfiguration/date-configuration.service";
import { SafeResourceUrl } from "@angular/platform-browser";
import { BTERAllotmentService } from "../../../Services/BTER/Allotment/allotment.service";


@Component({
  selector: 'app-allot-status',
  templateUrl: './allot-status.component.html',
  styleUrls: ['./allot-status.component.css'],
  standalone: false
})

export class AllotStatusComponent {
  @Input() CourseTypeId: number = 0;
  public State: number = 0;
  public Message: string = '';
  public UserID: number = 0
  public ErrorMessage: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  emitraRequest = new EmitraRequestDetails();
  public searchRequest = new AllotmentStatusSearchModel();
  public AllotmentStatusList: AllotmentStatusDataModel[] = [];
  public sendRequest = new AllotmentStatusDataModel();
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;

  public request = new PreviewApplicationModel();
  public transactionStatusDataModel = new TransactionStatusDataModel();
  closeResult: string | undefined;
  captchaInput: string = '';
  captchaImageUrl: string = 'assets/images/captcha.jpg';

    public ShowCommingSoon: boolean = false;
   dateConfiguration = new DateConfigurationModel();
   public DepartmentId: number = 1;
  public PDFURL: string = '';
  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  public HelplineNumber: string = '';
  public ContactEmail: string = '';


  constructor(private loaderService: LoaderService, private commonservice: CommonFunctionService,
    private studentService: StudentService, private modalService: NgbModal, private toastr: ToastrService, private documentDetailsService: DocumentDetailsService,
    private emitraPaymentService: EmitraPaymentService,
    private sweetAlert2: SweetAlert2, private formBuilder: FormBuilder,
    private appsettingConfig: AppsettingService,
    private allotmentStatusService: AllotmentStatusService, private reportService: ReportService, private http: HttpClient,
    private dateMasterService: DateConfigService,
    private Swal2: SweetAlert2,
    private bterAllotmentService: BTERAllotmentService,
  ) { }

  async ngOnInit() {
        //this.searchRequest.ApplicationNo = "234234";
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
  }
  async ResetControl() {
    this.searchRequest.ApplicationNo = '';
    this.searchRequest.DOB = '';
    this.AllotmentStatusList = [];
  }

  async GetDateDataList() {
    try {
      this.dateConfiguration.DepartmentID = this.DepartmentId;
      this.dateConfiguration.SSOID = this.sSOLoginDataModel != null ? this.sSOLoginDataModel.SSOID : "";
      //this.dateConfiguration.CourseTypeID= this.CourseTypeId;
      await this.dateMasterService.GetDateDataList(this.dateConfiguration)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          //this.AdmissionDateList = data['Data'];
          const today = new Date();        
          var activeCourseID: any = [];
          var th = this;
          if (data.Data.filter(function (dat: any) { return (dat.TypeID == 24 || dat.TypeID == 63)&&  dat.DepartmentID == th.DepartmentId && dat.IsDateOpen == 1 }).length > 0) {
            this.ShowCommingSoon = false;
          } else {
            this.ShowCommingSoon = true ;
          }        

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  refreshCaptcha() {
    
    // This function will change the CAPTCHA image URL (this can be used to trigger a new CAPTCHA)
    // You can append a query parameter like a timestamp to prevent the browser from caching the image
    this.captchaImageUrl = 'assets/images/captcha.jpg?timestamp=' + new Date().getTime();
  }

  async DownloadAllotmentLetter(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.bterAllotmentService.DownloadAllotmentLetter(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'AllotmentLetter' + id +'.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
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

  async DownloadAllotmentLetterFeeRpt(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.bterAllotmentService.GetAllotmentFeeReceipt(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'Allotment-Fee-Receipt' + id + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
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
    
    this.isSubmitted = true
  
    try {
      this.loaderService.requestStarted();
      this.AllotmentStatusList = [];
      //this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.DepartmentId=1
      await this.allotmentStatusService.GetAllotmentStatusList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {


            if (data.Data[0].Status == 1) {
              this.AllotmentStatusList = data['Data'];
              this.sendRequest.StudentName = data['Data'][0]['StudentName']
              this.sendRequest.StudentNameHindi = data['Data'][0]['StudentNameHindi']
              this.sendRequest.FatherName = data['Data'][0]['FatherName']
              this.sendRequest.FatherNameHindi = data['Data'][0]['FatherNameHindi']
              this.sendRequest.MotherName = data['Data'][0]['MotherName']
              this.sendRequest.MotherNameHindi = data['Data'][0]['MotherNameHindi']
              this.sendRequest.AadharNo = data['Data'][0]['AadharNo']
              this.sendRequest.Gender = data['Data'][0]['Gender']
              this.sendRequest.DOB = data['Data'][0]['DOB']
              this.sendRequest.StudentCategory = data['Data'][0]['StudentCategory']
              this.sendRequest.MobileNo = data['Data'][0]['MobileNo']
              this.sendRequest.FeeAmount = data['Data'][0]['FeeAmount']
              this.sendRequest.CourseType = data['Data'][0]['CourseType']
              this.sendRequest.ServiceID = data['Data'][0]['ServiceID']
              this.sendRequest.UniqueServiceID = data['Data'][0]['UniqueServiceID']
              this.sendRequest.AllotmentId = data['Data'][0]['AllotmentId']
              this.sendRequest.ApplicationID = data['Data'][0]['ApplicationID']
              this.sendRequest.ApplicationNo = data['Data'][0]['ApplicationNo']
              this.sendRequest.Email = data['Data'][0]['Email']
        
              console.log(data['Data'][0], "slindinglist")
            } else {
              this.toastr.error(data.Data[0].MSG);
            }
          } else {
            //this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  RedirectEmitraPaymentRequest1212(pMERCHANTCODE: any, pENCDATA: any, pServiceURL: any) {
    
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


  async PayApplicationFees1222() {
    

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


  async PayApplicationFees() {

    this.Swal2.Confirmation("Are you sure you want to Submit & Make Payment?", async (result: any) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.emitraRequest = new EmitraRequestDetails();
        //Set Parameters for emitra
        this.emitraRequest.Amount = Number(this.sendRequest.FeeAmount);
        this.emitraRequest.ProcessingFee = 0;// Number(this.request.ProcessingFee);
        this.emitraRequest.ApplicationIdEnc = this.sendRequest.AllotmentId.toString();
        if (this.sSOLoginDataModel.IsKiosk) {
          this.emitraRequest.ServiceID = this.sSOLoginDataModel.ServiceID.toString();
          this.emitraRequest.KIOSKCODE = this.sSOLoginDataModel.KIOSKCODE;
          if (
            EnumEmitraService.BTER_DeplomaENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
            EnumEmitraService.BTER_DeplomaNonENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
            EnumEmitraService.BTER_DeplomaLateral_2ENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
            EnumEmitraService.BTER_DegreeNonENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
            EnumEmitraService.BTER_DegreeLateral_2Year_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID

          ) {
            this.emitraRequest.SSoToken = this.sSOLoginDataModel.SSoToken;
            this.emitraRequest.FormCommision = 0;
          }
          else {
            this.emitraRequest.SSoToken = this.sSOLoginDataModel.SSoToken;
            this.emitraRequest.FormCommision = 10;
          }
        }
        else {
          this.emitraRequest.ServiceID = this.sendRequest.ServiceID.toString()
          this.emitraRequest.ID = this.sendRequest?.UniqueServiceID ?? 0;
          this.emitraRequest.FormCommision = 0;
        }
        this.emitraRequest.IsKiosk = this.sSOLoginDataModel.IsKiosk;
        this.emitraRequest.UserName = this.sendRequest.StudentName;
        this.emitraRequest.MobileNo = this.sendRequest.MobileNo;
        this.emitraRequest.StudentID = this.sendRequest.ApplicationID;
        this.emitraRequest.SemesterID = 0;
        this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
        this.emitraRequest.TypeID = EnumConfigurationType.AllotmentFee;
        this.emitraRequest.DepartmentID = EnumDepartment.BTER;
        this.emitraRequest.FeeFor = EnumFeeFor.Allotment;
        this.emitraRequest.USEREMAIL = this.sendRequest.Email;
        if (this.emitraRequest.IsKiosk) {
          this.loaderService.requestStarted();
          try {
            await this.emitraPaymentService.EmitraApplicationPayment(this.emitraRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                this.PDFURL = data['PDFURL'];
                if (data.State == EnumStatus.Success) {
                  this.Swal2.ConfirmationSuccess("Thank you! Your application payment was successful", async (result: any) => {
                    if (result.isConfirmed) {
                      this.isLoading = false;
                      //sms code missiog
                      try {
                        //await this.SendApplicationMessage();
                        window.open(this.PDFURL, '_blank');
                        setTimeout(function () { window.location.reload(); }, 200)
                      }
                      catch (ex) {
                        console.log(ex)
                        this.isLoading = false;
                      }
                    }
                    else {
                      let displayMessage = this.Message ?? this.ErrorMessage;
                      this.toastr.error(displayMessage);
                      this.isLoading = false;
                    }
                  });
                  //open
                }
                else {
                  let displayMessage = this.Message ?? this.ErrorMessage;
                  this.toastr.error(displayMessage)
                  this.isLoading = false;
                }
              })
          }
          catch (ex) {
            console.log(ex)
          }
          finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
              // this.isLoading = false;
            }, 2000);
          }

        }
        else {
          this.loaderService.requestStarted();
          try {
            await this.emitraPaymentService.EmitraApplicationPaymentNew(this.emitraRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                if (data.State == EnumStatus.Success) {
                  await this.RedirectEmitraPaymentRequest(
                    data.Data.MERCHANTCODE,
                    data.Data.ENCDATA,
                    data.Data.PaymentRequestURL
                  )

                }
                else {

                  let displayMessage = this.Message ?? this.ErrorMessage;
                  this.toastr.error(displayMessage)
                  this.isLoading = false;
                }
              })
          }

          catch (ex) { console.log(ex) }

          finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
              // this.isLoading = false;
            }, 2000);
          }
        }
      }
    }
    )

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






  async DownloadChallan() {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.searchrequest.ApplicationID;
      console.log("searchrequest", this.sendRequest)
      await this.reportService.DownloadChallan(this.sendRequest.ApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
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

  DownloadFile(FileName: string, DownloadfileName: any): void {

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

}
