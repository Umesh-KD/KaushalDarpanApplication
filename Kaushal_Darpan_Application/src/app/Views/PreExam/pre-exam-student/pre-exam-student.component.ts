import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CreateTpoService } from '../../../Services/TPOMaster/create-tpo.service';
import { EditTpoComponent } from '../../TPOMaster/details-tpo/edit-tpo/edit-tpo.component';
import { DashboardCardModel, StudentExamDetails } from '../../../Models/DashboardCardModel';
import { AdminDashboardDataService } from '../../../Services/AdminDashboard/admin-dashboard-data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pre-exam-student',
  templateUrl: './pre-exam-student.component.html',
  styleUrls: ['./pre-exam-student.component.css'],
  standalone: false
})
export class PreExamStudentComponent {
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  viewAdminDashboardList: StudentExamDetails[] = [];
  displayedColumns: string[] = ['SrNo', 'StudentID', 'StudentName', 'FatherName', 'InstituteName', 'BranchName', 'SemesterName', 'StudentExamStatus'];
  dataSource: MatTableDataSource<StudentExamDetails> = new MatTableDataSource();
  // Pagination Properties
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  data!: DashboardCardModel;

  // Search text for table filter
  Table_SearchText: string = '';

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  // No need for @Input() here, as data is passed via MAT_DIALOG_DATA
  constructor(
    private AdminDashDataService: AdminDashboardDataService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadCenterData();  // Load data into the form when dialog is opened
  }

  // Load data into the form (using the dialog's data)
  loadCenterData(): void {
    
    this.AdminDashDataService.data$.subscribe(data => {
      this.data = data;
    });
    if (this.data) {
      this.GetAllData()
      console.log('Loaded College Data:', this.data);
    } else {
      this.router.navigateByUrl('/dashboard');
    }
  }

  exportToExcel(): void {
    //const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('data-table')!);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.viewAdminDashboardList);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      const ssoLoginUser = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');

      let requestData = {
        "EndTermID": ssoLoginUser.EndTermID,
        "DepartmentID": ssoLoginUser.DepartmentID,
        "Eng_NonEng": ssoLoginUser.Eng_NonEng,
        "Status": this.data.Status,
        "Menu": this.data.Menu
      }


      await this.AdminDashDataService.GetAdminDashReportsData(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.viewAdminDashboardList = data['Data'];
          this.dataSource = new MatTableDataSource(this.viewAdminDashboardList);
          this.dataSource.sort = this.sort;  // Apply sorting
          this.totalRecords = this.viewAdminDashboardList.length;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          this.updateTable();
        }, (error: any) => console.error(error)
        );
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
    this.dataSource.data = this.viewAdminDashboardList.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

}
