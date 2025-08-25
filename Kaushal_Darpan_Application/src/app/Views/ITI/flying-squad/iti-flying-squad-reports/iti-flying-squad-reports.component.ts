import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { CollegesWiseReportsModel } from '../../../../Models/CollegesWiseReportsModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { DTEApplicationDashboardDataModel } from '../../../../Models/DTEApplicationDashboardDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-iti-flying-squad-reports',
  templateUrl: './iti-flying-squad-reports.component.html',
  styleUrls: ['./iti-flying-squad-reports.component.css'],
    standalone: false
})
export class ITIFlyingSquadReportsComponent implements OnInit {

  // Data binding for College Wise Reports
  public GetFlyingSquadReportsList: any[] = [];

  // Columns to be displayed in the table
  displayedColumns: string[] = [
    'SrNo', 'TeamName', 'Institute', 'DeploymentDate','ExamShift', 'SSOID', 'Name', 'CourseTypeName'
  ];

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
  id: any = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  // Search text for table filter
  Table_SearchText: string = '';

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(private loaderService: LoaderService, private activatedRoute: ActivatedRoute, private reportService: ReportService, private commonMasterService: CommonFunctionService,
    private fb: FormBuilder, public appsettingConfig: AppsettingService, private http: HttpClient) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loadMasterData();
    this.GetAllData();
    this.filterForm = this.fb.group({
     /* CenterCode: [''],*/
      selectedInstitute: [0],
      selectedSemester: [0],
    });
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
  }

  resetForm(): void {
    this.filterForm?.reset({
     /* CenterCode: '',*/
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
    let requestData: any = {};
    if (this.ssoLoginUser.RoleID != 48 && this.ssoLoginUser.RoleID != 40) {
      requestData = {
        EndTermID: this.ssoLoginUser.EndTermID,
        DepartmentID: this.ssoLoginUser.DepartmentID,
        Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
        RoleID: this.ssoLoginUser.RoleID,
        Status: this.id,
        StaffID: this.ssoLoginUser.StaffID,
        UserID: this.ssoLoginUser.UserID
      }
    } else {
      requestData= {
        EndTermID: this.ssoLoginUser.EndTermID,
        DepartmentID: this.ssoLoginUser.DepartmentID,
        Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
        Status: this.id
      }
    }
    
    this.GetFlyingSquadReportsList = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetITIFlyingSquadTeamReports(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.GetFlyingSquadReportsList = data['Data'];
            this.dataSource = new MatTableDataSource(this.GetFlyingSquadReportsList);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.GetFlyingSquadReportsList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          } else if (data.State === 3) {
            this.GetFlyingSquadReportsList = [];
            this.dataSource = new MatTableDataSource(this.GetFlyingSquadReportsList);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.GetFlyingSquadReportsList.length;
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
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (startIndex >= this.totalRecords) {
      this.currentPage = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    }
    const adjustedEndIndex = Math.min(endIndex, this.totalRecords);
    this.dataSource.data = this.GetFlyingSquadReportsList.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.GetFlyingSquadReportsList);
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
