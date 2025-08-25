import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { BterCertificateReportDataModel } from '../../../Models/BTER/BterCertificateReportDataModel';
import { MarksheetDownloadService } from '../../../Services/MarksheetDownload/marksheet-download.service';
import { MarksheetLetterSearchModel } from '../../../Models/MarksheetLetterDataModel';
import { CollegesWiseReportsModel } from '../../../Models/CollegesWiseReportsModel';
import { GetSessionalFailStudentReport } from '../../../Models/GenerateAdmitCardDataModel';

export interface requestData {
  Action: string;
  InstituteID: number;
  SemesterID: number;
  StreamID: number;
  EndTermID: number;
  DepartmentID: number;
  Eng_NonEng: number;
  ResultType: number;
}

@Component({
  selector: 'app-bter-result-reports',
  templateUrl: './bter-result-reports.component.html',
  styleUrls: ['./bter-result-reports.component.css'],
  standalone: false
})
export class BterResultReportsComponent implements OnInit {
  ReportsListData: any[] = [];
  StreamMasterList: any[] = [];
  displayedColumns: string[] = [];
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
    StreamID: 0,
    EndTermID: 0,
    DepartmentID: 0,
    Eng_NonEng: 0,
    ResultType: 0
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
    this.filterModel.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.filterModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

    this.loadMasterData();
  }

  loadMasterData(): void {
    this.commonMasterService.InstituteMaster(this.filterModel.DepartmentID, this.filterModel.Eng_NonEng, this.filterModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
      });

    this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      });

    
    this.commonMasterService.GetExamResultType().then((data: any) => {
      this.ResultTypeList = data['Data'] || [];
    });

    this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StreamMasterList = data.Data;
    })
   
    this.ReportTypelist = [
      { ID: 1, Name: 'Result Statistics Bridge Course Report', URL: 'result-statistics-bridge-course' },
      { ID: 2, Name: 'Result Statistics Report', URL: 'result-statistics' },
      { ID: 3, Name: 'Result Statistics Bridge Course Stream Wise Report', URL: 'result-statistics-bridge-course-stream-wise' },
      { ID: 4, Name: 'Passout Student Report', URL: 'passout-student-report' },
      { ID: 5, Name: 'Bridge Course Reports', URL: 'bridge-course-report' }, //   changess for vivek
      { ID: 6, Name: 'Branch Wise Statistical Reports', URL: 'branch-wise-statistical-reports' }, //   changess for vivek
      { ID: 7, Name: 'Mass Copping Reports', URL: 'mass-copping-report' },//   changess for vivek
      { ID: 8, Name: 'Sessional Fail Student Report', URL: 'sessional-fail-student-report' },//   changess for vivek
      { ID: 9, Name: 'Institute Student Report', URL: 'institute-student-report' },//   changess for vivek
      { ID: 10, Name: 'RMI Fail Student Report', URL: 'RMIFailStudentReport' },
      { ID: 11, Name: 'Theory Fail Student Report', URL: 'TheoryPaperFailStudent' },
      { ID: 12, Name: 'Student Examiner Detail Report', URL: 'StudentDetailsReport' },
      
    ];
  }
 
  onTypeChange(selectedType: string): void {
    this.filterModel.InstituteID = 0;
    this.filterModel.ResultType = 0;
    this.filterModel.SemesterID = 0;
    this.filterModel.StreamID = 0;
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
      StreamID: 0,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng
    };
    this.selectedType = '';
    this.ReportsListData = [];
    this.dataSource = new MatTableDataSource(this.ReportsListData);
    this.totalRecords = 0;
    this.displayedColumns = [];
    //this.GetAllData();
  }

  filterFormSubmit(): void {    
    if (this.filterModel.Action == "0") {
      this.toastrService.error('Please select Certificate Type');
      return;
    }
    this.GetAllData();
  }


  async GetAllData(): Promise<void> {
    this.ActionDynamic = this.filterModel.Action;
    this.ReportsListData = [];

    try {
      this.loaderService.requestStarted();
      let response: any = null;

      switch (this.ActionDynamic) {
        case "result-statistics-bridge-course":
          response = await this.reportService.ResultStatisticsBridgeCourse(this.filterModel);
          break;
        case "result-statistics":
          response = await this.reportService.ResultStatisticsReport(this.filterModel);
          break;
        case "result-statistics-bridge-course-stream-wise":
          response = await this.reportService.ResultStatisticsBridgeCourseStreamWise(this.filterModel);
          break;
        case "passout-student-report":
          response = await this.reportService.PassoutStudentReport(this.filterModel);
          break;
        case "bridge-course-report":
          response = await this.reportService.BterBridgeCoruseReportDownload(this.filterModel);
          break;
        case "branch-wise-statistical-reports":
          response = await this.reportService.GetBterBranchWiseStatisticalReport_new(this.filterModel);
          break;
        case "mass-copping-report":
          await this.GetAllMassCoppingReport();
          return;
        case "sessional-fail-student-report":
          await this.GetAllSessionalReport();
          return;
        case "RMIFailStudentReport":
          response = await this.reportService.GetRMIFailStudentReport(this.filterModel);
          break;
        case "TheoryFailStudentReport":
          response = await this.reportService.GetTheoryFailStudentReport(this.filterModel);
          break;
        case "institute-student-report":
          await this.GetAllInstituteStudentReportData();
          return;
        case "StudentDetailsReport":
          response = await this.reportService.GetStudentExaminerDetailReport(this.filterModel);
          return;
        default:
          this.toastrService.warning("Unknown report type selected.");
          return;
      }

      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        if (["bridge-course-report", "branch-wise-statistical-reports"].includes(this.ActionDynamic)) {
          this.downloadBase64PDF(data.Data, this.getReportFileName(this.ActionDynamic));
        } else {
          this.DownloadFile(data.Data);
        }
      } else {
        this.toastrService.warning(data.ErrorMessage);
        this.dataSource = new MatTableDataSource();
      }

    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  getReportFileName(action: string): string {
    switch (action) {
      case 'bridge-course-report':
        return 'Bridge_Course_Report.pdf';
      case 'branch-wise-statistical-reports':
        return 'Branch_Wise_Statistical_Report.pdf';
      case 'result-statistics-report':
        return 'Result_Statistics_Report.pdf';
      case 'sessional-fail-student-report':
        return 'Sessional_Fail_Student_Report.pdf';
      case 'mass-copping-report':
        return 'Mass_Copping_Report.pdf';
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


  async GetAllMassCoppingReport(): Promise<void> {
    this.ActionDynamic = this.filterModel.Action;
    this.ReportsListData = [];

    try {
      this.loaderService.requestStarted();
      const response = await this.reportService.GetBterMassCopingReport(this.filterModel);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.ReportsListData = data.Data;
        this.exportToExcel();
      } else {
        this.dataSource = new MatTableDataSource();
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }
 
  exportToExcelSessional() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.SessionalStudentFailReportList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const fileName = `Sessional_Student_Fail_Report_Class.xlsx`;
    XLSX.writeFile(wb, fileName);
  }


  async GetAllSessionalReport() {
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = 2;
      this.searchRequest.SemesterID = 1;

      this.loaderService.requestStarted();
      await this.reportService.GetSessionalFailStudentReport(this.searchRequest).then((response: any) => {
        const data = JSON.parse(JSON.stringify(response));
        this.SessionalStudentFailReportList = data.Data;
        
        this.exportToExcelSessional();
        if (this.SessionalStudentFailReportList.length > 0) {
          const firstRecord = this.SessionalStudentFailReportList[0];

          const fixedColumns = ['StudentName', 'RollNo', 'EnrollmentNo', 'InstituteCode'];

          const dynamicColumns = Object.keys(firstRecord).filter(
            key => !fixedColumns.includes(key)
          );

          this.displayedColumns = ['SNo', ...fixedColumns, ...dynamicColumns];
        }

      }, (error: any) => console.error(error));
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

  async GetAllInstituteStudentReportData() {
   
    let requestData: any = {
      AcademicYearID: this.ssoLoginUser.FinancialYearID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID,
      EndTermID: this.ssoLoginUser.EndTermID
    }
    //debugger;
    this.CollegesWiseReportsModellList = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetInstituteStudentReport(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.CollegesWiseReportsModellList = data['Data'];
            this.exportToExcelInstitute();
            this.buildDynamicColumns();
            this.dataSource = new MatTableDataSource(this.CollegesWiseReportsModellList);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.CollegesWiseReportsModellList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
            console.log('CollegesWiseReportsModellList ===>',this.CollegesWiseReportsModellList)
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
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
  
}
