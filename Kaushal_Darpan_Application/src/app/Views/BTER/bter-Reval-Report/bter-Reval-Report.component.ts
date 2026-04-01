import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { RevaluationService } from '../../../Services/Revaluation/revaluation.service';
import { RevalationReportsearchModel } from '../../../Models/RevaluationModel';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bter-Reval-Report',
  templateUrl: './bter-Reval-Report.component.html',
  styleUrl: './bter-Reval-Report.component.css',
  standalone: false
})
export class bterRevalReportComponent {
  public Table_SearchText: string = "";
  public searchRevalationReport = new RevalationReportsearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public isLoading: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RevalationReportList: any = [];
  public _enumrole = EnumRole
  public TransId: number = 0;
  public DepartmentID: number = 0;
  public IsReval: boolean = false;
  public SemestarMasterDDLList: any[] = [];

  constructor(
    public appsettingConfig: AppsettingService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private revaluationService: RevaluationService) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetSemestarMatserDDL();
    await this.GetAllData();
  }
 
  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.searchRevalationReport.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRevalationReport.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRevalationReport.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRevalationReport.RoleID = this.sSOLoginDataModel.RoleID;

      await this.revaluationService.GetAllRevalationReportList(this.searchRevalationReport).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RevalationReportList = data.Data;
        console.log(this.RevalationReportList, "RevalationReportList")
      }, (error: any) => console.error(error))
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

  async GetSemestarMatserDDL() {
    try {
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SemestarMasterDDLList = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }
  async ClearSearchData() {
    this.searchRevalationReport = new RevalationReportsearchModel();
    this.RevalationReportList = [];
    await this.GetAllData();

  }

  async GetStudentRevalFeePaymentReceipt(TransactionId: any) {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetStudentRevalFeePaymentReceipt(TransactionId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.DownloadFile_RevalReceipt(data.Data);
          }
          else {
            this.toastrService.error(data.ErrorMessage)
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

  DownloadFile_RevalReceipt(FileName: string): void {
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = FileName;
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  exportToExcel(): void {

    if (!this.RevalationReportList || this.RevalationReportList.length === 0) {
      this.toastrService.warning("No data available to export.");
      return;
    }
    const unwantedColumns = [''];

    const columnOrder = [''];

    const filteredData = this.RevalationReportList.map((item: any) => {
      const row: any = {};
      columnOrder.forEach(col => {
        if (!unwantedColumns.includes(col)) {
          row[col] = item[col] ?? ''; // fallback if value missing
        }
      });

      return row;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `Inventory_Items_Report_${timestamp}.xlsx`);
  }
}
