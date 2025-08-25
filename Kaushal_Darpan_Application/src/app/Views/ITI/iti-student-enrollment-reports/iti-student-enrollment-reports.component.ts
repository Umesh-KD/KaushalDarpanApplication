import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { EnumRole, EnumSemesterDDL } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../Services/Report/report.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-iti-student-enrollment-reports',
  standalone: false,
  templateUrl: './iti-student-enrollment-reports.component.html',
  styleUrl: './iti-student-enrollment-reports.component.css'
})
export class ItiStudentEnrollmentReportsComponent implements AfterViewInit {
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  viewAdminDashboardList: StudentExamDetails[] = [];
  displayedColumns: string[] = ['SrNo', 'StudentName','EnrollmentNo', 'FatherName', 'InstituteName', 'BranchName', 'SemesterName'];
  dataSource: MatTableDataSource<StudentExamDetails> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  sSOLoginDataModel: any;
  id: any;
  instituteId: any;
  _EnumRole = EnumRole;
  InstituteMasterList: any = [];
  SemesterMasterList: any = [];
  Table_SearchText: string = '';
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  filterForm: FormGroup | undefined;

  constructor(
    private AdminReportsService: ReportService,
    private activatedRoute: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private fb: FormBuilder
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.instituteId = params.get('instituteId');
    });
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllData();
  }

  async ngOnInit(): Promise<void> {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      selectedInstitute: [this.instituteId == null || this.instituteId == undefined ? 'all' : this.instituteId],
      selectedSemester: ['all'],
    });
    this.loadMasterData();
    this.filterForm.valueChanges.subscribe((values) => {
      this.applyFilter(values);
    });
  }

  ngAfterViewInit(): void {
    // Apply filter after the view is initialized
    setTimeout(() => {
      this.applyFilter(this.filterForm?.value);
    }, 1000);
  }

  loadMasterData(): void {

    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
      }, (error: any) => console.error(error));

    this.commonMasterService.SemesterMaster(EnumSemesterDDL.ITISemester)
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));
  }

  exportToExcel(): void {

    // Filter data to include only desired columns
    const exportData = this.viewAdminDashboardList.map((row: any, index: number) => {
      const filteredRow: any = {};
      this.displayedColumns.forEach(col => {
        if (col === 'SrNo') {
          filteredRow['SrNo'] = index + 1; // Add serial number
        } else {
          filteredRow[col] = row[col];
        }
        //filteredRow[col] = row[col];
      });
      return filteredRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  async GetAllData() {
    try {
      const ssoLoginUser = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');
      let requestData: any = {
        EndTermID: ssoLoginUser.EndTermID,
        DepartmentID: ssoLoginUser.DepartmentID,
        Eng_NonEng: ssoLoginUser.Eng_NonEng,
        UserID: ssoLoginUser.UserID,
        RoleID: ssoLoginUser.RoleID,
        InstituteID: ssoLoginUser.InstituteID,
        Status: this.id,
        FinancialYearID: ssoLoginUser.FinancialYearID
      }
      debugger
      await this.AdminReportsService.GetItiStudentEnrollmentReports(requestData)
     
        .then((data: any) => {
          this.viewAdminDashboardList = data['Data'];
          this.totalRecords = this.viewAdminDashboardList.length;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          this.updateTable();
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    }
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.updateTable();
  }

  applyFilter(values: any): void {
    const { searchTerm, selectedInstitute, selectedSemester } = values;
    let filteredData = this.viewAdminDashboardList.filter(item => {
      const matchesSearchTerm = item.StudentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInstitute = selectedInstitute === 'all' || item.InstituteID == selectedInstitute;
      const matchesSemester = selectedSemester === 'all' || item.SemesterName === selectedSemester;

      return matchesSearchTerm && matchesInstitute && matchesSemester;
    });

    this.totalRecords = filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.updateTable(filteredData);
  }

  updateTable(filteredData: StudentExamDetails[] = this.viewAdminDashboardList): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.dataSource.data = filteredData.slice(startIndex, endIndex);
    debugger;
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  resetForm(): void {
    this.filterForm?.reset({
      searchTerm: '',
      selectedInstitute: 'all',
      selectedSemester: 'all',
    });

    this.applyFilter(this.filterForm?.value);
  }
}
