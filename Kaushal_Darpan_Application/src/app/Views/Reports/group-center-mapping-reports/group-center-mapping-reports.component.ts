import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { CollegesWiseReportsModel } from '../../../Models/CollegesWiseReportsModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { DTEApplicationDashboardDataModel } from '../../../Models/DTEApplicationDashboardDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-group-center-mapping-reports',
  templateUrl: './group-center-mapping-reports.component.html',
  styleUrls: ['./group-center-mapping-reports.component.css'],
    standalone: false
})
export class GroupCenterMappingReportsComponent implements OnInit {

  // Data binding for College Wise Reports
  public CollegesWiseReportsModellList: CollegesWiseReportsModel[] = [];

  // Columns to be displayed in the table
  displayedColumns: string[] = [];
  columnSchema: Array<{ key: string, label: string, isAction?: boolean, isDate?: boolean }> = [];
  // Data source for the table
  dataSource: MatTableDataSource<CollegesWiseReportsModel> = new MatTableDataSource();
  sSOLoginDataModel: any;
  InstituteMasterList: any;
  SemesterMasterList: any;
  filterForm: FormGroup | undefined;
  // Pagination Properties
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  ReportTypelist: any;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  // Search text for table filter
  Table_SearchText: string = '';

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(private loaderService: LoaderService, private reportService: ReportService, private commonMasterService: CommonFunctionService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loadMasterData();
    
    this.filterForm = this.fb.group({
      Type: [this.ReportTypelist[0].URL],
      CCCode: [''],
      CenterCode: [''],
      GroupCode: [''],
      selectedInstitute: [0],
      selectedSemester: [0],
    });
    this.GetAllData();
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.CollegesWiseReportsModellList);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  loadMasterData(): void {

    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
        //this.filterForm?.patchValue({
        //  selectedInstitute: parseInt(this.instituteId),
        //});
      }, (error: any) => console.error(error));

    this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));

    this.ReportTypelist = [
      { ID: 1, Name: 'Download Group Center Mapping Report', URL: 'group-center-mapping-reports' },
      { ID: 2, Name: 'Export Group Centre for Examiner Module', URL: 'group-center-examiner-reports' },
      { ID: 3, Name: 'Sub. wise Examiner Work Distribution Report', URL: 'sub-wise-examiner-work-distribution-report' },
      { ID: 4, Name: 'Answer Book Recd. from Instt. (Subject Code wise)', URL: 'answer-book-read-institute-subject-code' },
      { ID: 5, Name: 'Answer Book Recd. from(Subject Code wise)', URL: 'answer-book-read-subject-code' }
    ];
  }

  resetForm(): void {
    this.filterForm?.reset({
      Type: 0,
      CCCode: '',
      CenterCode: '',
      GroupCode: '',
      selectedInstitute: 0,
      selectedSemester: 0,
    });
    this.GetAllData();
  }
  filterFormSubmit() {
    this.GetAllData();
  }
  // Fetching the data from the service and updating the table
  async GetAllData() {
    let requestData: any = {
      Type: this.filterForm?.value.Type || 0,
      CCCode: this.filterForm?.value.CCCode != "" && this.filterForm?.value.CCCode != 0 ? this.filterForm?.value.CCCode:0,
      CenterCode: this.filterForm?.value.CenterCode != "" && this.filterForm?.value.CenterCode != 0 ? this.filterForm?.value.CenterCode : 0,
      GroupCode: this.filterForm?.value.GroupCode != "" && this.filterForm?.value.GroupCode != 0 ? this.filterForm?.value.GroupCode : 0,
      EndTermID: this.ssoLoginUser.EndTermID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID
    }
    this.CollegesWiseReportsModellList = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetGroupCenterMappingReportsData(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.CollegesWiseReportsModellList = data['Data'];
            this.buildDynamicColumns();
            this.dataSource = new MatTableDataSource(this.CollegesWiseReportsModellList);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.CollegesWiseReportsModellList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          } else if (data.State === 3) {
            this.CollegesWiseReportsModellList = [];
            this.dataSource = new MatTableDataSource(this.CollegesWiseReportsModellList);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.CollegesWiseReportsModellList.length;
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

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }
}
