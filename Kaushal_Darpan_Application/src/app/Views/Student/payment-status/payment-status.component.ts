import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';


@Component({
    selector: 'app-payment-status',
    templateUrl: './payment-status.component.html',
    styleUrls: ['./payment-status.component.css'],
    standalone: false
})
export class PaymentStatusComponent implements OnInit {
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
  public UDF2_PURPOSE: string = '';
  public TransctionDate: string = '';
  public TransId: number = 0;
  public DepartmentID: number = 0;
  constructor(private router: ActivatedRoute,
    private emitraPaymentService: EmitraPaymentService,
    private loaderService: LoaderService, private reportService: ReportService,
    private toastrService: ToastrService, private appsettingConfig: AppsettingService,
    private http: HttpClient) { }

  async ngOnInit()
  {
    this.PRNNo = this.router.snapshot.queryParamMap.get('TransID')?.toString();
    console.log(this.PRNNo);
    await this.GetEmitraTransactionDetails();
  }

  async GetEmitraTransactionDetails()
  {
    ;
    try {
      this.loaderService.requestStarted();
      await this.emitraPaymentService.GetEmitraTransactionDetails(this.PRNNo)
        .then((data: any) =>
        {
          ;
          data = JSON.parse(JSON.stringify(data));
          console.log(data,"datatatata");
          this.Amount = data['Data'][0]['TransAmt'];
          this.PaymentStatus = data['Data'][0]['TransctionStatus'];
          this.TransactionID = data['Data'][0]['PRN'];
          this.TransctionMSG = data['Data'][0]['TransctionMSG'];
          this.TransctionDate = data['Data'][0]['TransctionDate'];
          this.TransId = data['Data'][0]['TransactionId'];
          this.DepartmentID = data['Data'][0]['DepartmentID'];
  
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

  async FeeReceipt() {
    
    if (this.DepartmentID == EnumDepartment.ITI) {
      this.GetITIStudentFeeReceipt()
    }
    else if (this.DepartmentID == EnumDepartment.BTER) {
      this.GetStudentFeeReceipt()
    }
  }

  async GetITIStudentFeeReceipt() {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetITIStudentFeeReceipt(this.TransId)
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

  async GetStudentFeeReceipt() {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetStudentFeeReceipt(this.TransId)
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

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
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


}
