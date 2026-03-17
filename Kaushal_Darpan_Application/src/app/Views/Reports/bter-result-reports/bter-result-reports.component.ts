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
import { ExamResultStudentStaticsModel, ExamWiseStreamPapersReportModelModel, GetSessionalFailStudentReport } from '../../../Models/GenerateAdmitCardDataModel';

export interface requestData {
  Action: string;
  InstituteID: number;
  SemesterID: number;
  StreamID: number;
  EndTermID: number;
  DepartmentID: number;
  Eng_NonEng: number;
  ResultType: number;
  SchemeID: number;
  FileNo1: string;
  FileNo2: string;
  FileDate: any;
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
    ResultType: 0,
    SchemeID: 0,
    FileNo1: '',
    FileNo2: '',
    FileDate: null
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
      { ID: 5, Name: 'Bridge Course Reports', URL: 'bridge-course-report' },
      { ID: 6, Name: 'Branch Wise Statistical Reports', URL: 'branch-wise-statistical-reports' },
      { ID: 7, Name: 'Mass Copping Reports', URL: 'mass-copping-report' },
      { ID: 8, Name: 'Sessional Fail Student Report', URL: 'sessional-fail-student-report' },
      { ID: 9, Name: 'Institute Student Report', URL: 'institute-student-report' },
      { ID: 10, Name: 'RMI Fail Student Report', URL: 'RMIFailStudentReport' },
      { ID: 11, Name: 'Theory Fail Student Report', URL: 'TheoryPaperFailStudent' },
      { ID: 12, Name: 'Student Examiner Detail Report', URL: 'StudentDetailsReport' },
      { ID: 13, Name: 'Appeared/Passed Statistics Report', URL: 'Appeared-Passesd-Statistics'},
      { ID: 14, Name: 'Appeared/Passed Statistics Institute wise Report', URL: 'Appeared-Passesd-Statistics-Institute-wise' },
      // vivek
      { ID: 15, Name: 'Exam Result Student Statics Report', URL: 'Exam-Result-Student-Statics-report' },
      { ID: 15, Name: 'Subject Theory Practical Mark Statics', URL: 'Subject-Theory-Parctical-Mark-Statics-report' },
      { ID: 16, Name: 'Result Sheet', URL: 'Result-Appeared-Passed-Statistics-Report' },
      { ID: 17, Name: 'Exam Wise Stream Papers Report', URL: 'ExamWise-Stream-Papers-Report' },
    ];
  }
 
  onTypeChange(selectedType: string): void {
    this.filterModel.InstituteID = 0;
    this.filterModel.ResultType = 0;
    this.filterModel.SemesterID = 0;
    this.filterModel.StreamID = 0;
    this.filterModel.SchemeID = 0;
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
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      SchemeID: 0,
      FileNo1:'',
      FileNo2: '',
      FileDate: null
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
    this.ActionDynamic = this.filterModel.Action;
    this.ReportsListData = [];

    try {
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
          break;
        case "sessional-fail-student-report":
          await this.GetAllSessionalReport();
          break;
        case "RMIFailStudentReport":
          response = await this.reportService.GetRMIFailStudentReport(this.filterModel);
          break;
        case "TheoryFailStudentReport":
          response = await this.reportService.GetTheoryFailStudentReport(this.filterModel);
          break;
        case "institute-student-report":
          await this.GetAllInstituteStudentReportData();
          break;
        case "StudentDetailsReport":
          response = await this.reportService.GetStudentExaminerDetailReport(this.filterModel);
          break;
        case "Appeared-Passesd-Statistics":
          response = await this.reportService.DownloadAppearedPassed(this.filterModel);
          break;
        case "Appeared-Passesd-Statistics-Institute-wise":
          response = await this.reportService.DownloadAppearedPassedInstitutewise(this.filterModel);
          break;
          // vivek 
        case "Exam-Result-Student-Statics-report":
          await this.GetExamResultStudentStaticsReport();
          break;
        case "Subject-Theory-Parctical-Mark-Statics-report":
          await this.GetSubjectTheoryParcticalMarkStaticsReport();
          break;

        case "Result-Appeared-Passed-Statistics-Report":
          await this.getResultAppearedPassedStatisticsReport();
          break;
        case "ExamWise-Stream-Papers-Report":
          await this.GetExamWiseStreamPapersreport();
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
      EndTermID: this.ssoLoginUser.EndTermID,

    }
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



  async GetExamResultStudentStaticsReport() {
    let request: any = {

      streamID: this.filterModel.StreamID,
      SemesterID: this.filterModel.SemesterID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      //Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng, 
      EndTermID: this.ssoLoginUser.EndTermID
    }
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetExamResultStudentStaticsReport(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.ExamResultStudentStaticsList = data['Data'];
            this.exportToExcelExamResultStudentStaticsReport();
            this.dataSource = new MatTableDataSource(this.ExamResultStudentStaticsList);
           
            console.log('ExamResultStudentStaticsReport ===>', this.ExamResultStudentStaticsList)
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  exportToExcelExamResultStudentStaticsReport(): void {
    const wantedColumns =
      ['SrNo', 'EnrollmentNo', 'Division', 'DiplomaFinalResult', 'EndTermSem1', 'EndTermSem2', 'EndTermSem3', 'EndTermSem4', 'EndTermSem5', 'EndTermSem6', 'EarnedCreditsSem1',
 'EarnedCreditsSem2', 'EarnedCreditsSem3', 'EarnedCreditsSem4', 'EarnedCreditsSem5', 'EarnedCreditsSem6', 'PointsSecuredSem1', 'PointsSecuredSem2', 'PointsSecuredSem3', 'PointsSecuredSem4',
 'PointsSecuredSem5', 'PointsSecuredSem6', 'GradePointSem1', 'GradePointSem2', 'GradePointSem3', 'GradePointSem4', 'GradePointSem5', 'GradePointSem6', 'SGPASem1', 'SGPASem2',
 'SGPASem3', 'SGPASem4', 'SGPASem5', 'SGPASem6', 'CGPASem1', 'CGPASem2', 'CGPASem3', 'CGPASem4', 'CGPASem5', 'CGPASem6', 'ResultSem1', 'ResultSem2', 'ResultSem3', 'ResultSem4', 'ResultSem5', 'ResultSem6'
 ];

    const exportData = this.ExamResultStudentStaticsList.map((row: any, index: number) => {
      const filteredRow: any = {};
      wantedColumns.forEach(col => {
        filteredRow[col] = col === 'SrNo' ? index + 1 : row[col];
      });
      return filteredRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const colWidths = wantedColumns.map(col => {
      const maxLength = Math.max(
        col.length,
        ...exportData.map(row =>
          row[col] ? row[col].toString().length : 0
        )
      );
      return { wch: maxLength + 2 };
    });
    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Exam Result Student');
    const todayDate = new Date().toISOString().split('T')[0];

    const fileName = `Exam_Result_Student_Statics_report_${todayDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  async GetSubjectTheoryParcticalMarkStaticsReport() {
    let request: any = {

      streamID: this.filterModel.StreamID,
      SemesterID: this.filterModel.SemesterID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      //Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng, 
      EndTermID: this.ssoLoginUser.EndTermID
    }
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetSubjectTheoryParcticalMarkStaticsReport(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.SubjectTheoryParcticalMarkStaticsList = data['Data'];
            this.exportToExcelExamSubjectTheoryParcticalMarkStaticsReport();
            this.dataSource = new MatTableDataSource(this.SubjectTheoryParcticalMarkStaticsList);

            console.log('ExamResultStudentStaticsReport ===>', this.SubjectTheoryParcticalMarkStaticsList)
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  exportToExcelExamSubjectTheoryParcticalMarkStaticsReport(): void {
    const wantedColumns =
      ['SrNo', 'InstituteNameEnglish', 'StudentType', 'semesterid', 'enrollmentno', 'rollno', 'StreamName', 'SubjectCode', 'studentname', 'TheoryMarks', 'PracticalMarks', 'IAMarks',
        'SCAgrade', 'PreseTheor', 'ATM', 'RMI', 'Grade', 'GradePoint', 'SubjectCredits', 'EarnedCredits', 'PointsSecured'

      ];

    const exportData = this.SubjectTheoryParcticalMarkStaticsList.map((row: any, index: number) => {
      const filteredRow: any = {};
      wantedColumns.forEach(col => {
        filteredRow[col] = col === 'SrNo' ? index + 1 : row[col];
      });
      return filteredRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const colWidths = wantedColumns.map(col => {
      const maxLength = Math.max(
        col.length,
        ...exportData.map(row =>
          row[col] ? row[col].toString().length : 0
        )
      );
      return { wch: maxLength + 2 };
    });
    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Subject Theory Parctical Mark');
    const todayDate = new Date().toISOString().split('T')[0];

    const fileName = `Subject_Theory_Parctical_Mark_Statics_report_${todayDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  async getResultAppearedPassedStatisticsReport() {

    //debugger
    let request: any = {
      streamID: this.filterModel.StreamID,
      SemesterID: this.filterModel.SemesterID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      EndTermID: this.ssoLoginUser.EndTermID,
      SchemeID: this.filterModel.SchemeID,
      FileNo1: this.filterModel.FileNo1,
      FileNo2: this.filterModel.FileNo2,
      FileDate: this.filterModel.FileDate  
    }

    this.reportService.getResultAppearedPassedStatisticsReport(request)
      .subscribe({
        next: (blob: Blob) => {
          const now = new Date();
          const dateTime =
            now.getFullYear().toString() +
            ('0' + (now.getMonth() + 1)).slice(-2) +
            ('0' + now.getDate()).slice(-2) + '_' +
            ('0' + now.getHours()).slice(-2) +
            ('0' + now.getMinutes()).slice(-2);
          const fileName = `Result_Appeared_Passed_Statistics_Report_${dateTime}.pdf`;

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();

          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to download report');
        }
      });
  }



  async GetExamWiseStreamPapersreport() {
    //debugger;
    let request: any = {
      EndTermID: this.ssoLoginUser.EndTermID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      CourseTypeID: this.ssoLoginUser.Eng_NonEng,
      streamID: this.filterModel.StreamID,
      SemesterID: this.filterModel.SemesterID,
      SchemeID: this.filterModel.SchemeID,
      FileNo1: this.filterModel.FileNo1,
      FileNo2: this.filterModel.FileNo2,
      FileDate: this.filterModel.FileDate      
    }
    try {
      await this.reportService.GetExamWiseStreamPapersreport(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.ExamWiseStreamPapersrList = data['Data'];
            this.exportToExcelExamWiseStreamPapersReport();
            this.dataSource = new MatTableDataSource(this.ExamWiseStreamPapersrList);

            console.log('ExamWiseStreamPapersReport ===>', this.ExamWiseStreamPapersrList)
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } 
  }

  exportToExcelExamWiseStreamPapersReport(): void {
    const wantedColumns =
      ['SrNo', 'SubjectCode', 'SemesterID','StreamSubjectcode','SubjectName','Credit','StreamName','StreamCode','AvMax','AvMaxi_Org','AvMaxi','PMax','XMaxi','Q','N_Student','N_Student_Paper' ];

    const exportData = this.ExamWiseStreamPapersrList.map((row: any, index: number) => {
      const filteredRow: any = {};
      wantedColumns.forEach(col => {
        filteredRow[col] = col === 'SrNo' ? index + 1 : row[col];
      });
      return filteredRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const colWidths = wantedColumns.map(col => {
      const maxLength = Math.max(
        col.length,
        ...exportData.map(row =>
          row[col] ? row[col].toString().length : 0
        )
      );
      return { wch: maxLength + 2 };
    });
    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Exam Wise Stream Papers');
    const todayDate = new Date().toISOString().split('T')[0];

    const fileName = `Exam_Wise_Stream_Papers_Report_${todayDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
  
}
