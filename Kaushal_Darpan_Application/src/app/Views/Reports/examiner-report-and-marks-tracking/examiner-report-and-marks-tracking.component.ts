import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { CollegesWiseReportsModel } from '../../../Models/CollegesWiseReportsModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-examiner-report-and-marks-tracking',
  standalone: false,
  templateUrl: './examiner-report-and-marks-tracking.component.html',
  styleUrl: './examiner-report-and-marks-tracking.component.css'
})
export class ExaminerReportAndMarksTrackingComponent implements OnInit {

  // Data binding for College Wise Reports
  public ExaminerReportAndMarksTracking: any[] = [];
  public ExaminerReportAndMarksTrackingStudent: any[] = [];
  public ExaminerReportAndPresentTrackingStudent: any[] = [];
  ISMarksTracking: any;
  ISPresentTracking: any;
  // Columns to be displayed in the table
  displayedColumns: string[] = [
    'SrNo','GroupCode', 'RollNo', 'StudentName', 'FatherName', 'MotherName', 'SubjectCode','ObtainedTheory'
  ];
  displayedPresentColumns: string[] = [
    'SrNo', 'GroupCode', 'CenterCode', 'RollNo', 'StudentName', 'FatherName', 'MotherName', 'SubjectCode', 'ObtainedTheory'
  ];

  // Data source for the table
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();
  sSOLoginDataModel: any;
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  // Search text for table filter
  Table_SearchText: string = '';

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(private loaderService: LoaderService, private reportService: ReportService, private commonMasterService: CommonFunctionService,
    private fb: FormBuilder, public appsettingConfig: AppsettingService, private http: HttpClient) { }

  ngOnInit(): void {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllData();
  }

  // Fetching the data from the service and updating the table
  async GetAllData() {
    let requestData: any = {
      EndTermID: this.ssoLoginUser.EndTermID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID,
      SSOID: this.ssoLoginUser.SSOID
    }
    this.ExaminerReportAndMarksTracking = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetExaminerReportAndMarksTracking(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.ExaminerReportAndMarksTracking = data['Data'];     
            console.log("this.ExaminerReportAndMarksTracking",this.ExaminerReportAndMarksTracking);       
          } else if (data.State === 3) {
            this.ExaminerReportAndMarksTracking = [];
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async MarksTracking(marks: any) {
    this.ISMarksTracking = marks;
    let requestData: any = {
      EndTermID: this.ssoLoginUser.EndTermID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID,
      Marks: marks,
      SSOID: this.ssoLoginUser.SSOID,
      IsPresent: marks
    }
    this.ExaminerReportAndMarksTrackingStudent = [];
    this.ExaminerReportAndPresentTrackingStudent = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetExaminerReportAndMarksTrackingStudent(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.ExaminerReportAndMarksTrackingStudent = data['Data'];
            this.dataSource = new MatTableDataSource(this.ExaminerReportAndMarksTrackingStudent);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.ExaminerReportAndMarksTrackingStudent.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          } else if (data.State === 3) {
            this.ExaminerReportAndMarksTrackingStudent = [];
            this.dataSource = new MatTableDataSource(this.ExaminerReportAndMarksTrackingStudent);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.ExaminerReportAndMarksTrackingStudent.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async PresentTracking(isPresent: any) {
    this.ISPresentTracking = isPresent;
    let requestData: any = {
      EndTermID: this.ssoLoginUser.EndTermID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID,
      SSOID: this.ssoLoginUser.SSOID,
      IsPresent: isPresent
    }
    this.ExaminerReportAndMarksTrackingStudent = [];
    this.ExaminerReportAndPresentTrackingStudent = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.ExaminerReportAndPresentTrackingStudent(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.ExaminerReportAndPresentTrackingStudent = data['Data'];
            this.dataSource1 = new MatTableDataSource(this.ExaminerReportAndPresentTrackingStudent);
            this.dataSource1.sort = this.sort;  // Apply sorting
            this.totalRecords = this.ExaminerReportAndPresentTrackingStudent.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          } else if (data.State === 3) {
            this.ExaminerReportAndPresentTrackingStudent = [];
            this.dataSource1 = new MatTableDataSource(this.ExaminerReportAndPresentTrackingStudent);
            this.dataSource1.sort = this.sort;  // Apply sorting
            this.totalRecords = this.ExaminerReportAndPresentTrackingStudent.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  // Handle page change event for pagination
  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  // Apply the filter for College Name
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (startIndex >= this.totalRecords) {
      this.currentPage = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    }
    const adjustedEndIndex = Math.min(endIndex, this.totalRecords);
    this.dataSource.data = this.ExaminerReportAndMarksTrackingStudent.slice(startIndex, adjustedEndIndex);
    this.dataSource1.data = this.ExaminerReportAndPresentTrackingStudent.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  async CenterDailyReportsDownload(element: any) {
    let requestData: any = {
      CenterCode: element.CenterCode,
      SemesterID: element.SemesterID,
      InstituteID: element.InstituteID,
      StreamID: element.StreamId,
      SubjectID: element.SubjectID,
      CenterID: element.CenterID,
      EndTermID: this.ssoLoginUser.EndTermID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID
    }
    this.ExaminerReportAndMarksTrackingStudent = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetDownloadCenterDailyReports(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DownloadFile(data.Data, 'file download');
          alert(data.Data)
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  exportToExcel(): void {
    //const unwantedColumns = [
    //  'EndTermID', 'InstituteID', 'Selected', 'SemesterID', 'Status', 'StreamID', 'StudentID'
    //];
    //const filteredData = this.viewAdminDashboardList.map(item => {
    //  const filteredItem: any = {};
    //  Object.keys(item).forEach(key => {
    //    if (!unwantedColumns.includes(key)) {
    //      filteredItem[key] = item[key];
    //    }
    //  });
    //  return filteredItem;
    //});
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ExaminerReportAndMarksTrackingStudent);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  async exportToPresentAndAbsentReport() {
    let requestData: any = {
      EndTermID: this.ssoLoginUser.EndTermID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID,
      SSOID: this.ssoLoginUser.SSOID,
      IsPresent: this.ISPresentTracking
    }

    try {
      this.loaderService.requestStarted();
      await this.reportService.GetExaminerReportOfPresentAndAbsentDownload(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DownloadFile(data.Data, 'file download');
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  exportToPresentExcel(): void {
    //const unwantedColumns = [
    //  'EndTermID', 'InstituteID', 'Selected', 'SemesterID', 'Status', 'StreamID', 'StudentID'
    //];
    //const filteredData = this.viewAdminDashboardList.map(item => {
    //  const filteredItem: any = {};
    //  Object.keys(item).forEach(key => {
    //    if (!unwantedColumns.includes(key)) {
    //      filteredItem[key] = item[key];
    //    }
    //  });
    //  return filteredItem;
    //});
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ExaminerReportAndPresentTrackingStudent);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
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
