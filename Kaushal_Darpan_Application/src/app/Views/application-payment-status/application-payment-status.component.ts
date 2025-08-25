import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnumDepartment, EnumMessageType, EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { EmitraPaymentService } from '../../Services/EmitraPayment/emitra-payment.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ReportService } from '../../Services/Report/report.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { ApplicationMessageDataModel } from '../../Models/ApplicationMessageDataModel';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';
import { BTERAllotmentService } from '../../Services/BTER/Allotment/allotment.service';

@Component({
  selector: 'app-application-payment-status',
  templateUrl: './application-payment-status.component.html',
  styleUrls: ['./application-payment-status.component.css'],
  standalone: false
})
export class ApplicationPaymentStatusComponent {
  public State: number = -1;
  public SuccessMessage: any = [];
  public ErrorMessage: any = [];

  public PRNNo?: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  public TransactionID: string = '';
  public Amount: string = '';
  public TransctionMSG: string = '';
  public PaymentStatus: string = '';
  public PaymentModeBID: string = '';
  public ApplicationId: string = '';
  public ApplicationNo: string = '';
  public UDF2_PURPOSE: string = '';
  public TransctionDate: string = '';
  public DepartmentID: number = 0;
  public TransId: number = 0;
  public MobileNumber: string = '';
  public Feefor: string = '';
  public _EnumDepartment = EnumDepartment;
  public messageModel = new ApplicationMessageDataModel()
  public Message: string = '';

  constructor(
    private router: ActivatedRoute,
    private emitraPaymentService: EmitraPaymentService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private toastrService: ToastrService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private route: Router,
    private smsMailService: SMSMailService,
    private toastr: ToastrService,
    private bterAllotmentService: BTERAllotmentService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.PRNNo = this.router.snapshot.queryParamMap.get('TransID')?.toString();
    await this.GetEmitraApplicationTransactionDetails();

  }

  async GetEmitraApplicationTransactionDetails() {
    try {
      this.loaderService.requestStarted();
      await this.emitraPaymentService.GetEmitraApplicationTransactionDetails(this.PRNNo)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.Amount = data['Data'][0]['TransAmt'];
          this.ApplicationNo = data['Data'][0]['ApplicationNo'];
          this.ApplicationId = data['Data'][0]['ApplicationId'];
          this.PaymentStatus = data['Data'][0]['TransctionStatus'];
          this.TransactionID = data['Data'][0]['PRN'];
          this.TransctionMSG = data['Data'][0]['TransctionMSG'];
          this.TransctionDate = data['Data'][0]['TransctionDate'];
          this.TransId = data['Data'][0]['TransactionId'];
          this.DepartmentID = data['Data'][0]['DeparmentID'];
          this.MobileNumber = data['Data'][0]['MobileNo'];
          this.Feefor = data['Data'][0]['FeeFor'];
          console.log("departmentID", this.DepartmentID)

          if (this.PaymentStatus == "SUCCESS") {
            this.SendApplicationMessage();
            //send SMS CODE 
            //if (this.sSOLoginDataModel?.ApplicationFinalSubmit != 2)
            //{

            //}
            this.sSOLoginDataModel.ApplicationFinalSubmit = 2
            this.sSOLoginDataModel.ApplicationID = data['Data'];
            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));

          }
        },
          (error: any) => console.error(error));
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

  async SendApplicationMessage() {
    try {
      this.loaderService.requestStarted();
      this.messageModel.MobileNo = this.MobileNumber;
      // department
      if (this.DepartmentID == EnumDepartment.BTER) {
        this.messageModel.MessageType = EnumMessageType.Bter_FormFinalSubmit;
      }
      else if (this.DepartmentID == EnumDepartment.ITI) {
        this.messageModel.MessageType = EnumMessageType.FormFinalSubmitITI;
      }
      this.messageModel.ApplicationNo = this.ApplicationNo.toString();
      await this.smsMailService.SendApplicationMessage(this.messageModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            console.log('Message sent successfully', data);
          } else {
            console.log('Something went wrong', data);
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async FeeReceipt() {

    if (this.DepartmentID == EnumDepartment.ITI) {
      this.GetITIStudentFeeReceipt()
    }
    else if (this.DepartmentID == EnumDepartment.BTER) {
      if (this.Feefor = "Allotment") {
        this.DownloadAllotmentLetterFeeRpt(this.ApplicationId)
      }
      else {
        this.GetStudentFeeReceipt()
      }
      
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

  async GetITIStudentFeeReceipt() {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetITIStudentApplicationFeeReceipt(this.TransId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastrService.error(data.ErrorMessage)
            //    data.ErrorMessage
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
//GetStudentApplicationFeeReceipt
  async GetStudentFeeReceipt() {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetStudentApplicationFeeReceipt(this.TransId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastrService.error(data.ErrorMessage)
            //    data.ErrorMessage
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

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }

  redirectApplication(item: any, action: number) {

    this.sSOLoginDataModel.Eng_NonEng = item.CourseType;
    if (item.CourseType == 1) {
      this.sSOLoginDataModel.Eng_NonEngName = 'Diploma 1st Year Eng';
    }
    if (item.CourseType == 2) {
      this.sSOLoginDataModel.Eng_NonEngName = 'Diploma Non-Engineering 1stYear';
    }
    if (item.CourseType == 3) {
      this.sSOLoginDataModel.Eng_NonEngName = 'Diploma 2nd Year Eng Lateral Admission';
    }


    this.sSOLoginDataModel.Mobileno = item.MobileNo;
    this.sSOLoginDataModel.DepartmentID = 1;
    this.ApplicationId = item.ApplicationID;

    //set user session 
    localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
    //set cookie


    this.route.navigate(['/DTEApplicationform']);
  }
}
