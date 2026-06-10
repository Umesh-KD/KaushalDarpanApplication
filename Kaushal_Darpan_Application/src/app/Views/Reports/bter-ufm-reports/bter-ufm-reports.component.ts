import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumResultType, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { BterCertificateReportDataModel } from '../../../Models/BTER/BterCertificateReportDataModel';
import { MarksheetDownloadService } from '../../../Services/MarksheetDownload/marksheet-download.service';
import { MarksheetLetterSearchModel } from '../../../Models/MarksheetLetterDataModel';
import { CollegesWiseReportsModel } from '../../../Models/CollegesWiseReportsModel';
import { ExamResultStudentStaticsModel, ExamWiseStreamPapersReportModelModel, GetSessionalFailStudentReport, StudentAllMarksReportModel } from '../../../Models/GenerateAdmitCardDataModel';
import { EndTermFinYearModel } from '../../../Models/CommonMasterDataModel';

export interface requestData {
  Action: string;
  InstituteID: number;
  SemesterID: number;
 // StreamID: number;
  EndTermID: number;
  DepartmentID: number;
  Eng_NonEng: number;
  ResultType: number;
  FinancialYearID: number;
}

@Component({
  selector: 'app-bter-ufm-reports',
  templateUrl: './bter-ufm-reports.component.html',
  styleUrls: ['./bter-ufm-reports.component.css'],
  standalone: false
})
export class BterUFMReportsComponent implements OnInit {
  ReportsListData: any[] = [];
  StreamMasterList: any[] = [];
  displayedColumns: string[] = [];
  public FinancialYearList: any = []
  columnSchema: Array<{ key: string; label: string; isAction?: boolean; isDate?: boolean }> = [];

  dataSource = new MatTableDataSource<any>();
  sSOLoginDataModel: any;
  InstituteMasterList: any;
  SemesterMasterList: any;
  selectedType: string = '';
  ReportTypelist: any;
  ResultTypeList: any;

  filterModel: requestData = {
    Action: "0",
    InstituteID: 0,
    SemesterID: 0,
   // StreamID: 0,
    EndTermID: 0,
    DepartmentID: 0,
    Eng_NonEng: 0,
    ResultType: 0,
    FinancialYearID:0
  };

  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;
  startInTableIndex = 1;
  endInTableIndex = 10;

  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  Table_SearchText = '';
  ActionDynamic: string = '';
  public searchRequest = new BterCertificateReportDataModel();
  public searchRequestt = new MarksheetLetterSearchModel();
  public isSubmitted: boolean = false;
  selectedReport: any = null;
  public CollegesWiseReportsModellList: CollegesWiseReportsModel[] = [];
  public SessionalStudentFailReportList: GetSessionalFailStudentReport[] = [];
  public ExamResultStudentStaticsList: ExamResultStudentStaticsModel[] = [];
  public SubjectTheoryParcticalMarkStaticsList: ExamResultStudentStaticsModel[] = [];
  public ExamWiseStreamPapersrList: ExamWiseStreamPapersReportModelModel[] = [];
  public StudentAllMarksReport: StudentAllMarksReportModel[] = [];

  public endTermFinYear: EndTermFinYearModel[] = [];
  public _EnumResultType = EnumResultType;



  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(
    private loaderService: LoaderService,
    private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private toastrService: ToastrService,
    private toastr: ToastrService,
    private marksheetDownloadService: MarksheetDownloadService
  ) { }

  ngOnInit(): void {
    this.sSOLoginDataModel = this.ssoLoginUser;
    this.filterModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.filterModel.EndTermID = 0;
    this.filterModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

    this.loadMasterData();
  }

  async loadMasterData() {
    //await this.commonMasterService.InstituteMaster(this.filterModel.DepartmentID, this.filterModel.Eng_NonEng, this.filterModel.EndTermID)
    //  .then((data: any) => {
    //    this.InstituteMasterList = data['Data'];
    //  });

    await this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      });

    await this.commonMasterService.GetFinancialYear()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.FinancialYearList = data['Data'];
      }, (error: any) => console.error(error));

    this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StreamMasterList = data.Data;
    })

    this.ReportTypelist = [
      { ID: 1, Name: 'UFM Student Order', URL: 'ufm-student-Report' },
      { ID: 2, Name: 'CollegWise UFM Statistics', URL: 'collegwise-ufm-report' },     
    ];
  }

  onTypeChange(selectedType: string): void {
    this.filterModel.InstituteID = 0;
    this.filterModel.ResultType = 0;
    this.filterModel.SemesterID = 0;
    this.selectedType = selectedType;
    this.ReportsListData = [];
    this.dataSource = new MatTableDataSource(this.ReportsListData);
    this.totalRecords = 0;
    this.displayedColumns = [];
  }

  resetForm(): void {
    this.filterModel = {
      Action: "0",
      InstituteID: 0,
      ResultType: 0,
      SemesterID: 0,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      FinancialYearID:0
    };
    this.selectedType = '';
    this.ReportsListData = [];
    this.dataSource = new MatTableDataSource(this.ReportsListData);
    this.totalRecords = 0;
    this.displayedColumns = [];
    //this.GetAllData();
  }

  async filterFormSubmit() {
    if (this.filterModel.Action == "0") {
      this.toastrService.error('Please select Certificate Type');
      return;
    }
    await this.GetAllData();
  }


  async GetAllData(): Promise<void> {
    debugger
    this.ActionDynamic = this.filterModel.Action;
    this.ReportsListData = [];
    debugger
    try {
      let response: any = null;
      switch (this.ActionDynamic) {
        case "ufm-student-Report":
          response = await this.reportService.UFMCategoryReportPdf_BTER(this.filterModel);
          break;
        case "collegwise-ufm-report":
          response = await this.reportService.UFM_Collegwise_CategoryReportPdf_BTER(this.filterModel);
          break;       
        //case "Appeared-Passesd-Statistics":
        //  response = await this.reportService.AppearedPassedStatisticsReportDownload(this.filterModel);
        //  return;

        default:
          this.toastrService.warning("Unknown report type selected.");
          return;
      }
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        if (["ufm-student-Report", "collegwise-ufm-report"].includes(this.ActionDynamic)) {
          this.downloadBase64PDF(data.Data, this.getReportFileName(this.ActionDynamic));
        } else {
          this.DownloadFile(data.Data);
        }
      } else {
        this.toastrService.warning(data.Message);
        this.dataSource = new MatTableDataSource();
      }

    } catch (ex) {
      console.error(ex);
    }
  }


  getReportFileName(action: string): string {
    switch (action) {
      case 'ufm-student-Report':
        return 'UFM_Student_Order.pdf';
      case 'collegwise-ufm-report':
        return 'CollegWise_UFM_Statitics_Report.pdf';
      default:
        return 'Downloaded_Report.pdf';
    }
  }

  DownloadFile(fileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${fileName}`;

    this.http.get(fileUrl, { responseType: 'blob', observe: 'response' }).subscribe(response => {
      const blob = response.body as Blob;
      // Try to get filename from Content-Disposition header (optional)
      const contentDisposition = response.headers.get('Content-Disposition');
      let actualFileName = fileName; // Default to filename from server response
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          actualFileName = match[1].replace(/['"]/g, '');
        }
      }

      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = actualFileName;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }


  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  downloadBase64PDF(base64Data: string, fileName: string): void {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  exportToExcel(): void {
    const filteredData = this.ReportsListData.map(({ StudentID, ...rest }) => rest);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${this.filterModel.Action}.xlsx`);
  }

  buildDynamicColumns(): void {
    if (!this.CollegesWiseReportsModellList.length) return;

    const sampleItem = this.CollegesWiseReportsModellList[0];
    const columnKeys = Object.keys(sampleItem);

    this.columnSchema = columnKeys.map(key => ({
      key,
      label: this.formatColumnLabel(key),
      isDate: key.toLowerCase().includes('date')
    }));

    this.displayedColumns = this.columnSchema.map(col => col.key);
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (startIndex >= this.totalRecords) {
      this.currentPage = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    }
    const adjustedEndIndex = Math.min(endIndex, this.totalRecords);
    this.dataSource.data = this.CollegesWiseReportsModellList.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }

  formatColumnLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  exportToExcelInstitute() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.CollegesWiseReportsModellList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Institute Report');

    const fileName = `Institute_Student_Report.xlsx`;
    XLSX.writeFile(wb, fileName);
  }


  async GetEffectiveFinYear() {
    debugger
    this.filterModel.EndTermID = 0;
    this.endTermFinYear = [];

    try {
      await this.commonMasterService.GetFinYearWiseEndterm(this.filterModel.FinancialYearID)
          .then((data: any) => {
            this.endTermFinYear = data['Data'] || [];
          }, (error: any) => console.error(error));
      }
      catch (Ex) {
        console.log(Ex);
      }
  }
}
