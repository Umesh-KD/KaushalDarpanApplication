import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import * as XLSX from 'xlsx';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-wise-attendance-report',
  standalone: false,
  templateUrl: './date-wise-attendance-report.component.html',
  styleUrl: './date-wise-attendance-report.component.css'
})
export class DateWiseAttendanceReportComponent {
  ExamReportList: any[] = [];
  displayedColumns: string[] = [];
  columnSchema: Array<{ key: string, label: string, isAction?: boolean, isDate?: boolean }> = [];

  dataSource = new MatTableDataSource<any>();
  sSOLoginDataModel: any;
  InstituteMasterDDLList: any;
  ExamShiftDDL: any;
  SemesterMasterDDLList: any;
  StreamMasterDDLList: any;
  SubjectMasterDDLList: any;
  EndTermList: any;
  ReportTypelist: any;
  filterForm!: FormGroup;

  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;
  startInTableIndex = 1;
  endInTableIndex = 10;

  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  Table_SearchText = '';

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  pageInfo: any;
  today: Date = new Date();
  yesterdayDate: string;
  sevenDaysLater: Date = new Date();
  selectedRange: { start: Date, end: Date } | null = null;

  constructor(
    private loaderService: LoaderService,
    private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    private fb: FormBuilder,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Move to the previous day
    this.yesterdayDate = yesterday.toISOString().split('T')[0];
    this.sevenDaysLater.setDate(this.today.getDate() - 7);
    this.selectedRange = {
      start: this.sevenDaysLater,
      end: this.today
    };
  }

  ngOnInit(): void {
    this.sSOLoginDataModel = this.ssoLoginUser;
    this.initForm();
    this.loadMasterData();
    this.GetAllData();
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      FromExamDate: [this.selectedRange?.start],
      ToExamDate: [this.selectedRange?.end], 
      ShiftID: [0],
      SubjectID: [0],
      SemesterID: [0],
      StreamID: [0],
      InstituteID: [0]
    });
  }

  loadMasterData(): void {
    this.GetExamShiftData();
    this.getSemesterMasterList();
    this.getStreamMasterList();
    this.getCenterMasterList();   
  }

  async getCenterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
        console.log("InstituteMasterDDLList", this.InstituteMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetExamShiftData() {
    try {
      await this.commonMasterService.GetExamShift().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamShiftDDL = data.Data;
      })

    } catch (error) {
      console.error(error);
    }
  }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ddlSemester_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.filterForm.value.StreamID!, this.sSOLoginDataModel.DepartmentID, this.filterForm.value.SemesterID,)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterDDLList = data.Data;
        }, error => console.error(error));
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


  resetForm(): void {
    this.filterForm.reset({
      FromExamDate: '',
      ToExamDate: '',
      ShiftID: 0,
      SubjectID: 0,
      SemesterID: 0,
      StreamID: 0,
      InstituteID: 0
    });
    this.GetAllData();
  }

  filterFormSubmit(): void {
    this.GetAllData();
  }
  
  async GetAllData(): Promise<void> {
    const ToExamDate = this.filterForm.value.ToExamDate ?? this.selectedRange?.end;
    const FromExamDate = this.filterForm.value.FromExamDate ?? this.selectedRange?.start;
    const requestData = {
      ToExamDate: this.datePipe.transform(ToExamDate ?? this.selectedRange?.end, 'yyyy-MM-dd'),
      FromExamDate: this.datePipe.transform(FromExamDate ?? this.selectedRange?.start, 'yyyy-MM-dd'),
      ShiftID: this.filterForm.value.ShiftID,
      SubjectID: this.filterForm.value.SubjectID,
      StreamID: this.filterForm.value.StreamID,
      InstituteID: this.filterForm.value.InstituteID,
      SemesterID: this.filterForm.value.SemesterID,
      EndTermID: this.ssoLoginUser.EndTermID || 0,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID
    };

    this.ExamReportList = [];
    try {
      this.loaderService.requestStarted();
      const response = await this.reportService.DateWiseAttendanceReport(requestData);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.ExamReportList = data.Data;
        this.buildDynamicColumns();
        this.dataSource = new MatTableDataSource(this.ExamReportList);
        this.dataSource.sort = this.sort;
        this.totalRecords = this.ExamReportList.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.updateTable();
      } else {
        this.dataSource = new MatTableDataSource();
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  buildDynamicColumns(): void {
    if (!this.ExamReportList.length) return;

    const sampleItem = this.ExamReportList[0];
    const columnKeys = Object.keys(sampleItem);

    this.columnSchema = columnKeys.map(key => ({
      key,
      label: this.formatColumnLabel(key),
      isDate: key.toLowerCase().includes('date')
    }));

    // Add an Action column at the end
    // this.columnSchema.push({ key: 'Action', label: 'Action', isAction: true });

    this.displayedColumns = this.columnSchema.map(col => col.key);
  }

  formatColumnLabel(key: string): string {
    // Convert camelCase or PascalCase to words
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.updateTable();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
    this.dataSource.data = this.ExamReportList.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ExamReportList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'download-student-enrollment-details' + '.xlsx');
  }

  DownloadFile(fileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${fileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = this.generateFileName('pdf');
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

}
