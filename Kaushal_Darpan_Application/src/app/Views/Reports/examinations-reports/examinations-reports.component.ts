import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-examinations-reports',
  standalone: false,
  templateUrl: './examinations-reports.component.html',
  styleUrl: './examinations-reports.component.css'
})
export class ExaminationsReportsComponent {
  ExamReportList: any[] = [];
  displayedColumns: string[] = [];
  columnSchema: Array<{ key: string, label: string, isAction?: boolean, isDate?: boolean }> = [];

  dataSource = new MatTableDataSource<any>();
  sSOLoginDataModel: any;
  InstituteMasterList: any;
  SemesterMasterList: any;
  EndTermList: any;
  ReportTypelist: any;
 // filterForm!: FormGroup;

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
  }

  handlePageInfo(data: { href: string; pageType: string; semester: number; extType: string; action: string; sp: string; }) {
    this.pageInfo = data;
    if (this.pageInfo.pagetype = "view") {
      //this.loadMasterData();
      this.initForm();
      this.GetAllData();
    }
    console.log('Page Info received from child:', data);
  }

  initForm(): void {
    //this.filterForm = this.fb.group({
    //  EndTerm: [this.ssoLoginUser.EndTermID],
    //  selectedInstitute: [0],
    //  selectedSemester: [this.pageInfo.semester],
    //});
  }

  //loadMasterData(): void {
  //  this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
  //    .then((data: any) => {
  //      this.InstituteMasterList = data['Data'];
  //    });

  //  this.commonMasterService.SemesterMaster()
  //    .then((data: any) => {
  //      this.SemesterMasterList = data['Data'];
  //    });

  //  this.reportService.GetEndTerm().then((data: any) => {
  //    data = JSON.parse(JSON.stringify(data));
  //    this.EndTermList = data['Data'];
  //  });
  //}

  //resetForm(): void {
  //  this.filterForm.reset({
  //    EndTerm: this.ssoLoginUser.EndTermID,
  //    selectedInstitute: 0,
  //    selectedSemester: 0
  //  });
  //  this.GetAllData();
  //}

  filterFormSubmit(): void {
    this.GetAllData();
  }

  async GetAllData(): Promise<void> {
    const requestData = {
      Action: this.pageInfo.action,
      SP: this.pageInfo.sp,
      SemesterID: this.pageInfo.semester || 0,
      EndTermID: this.ssoLoginUser.EndTermID || 0,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID
    };

    this.ExamReportList = [];
    try {
      this.loaderService.requestStarted();
      const response = await this.reportService.ExaminationsReportsMenuWise(requestData);
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
    XLSX.writeFile(wb, this.pageInfo.action + '.xlsx');
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

