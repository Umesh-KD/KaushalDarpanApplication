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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bter-branch-wise-statistical-reports',
  templateUrl: './bter-branch-wise-statistical-reports.component.html',
  styleUrls: ['./bter-branch-wise-statistical-reports.component.css'],
    standalone: false
})
export class BranchWiseStatisticalReportsComponent implements OnInit {

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

  constructor(private loaderService: LoaderService, private reportService: ReportService, private commonMasterService: CommonFunctionService, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));    
    
    this.filterForm = this.fb.group({     
      selectedSemester: [0],
    });
    this.loadMasterData();
  }

 
  exportToExcel(): void {

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.CollegesWiseReportsModellList);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'StatisticsReports.xlsx');
  }



  resetForm(): void {
    this.filterForm?.reset({      
      selectedSemester: 0,
    });
   
  }
  filterFormSubmit() {
    this.GetAllData();
  }
  async Download(): Promise<void> {
    try {
      if (this.filterForm?.value.selectedSemester == 0) {
        this.toastr.error("Please Select Semester");
        return;
      }

      this.loaderService.requestStarted();
      let requestData: any = {
        AcademicYearID: this.ssoLoginUser.FinancialYearID,
        Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
        SemesterID: this.filterForm?.value.selectedSemester,
        RoleID: this.ssoLoginUser.RoleID,
        EndTermID: this.ssoLoginUser.EndTermID
      }
      const data = await this.reportService.GetBterBranchWiseStatisticalReport(requestData);
      if (data && data.Data) {   
        this.downloadBase64PDF(data.Data, 'BranchWiseStatistical.pdf');
      } else {
        this.toastr.error('Data not found');
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  downloadBase64PDF(base64: string, filename: string): void {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  // Fetching the data from the service and updating the table

  async GetAllData() {
    
    let requestData: any = {      
      AcademicYearID: this.ssoLoginUser.FinancialYearID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng
    
    }
    this.CollegesWiseReportsModellList = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetBterStatisticsReport(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.CollegesWiseReportsModellList = data['Data'];
            this.exportToExcel();
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
}
