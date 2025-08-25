import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { GetSessionalFailStudentReport } from '../../../Models/GenerateAdmitCardDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { OnlineMarkingReportModel, OnlineMarkingSearchModel } from '../../../Models/OnlineMarkingReportDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sessional-fail-student-report',
  standalone: false,
  templateUrl: './sessional-fail-student-report.component.html',
  styleUrl: './sessional-fail-student-report.component.css'
})
export class SessionalFailStudentReportComponent {

  public SessionalStudentFailReportList: GetSessionalFailStudentReport[] = [];
  public searchRequest = new GetSessionalFailStudentReport();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public InstituteMasterList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public selectedDivision: number = 0;
  public selectedDistrict: number = 0;
  public displayedColumns: string[] = [];
  columnSchema: Array<{ key: string, label: string, isAction?: boolean, isDate?: boolean }> = [];
  dataSource: MatTableDataSource<GetSessionalFailStudentReport> = new MatTableDataSource();
  SemesterMasterList: any;
  filterForm: FormGroup | undefined;
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  ReportTypelist: any;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  Table_SearchText: string = '';
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(private loaderService: LoaderService, private reportService: ReportService, private commonMasterService: CommonFunctionService, private fb: FormBuilder, private toastr: ToastrService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.filterForm = this.fb.group({
      selectedSemester: [0],
    });
    this.loadMasterData();
    this.GetAllData();
  }


  exportToExcel() {
    const orderedColumns = ['SNo', 'StudentName', 'RollNo', 'EnrollmentNo', 'InstituteCode'];

    const allKeys = new Set<string>();
    this.SessionalStudentFailReportList.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });

    const remainingKeys = Array.from(allKeys).filter(k => !orderedColumns.includes(k));
    const finalColumns = [...orderedColumns, ...remainingKeys];

    const formattedData = this.SessionalStudentFailReportList.map((row, index) => {
      const reorderedRow: any = {};
      reorderedRow['SNo'] = index + 1;

      finalColumns.slice(1).forEach(key => {
        reorderedRow[key] = (row as any)[key];
      });

      return reorderedRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData, { header: finalColumns });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const fileName = `SessionalStudentFailReport_Class.xlsx`;
    XLSX.writeFile(wb, fileName);
  }


  async GetAllData() {
    if (this.filterForm?.value.selectedSemester == 0) {
      this.toastr.error("Please Select Semester");
      return;
    }
    let requestData: any = {
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      SemesterID: this.filterForm?.value.selectedSemester,
      EndTermID: this.ssoLoginUser.EndTermID
    }
    this.SessionalStudentFailReportList = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetSessionalFailStudentReport(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.SessionalStudentFailReportList = data['Data'];
            this.exportToExcel();
            this.buildDynamicColumns();
            this.dataSource = new MatTableDataSource(this.SessionalStudentFailReportList);
            this.dataSource.sort = this.sort;
            this.totalRecords = this.SessionalStudentFailReportList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          } else if (data.State === 3) {
            this.SessionalStudentFailReportList = [];
            this.dataSource = new MatTableDataSource(this.SessionalStudentFailReportList);
            this.dataSource.sort = this.sort;
            this.totalRecords = this.SessionalStudentFailReportList.length;
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

  buildDynamicColumns() {
    if (this.SessionalStudentFailReportList.length > 0) {
      const firstRow = this.SessionalStudentFailReportList[0];
      this.displayedColumns = [];

      this.displayedColumns.push('StudentName', 'RollNo', 'EnrollmentNo', 'InstituteCode');

      for (const key in firstRow) {
        if (
          !this.displayedColumns.includes(key) &&
          key !== 'StudentName' &&
          key !== 'RollNo' &&
          key !== 'EnrollmentNo' &&
          key !== 'InstituteCode'
        ) {
          this.displayedColumns.push(key);
        }
      }
    }
  }

  formatColumnLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (startIndex >= this.totalRecords) {
      this.currentPage = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    }
    const adjustedEndIndex = Math.min(endIndex, this.totalRecords);
    this.dataSource.data = this.SessionalStudentFailReportList.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  loadMasterData(): void {

    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
      }, (error: any) => console.error(error));

    this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));
  }

}
