import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CollegesWiseReportsModel } from '../../../../Models/CollegesWiseReportsModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-center-daily-report',
  templateUrl: './center-daily-report.component.html',
  styleUrls: ['./center-daily-report.component.css'],
  standalone: false
})
export class CenterDailyReportComponent implements OnInit {
  CollegesWiseReportsModellList: CollegesWiseReportsModel[] = [];
  displayedColumns: string[] = [];
  columnSchema: Array<{ key: string, label: string, isAction?: boolean, isDate?: boolean }> = [];

  dataSource = new MatTableDataSource<any>();
  sSOLoginDataModel: any;
  InstituteMasterList: any;
  SemesterMasterList: any;
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
  constructor(
    private loaderService: LoaderService,
    private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    private fb: FormBuilder,
    public appsettingConfig: AppsettingService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.sSOLoginDataModel = this.ssoLoginUser;    
    this.loadMasterData();
    this.initForm();
    this.GetAllData();
  }

  handlePageInfo(data: { href: string; pageType: string; extType: string }) {
    this.pageInfo = data;
    console.log('Page Info received from child:', data);
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      Type: [this.ReportTypelist[0].URL],
      EndTerm: [this.ssoLoginUser.EndTermID],
      selectedInstitute: [0],
      selectedSemester: [0],
    });
  }

  loadMasterData(): void {
    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
      });

    this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      });

    this.reportService.GetEndTerm().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.EndTermList = data['Data'];
    });

    this.ReportTypelist = [
      { ID: 1, Name: 'Effective UFM Students From Attendance Report', URL: 'effective-ufm-attendance' },
      { ID: 2, Name: 'UFM Students From Attendance Report', URL: 'ufm-attendance' },
      { ID: 3, Name: 'Students Who Arrived Late Report', URL: 'late-students' },
      { ID: 4, Name: 'Students Caught Doing Malpractice (U.F.M.) Report', URL: 'ufm-malpractice' },
      { ID: 5, Name: 'Students Allowed to Sit in Exam with Permission Letter Copy Report', URL: 'allowed-with-permission' },
      { ID: 6, Name: 'Students Who Sat in Exam Without Permission Letter Report', URL: 'without-permission' }
    ];
  }

  resetForm(): void {
    this.filterForm.reset({
      Type: 0,
      EndTerm: this.ssoLoginUser.EndTermID,
      selectedInstitute: 0,
      selectedSemester: 0
    });
    this.GetAllData();
  }

  filterFormSubmit(): void {
    this.GetAllData();
  }

  async GetAllData(): Promise<void> {
    const requestData = {
      Type: this.filterForm.value.Type || 0,
      InstituteID: this.filterForm.value.selectedInstitute || 0,
      SemesterID: this.filterForm.value.selectedSemester || 0,
      EndTermID: this.filterForm.value.EndTerm || 0,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID
    };

    this.CollegesWiseReportsModellList = [];
    try {
      this.loaderService.requestStarted();
      const response = await this.reportService.GetCenterDailyReportData(requestData);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.CollegesWiseReportsModellList = data.Data;
        this.buildDynamicColumns();
        this.dataSource = new MatTableDataSource(this.CollegesWiseReportsModellList);
        this.dataSource.sort = this.sort;
        this.totalRecords = this.CollegesWiseReportsModellList.length;
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
    if (!this.CollegesWiseReportsModellList.length) return;

    const sampleItem = this.CollegesWiseReportsModellList[0];
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
    this.dataSource.data = this.CollegesWiseReportsModellList.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.CollegesWiseReportsModellList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.filterForm.value.Type+'.xlsx');
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
