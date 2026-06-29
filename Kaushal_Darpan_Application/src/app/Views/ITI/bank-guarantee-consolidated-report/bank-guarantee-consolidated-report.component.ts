import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { AppsettingService } from '../../../Common/appsetting.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-bank-guarantee-consolidated-report',
  standalone: false,
  templateUrl: './bank-guarantee-consolidated-report.component.html',
  styleUrl: './bank-guarantee-consolidated-report.component.css'
})
export class BankGuaranteeConsolidatedReportComponent {
reportList: any[] = [];

searchRequest: any = {
  id: 0,
  action: '_getAllData',
  financialYearID: 0,
  status :0
};

FinancialYearList: any[] = [];
CollegeList: any[] = [];

 constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ApplicationService: ITIsService,
    private toastr: ToastrService,
     private appsettingConfig: AppsettingService,
    private swat: SweetAlert2,
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient,
    private campusPostService: ITIsService
  ) { }
async ngOnInit() {

  // await this.GetFinancialYearDDL();

   await this.GetPrivateITICollege();

  await this.GetBankGuaranteeConsolidatedReport();

}

async GetBankGuaranteeConsolidatedReport() {

  try {

   this.loaderService.requestStarted();

    const response: any =
      await this.ApplicationService.GetBankGuaranteeConsolidatedReport(
        this.searchRequest
      );

    if (response.State === 0 || response.State === 1) {

      this.reportList = response.Data || [];

    }
    else {

      this.reportList = [];

      this.toastr.warning(response.Message);

    }

  }
  catch (error) {

    console.error(error);

    this.toastr.error('Something went wrong');

  }
  finally {

     setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);

  }

}

ResetFilters() {

  this.searchRequest = {
    id: 0,
    action: '_getAllData',
    financialYearID: 0
  };

  this.GetBankGuaranteeConsolidatedReport();

}

public AllCompanyMasterList: any[] = [];
  async GetPrivateITICollege() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService
        .GetCommonMasterData('PrivateITICollege', 5)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.AllCompanyMasterList = data['Data'];
          this.CollegeList = this.AllCompanyMasterList;

          //this.CollegeID = 0; //  default select
          //this.request.CollageId = 0;
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  exportToExcel(): void {

    const exportData = this.reportList.map((row: any, index: number) => ({
      'S.No.': index + 1,
      'College Name': row.CollegeName,
      'Number Of Unit': row.NumberOfUnit,
      'Bank Guarantee Required': row.AmountRequired,
      'Bank Guarantee Available': row.AmountAvailable,
      'Due Amount': row.AmountDifference,
      'Status': row.BankStatus,
      'Writ No': row.WritNo
        ? `${row.WritNo}${row.WritNoDate ? ' - ' + row.WritNoDate : ''}`
        : ''
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Bank Guarantee Report');

    // Current Date & Time for file name (DDMMYYYY_HHMMSS)
    const now = new Date();

    const date =
      String(now.getDate()).padStart(2, '0') +
      String(now.getMonth() + 1).padStart(2, '0') +
      now.getFullYear();

    const time =
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    const fileName = `BankGuaranteeConsolidatedReport_${date}_${time}.xlsx`;

    XLSX.writeFile(wb, fileName);
  }
}
