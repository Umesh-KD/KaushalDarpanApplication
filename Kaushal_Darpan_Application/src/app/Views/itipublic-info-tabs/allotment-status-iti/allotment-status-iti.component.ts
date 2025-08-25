import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EmitraRequestDetails, TransactionStatusDataModel } from '../../../Models/PaymentDataModel';
import { AllotmentStatusDataModel, AllotmentStatusSearchModel } from '../../../Models/BTER/BTERAllotmentStatusDataModel';
import { PreviewApplicationModel } from '../../../Models/ItiApplicationPreviewDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { StudentService } from '../../../Services/Student/student.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DocumentDetailsService } from '../../../Common/document-details';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { FormBuilder } from '@angular/forms';
import { AppsettingService } from '../../../Common/appsetting.service';
import { AllotmentStatusService } from '../../../Services/BTER/BTERAllotmentStatus/allotment-status.service';
import { ReportService } from '../../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';
import { EnumConfigurationType, EnumDepartment, EnumRole, EnumStatus, EnumUserType, GlobalConstants } from '../../../Common/GlobalConstants';
import { ITIAllotmentService } from '../../../Services/ITI/ITIAllotment/itiallotment.service';
import { SearchModel } from '../../../Models/ITIAllotmentDataModel';

@Component({
  selector: 'app-allotment-status-iti',
  templateUrl: './allotment-status-iti.component.html',
  styleUrl: './allotment-status-iti.component.css',
  standalone: false
})
export class AllotmentStatusITIComponent {
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
  public request = new PreviewApplicationModel();
  public transactionStatusDataModel = new TransactionStatusDataModel();
  public isOnStatus = false;
  closeResult: string | undefined;
  captchaInput: string = '';
  captchaImageUrl: string = 'assets/images/captcha.jpg';

  constructor(private loaderService: LoaderService, private commonservice: CommonFunctionService,
    private studentService: StudentService, private modalService: NgbModal, private toastr: ToastrService, private documentDetailsService: DocumentDetailsService,
    private emitraPaymentService: EmitraPaymentService,
    private sweetAlert2: SweetAlert2, private formBuilder: FormBuilder,
    private appsettingConfig: AppsettingService,
    private itiallotmentStatusService: ITIAllotmentService, private reportService: ReportService, private http: HttpClient,
  ) { }

  async ngOnInit() {
    //this.searchRequest.ApplicationNo = "234234";
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetPublicInfoStatus();
  }
  async ResetControl() {
    this.searchRequest.ApplicationNo = '';
    this.searchRequest.DOB = '';
    this.AllotmentStatusList = [];
  }


  async GetPublicInfoStatus() {
    try {
      await this.commonservice.GetPublicInfoStatus(2)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.Data[0].IsOnAllotmentStatus == 1) {
            this.isOnStatus = true;
          } else {
            this.isOnStatus = false;
          }
          //IsOnKnowMerit, 1 IsOnAllotmentStatus, 1 IsOnUpwardMovement

        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {

      }, 200);
    }
  }



  refreshCaptcha() {
    
    // This function will change the CAPTCHA image URL (this can be used to trigger a new CAPTCHA)
    // You can append a query parameter like a timestamp to prevent the browser from caching the image
    this.captchaImageUrl = 'assets/images/captcha.jpg?timestamp=' + new Date().getTime();
  }

  async GetAllotmentStatusList() {
    
    this.isSubmitted = true

    try {
      this.loaderService.requestStarted();
      this.AllotmentStatusList = [];
      this.searchRequest.DepartmentId = 2;
      //this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      await this.itiallotmentStatusService.GetAllotmentStatusList(this.searchRequest)
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
    this.emitraRequest.DepartmentID = EnumDepartment.ITI;
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

  async DownloadAllotmentLetter(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.itiallotmentStatusService.GetAllotmentLetter(id)
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
            link.download = 'AllotmentLetter' + id + '.pdf';
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

  async GetAllotmentFeeReceipt(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.itiallotmentStatusService.GetAllotmentFeeReceipt(id)
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
            link.download = 'Allotment_fee_Receipt' + id + '.pdf';
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


}
