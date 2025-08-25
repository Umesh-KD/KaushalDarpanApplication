import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ApplicationMessageDataModel } from '../../../Models/ApplicationMessageDataModel';
import { EnumDepartment, EnumMessageType, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';

@Component({
  selector: 'app-college-payment-status',
  standalone: false,
  templateUrl: './college-payment-status.component.html',
  styleUrl: './college-payment-status.component.css'
})

export class CollegePaymentStatusComponent {
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
  public CollegeId: string = '';
  public UDF2_PURPOSE: string = '';
  public TransctionDate: string = '';
  public DepartmentID: number = 0;
  public TransId: number = 0;
  public MobileNumber: string = '';
  public _EnumDepartment = EnumDepartment;
  public messageModel = new ApplicationMessageDataModel()
  public InstituteName: string = '';

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
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.PRNNo = this.router.snapshot.queryParamMap.get('TransID')?.toString();
    await this.GetEmitraCollegeTransactionDetails();

  }

  async GetEmitraCollegeTransactionDetails() {
    try {
      this.loaderService.requestStarted();
      await this.emitraPaymentService.GetEmitraCollegeTransactionDetails(this.PRNNo)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.Amount = data['Data'][0]['TransAmt'];
          this.CollegeId = data['Data'][0]['CollegeId'];
          this.PaymentStatus = data['Data'][0]['TransctionStatus'];
          this.TransactionID = data['Data'][0]['PRN'];
          this.TransctionMSG = data['Data'][0]['TransctionMSG'];
          this.TransctionDate = data['Data'][0]['TransctionDate'];
          this.TransId = data['Data'][0]['TransactionId'];
          this.DepartmentID = data['Data'][0]['DeparmentID'];
          this.MobileNumber = data['Data'][0]['MobileNumber'];
          this.InstituteName = data['Data'][0]['InstituteName'];

          console.log("departmentID", this.DepartmentID)

          //if (this.PaymentStatus == "SUCCESS") {
          //  this.SendApplicationMessage();
          //  //this.sSOLoginDataModel.ApplicationFinalSubmit = 2
          //  this.sSOLoginDataModel.InstituteID = data['Data'];
          //  localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));

          //}
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
      this.messageModel.MobileNo = this.MobileNumber;
      // department      
      this.messageModel.MessageType = EnumMessageType.FormFinalSubmitITI;
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
  }



  async GetCollegePaymentFeeReceipt() {
    try {
      await this.reportService.GetCollegePaymentFeeReceipt(this.TransId)
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

  redirectApplication() {
    this.route.navigate(['/updatecollegemaster']);
  }
}
