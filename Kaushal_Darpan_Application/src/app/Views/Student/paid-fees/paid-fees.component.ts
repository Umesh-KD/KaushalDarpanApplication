import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-paid-fees',
    templateUrl: './paid-fees.component.html',
    styleUrls: ['./paid-fees.component.css'],
    standalone: false
})
export class PaidFeesComponent implements OnInit
{

  public StudenetTranList: [] = [];

  public StatusFilter: number = 0;
  public PageTitle: string = '';


  public StudenetTranListItem: [] = [];
  searchRequest = new StudentSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();


  constructor(private loaderService: LoaderService, private emitraPaymentService: EmitraPaymentService, private activatedRoute: ActivatedRoute, private reportService: ReportService, private appsettingConfig: AppsettingService, private http: HttpClient, private toastrService: ToastrService,

    private routes: ActivatedRoute)
  {
   
  }

  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.StatusFilter = Number(this.routes.snapshot.queryParamMap?.get('filter') ?? 0);

    this.PageTitle = this.StatusFilter == 0 ? 'Pending Fee' : 'Paid Fee';


    await this.GetTransactionDetailsSemesterWise();
  }
  async GetTransactionDetailsSemesterWise()
  {
    this.loaderService.requestStarted();
    this.StudenetTranList = [];
    try
    {
     
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.TrasactionStatus = this.StatusFilter;
      this.searchRequest.action = this.sSOLoginDataModel.DepartmentID == EnumDepartment.BTER ? '_GetPaidTransactionList' : '_GetPaidTransactionListITI';
      await this.emitraPaymentService.GetTransactionDetailsActionWise(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success)
          {
            this.StudenetTranList = data['Data'];
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

  async GetTransactionItem(TranID: number)
  {
    this.loaderService.requestStarted();
    this.StudenetTranListItem = [];
    try
    {
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.TransactionId = TranID;
      this.searchRequest.action = '_GetTransactionItem';
      await this.emitraPaymentService.GetTransactionDetailsActionWise(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StudenetTranListItem = data['Data'];
          }
          else
          {
            this.toastrService.error(data.ErrorMessage);

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


  async FeeReceipt(item:any)
  {
    if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.ITI)
    {
      this.GetITIStudentFeeReceipt(item)
    }
    else if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.BTER)
    {
      this.GetStudentFeeReceipt(item)
    }
  }
  async GetITIStudentFeeReceipt(item: any)
  {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetITIStudentFeeReceipt(item.TransactionId)
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
  async GetStudentFeeReceipt(item: any)
  { 
    try
    {
      this.loaderService.requestStarted();
      await this.reportService.GetStudentFeeReceipt(item.TransactionId)
        .then((data: any) =>
        {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else
          {
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
  DownloadFile(FileName: string, DownloadfileName: any): void
  {
    
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
  generateFileName(extension: string): string
  {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }

}
