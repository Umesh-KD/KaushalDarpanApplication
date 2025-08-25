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
  selector: 'app-iti-student-exam-reports',
  templateUrl: './iti-student-exam-reports.component.html',
  styleUrl: './iti-student-exam-reports.component.css',
  standalone: false
})
export class ItiStudentExamReportsComponent
{
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  viewAdminDashboardList: StudentExamDetails[] = [];
  displayedColumns: string[] = ['SrNo', 'StudentName', 'FatherName', 'InstituteName', 'BranchName', 'SemesterName'];
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
  filterForm!: FormGroup;

  constructor(
    private AdminReportsService: ReportService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private fb: FormBuilder
  ) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.instituteId = params.get('instituteId');
    });
    


    this.GetAllData();
  }

  async ngOnInit() {
    this.filterForm = this.fb.group({
      searchTerm: [''],
     selectedInstitute: ['all'],
      //selectedInstitute: [{ value: '' }],
      selectedSemester: ['all'],
    });
    this.loadMasterData();
    debugger;
    //this.filterForm.valueChanges.subscribe((values) => {
    //  //this.applyFilter(values);
    //});
  }

  //ngAfterViewInit(): void {
  //  // Apply filter after the view is initialized
  //  setTimeout(() => {
  //    this.applyFilter(this.filterForm?.value);
  //  }, 1000);
  //}

  loadMasterData(): void {
    this.commonMasterService.Iticollege(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
      
        if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || this.sSOLoginDataModel.RoleID == EnumRole.Principal_NCVT) {
          this.InstituteMasterList = data['Data'];
          var instid = this.sSOLoginDataModel.InstituteID
          this.InstituteMasterList = this.InstituteMasterList.filter((x: any) => { return x.InstituteID == instid });
          //console.log(this.sSOLoginDataModel.InstituteID,'ss1')
          //console.log(this.InstituteMasterList,'ss2')
          //this.isinstitutelist = true;
          this.filterForm.get('selectedInstitute')?.setValue(instid);
          this.filterForm.get('selectedInstitute')?.disable();

        } else {
          this.InstituteMasterList = data['Data'];
        
        }

      }, (error: any) => console.error(error));

    this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = [{ SemesterName: '1st Year' }, { SemesterName:'2nd Year' }];
      }, (error: any) => console.error(error));
  }

 
  exportToExcel(): void {
    const exportData = this.viewAdminDashboardList.map((row: any, index: number) => {
      const filteredRow: any = {};
      this.displayedColumns.forEach(col => {
        filteredRow[col] = (col === 'SrNo') ? index + 1 : row[col];
      });
      return filteredRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // 📏 Auto-width logic
    const columnWidths = this.displayedColumns.map(col => {
      const maxContentLength = Math.max(
        col.length,
        ...exportData.map(row => row[col]?.toString().length || 0)
      );
      return { wch: maxContentLength + 2 }; // +2 for padding
    });

    ws['!cols'] = columnWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
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
        InstituteID: ssoLoginUser.InstituteID,
        Status: this.id
      }

      await this.AdminReportsService.GetIitStudentExamReports(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          this.viewAdminDashboardList = data['Data'];
          this.dataSource = new MatTableDataSource(this.viewAdminDashboardList);
          this.dataSource.sort = this.sort;
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

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  applyFilter(values: any): void {
    debugger;
    if (values.selectedInstitute == undefined) {
      values.selectedInstitute = this.sSOLoginDataModel.InstituteID;
    }
    const { searchTerm, selectedInstitute, selectedSemester } = values;
    let filteredData = this.viewAdminDashboardList.filter(item => {
      const matchesSearchTerm = item.StudentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInstitute = selectedInstitute === 'all' || item.InstituteID == selectedInstitute;
      const matchesSemester = selectedSemester === 'all' || item.SemesterName === selectedSemester;

      return matchesSearchTerm && matchesInstitute && matchesSemester;
    });
    debugger;
    this.totalRecords = filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.updateTable(filteredData);
  }

  async updateTable(filteredData: StudentExamDetails[] = this.viewAdminDashboardList) {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    debugger;
    this.dataSource.data = filteredData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  async updatePaginationIndexes() {
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

