import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumRole } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../Services/Report/report.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-pre-exam-student-reoprt',
  templateUrl: './pre-exam-student-reoprt.component.html',
  styleUrls: ['./pre-exam-student-reoprt.component.css'],
  standalone: false
})
export class PreExamStudentReportComponent {
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  viewAdminDashboardList: StudentExamDetails[] = [];
  filteredData: any[] = [];
  displayedColumns: string[] = ['SrNo', 'StudentName', 'FatherName', 'InstituteName', 'BranchName', 'SemesterName','Status'];
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
  isDisabled: boolean = false
  constructor(
    private AdminReportsService: ReportService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private fb: FormBuilder
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.instituteId = params.get('instituteId');

    });
    

    if (this.instituteId == null || this.instituteId==0) {
      this.instituteId=0
    }
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.checkInstituteStatus()
    this.loadMasterData();
    this.GetAllData();


  }

  async ngOnInit(): Promise<void> {

    this.filterForm = this.fb.group({
      searchTerm: [''],
      selectedInstitute: [0],
      selectedSemester: [0],
    });

    

    this.filterForm.valueChanges.subscribe((values) => {
      this.applyFilter(values);
    });
  

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.applyFilter(this.filterForm?.value);
    }, 1000);
  }

  loadMasterData(): void {
    
    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
        console.log(this.InstituteMasterList,"datains")
        this.filterForm?.patchValue({
          selectedInstitute: parseInt(this.instituteId),
        });
      }, (error: any) => console.error(error));

    this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'EndTermID', 'InstituteID', 'Selected', 'SemesterID', 'Status', 'StreamID', 'StudentID','StudentExamID'
    ];
    const filteredData = this.viewAdminDashboardList.map(item => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const columnWidths = Object.keys(filteredData[0] || {}).map(key => ({
      wch: Math.max(
        key.length, // Header length
        ...this.filteredData.map(item => (item[key] ? item[key].toString().length : 0)) // Max content length
      ) + 2 // Extra padding
    }));

    ws['!cols'] = columnWidths; 

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'StudentForExamination.xlsx');
  }
  checkInstituteStatus() {
    
    this.isDisabled = this.sSOLoginDataModel?.InstituteID > 0 && this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel?.InstituteID > 0 && this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon;
    this.instituteId = this.sSOLoginDataModel.InstituteID
  
  }




  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      const ssoLoginUser = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');

      let requestData: any = {
        EndTermID: ssoLoginUser.EndTermID,
        DepartmentID: ssoLoginUser.DepartmentID,
        Eng_NonEng: ssoLoginUser.Eng_NonEng,
        UserID: ssoLoginUser.UserID,
        RoleID: ssoLoginUser.RoleID,
        Status: this.id,
        InstituteID: ssoLoginUser.InstituteID
      }

      await this.AdminReportsService.GetStudentEnrollmentReports(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.viewAdminDashboardList = data['Data'];
          this.filteredData = [...this.viewAdminDashboardList];
          this.dataSource = new MatTableDataSource(this.filteredData);
          this.dataSource.sort = this.sort;
          this.totalRecords = this.filteredData.length;
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

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.updateTable();
  }

  applyFilter(filterValue: any): void {
    const { searchTerm, selectedInstitute, selectedSemester } = filterValue;
    this.filteredData = this.viewAdminDashboardList.filter(item => {
      const matchesSearchTerm = item.StudentName.toLowerCase().includes(filterValue.searchTerm.trim().toLowerCase());
      const matchesInstitute = selectedInstitute === 0 || item.InstituteID == selectedInstitute;
      const matchesSemester = selectedSemester === 0 || item.SemesterName === selectedSemester;

      return matchesSearchTerm && matchesInstitute && matchesSemester;
    });
    if (this.isDisabled) {
      this.filterForm?.controls['selectedInstitute'].disable(); // 🔥 Disables the control
    } else {
      this.filterForm?.controls['selectedInstitute'].enable(); // 🔥 Enables the control
    }
    //if (filterValue.searchTerm === "") {
    //  this.filteredData = [...this.viewAdminDashboardList];
    //} else {
    //  this.filteredData = this.viewAdminDashboardList.filter(item =>
    //    Object.values(item).some(value =>
    //      value != null && value.toString().toLowerCase().includes(filterValue.searchTerm.trim().toLowerCase())  // Fixed typo here
    //    )
    //  );
    //}

    this.totalRecords = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1;
    this.updateTable();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);

    this.dataSource.data = this.filteredData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  resetForm(): void {
    this.filterForm?.reset({
      searchTerm: '',
      selectedInstitute: 0,
      selectedSemester: 0,
    });

    this.applyFilter(this.filterForm?.value);

  }
}
