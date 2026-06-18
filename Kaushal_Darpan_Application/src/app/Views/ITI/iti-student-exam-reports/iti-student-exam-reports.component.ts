import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { enumExamStudentStatus, EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../Services/Report/report.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ToastrService } from 'ngx-toastr';

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
  
  displayedColumns: string[] = ['SrNo', 'SemesterName', 'StudentName', 'EnrollmentNo', 'FatherName', 'InstituteName', 'BranchName'];
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
  ReportNameTitle: string = 'Student for Examination';
  selection = new SelectionModel<any>(true, []);
  allSelected = false;
  ConfirmationText: string = 'Are you sure you want to mark the selected records as processed?';
  requestData: string = '';
  isDashboardFlag = false;

  constructor(
    private AdminReportsService: ReportService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private fb: FormBuilder,
    private Swal2: SweetAlert2,
    private toastr: ToastrService
  ) {
    debugger
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.instituteId = params.get('instituteId');
    });

    
    if (this.id == enumExamStudentStatus.EligibleForExamination)
    {

      this.displayedColumns= ['SrNo', 'SemesterName', 'StudentName', 'EnrollmentNo', 'FatherName', 'InstituteName', 'BranchName', 'ChallanNo', 'ChallanDate', 'FAMarks', 'Remark'];
      this.ReportNameTitle = "Eligible For Examination"
    }

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
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');

    var fileName ="Student_Examination_Report"
    if (this.id == enumExamStudentStatus.EligibleForExamination)
    {
      fileName ="Eligible_For_Examination_Report"
    }
    else if (this.id == enumExamStudentStatus.Addimited) {
      fileName = "Total_Examination_Student_Report"
    }
    XLSX.writeFile(wb, `${fileName}_${y}-${m}-${d}.xlsx`);
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
         
          if (this.viewAdminDashboardList.length > 0) {
            const hasDashboard = this.viewAdminDashboardList.some(
              (item: any) => Number(item.IsDashboard) === 1
            );

            this.isDashboardFlag = hasDashboard;
          } else {
            this.isDashboardFlag = false;
          }
          if (this.isDashboardFlag && this.id === '55' && !this.displayedColumns.includes('select')) {
            this.displayedColumns.unshift('select');
          }
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

  toggleAll(event: any) {
    this.allSelected = event.target.checked;

    this.dataSource.data.forEach((row: any) => {
      row.selected = this.allSelected;
    });
  }

  updateSelectAll() {
    this.allSelected = this.dataSource.data.every(
      (row: any) => row.selected
    );
  }

  async SaveTrn_ITI_StudentExamsFeeMark() {
    debugger
    const selectedRows = this.viewAdminDashboardList
      .filter((item: any) => item.selected == true);

    if (selectedRows.length == 0) {
      this.toastr.warning("Please select a record!");
      return;
    }

    const studentExamIDs = selectedRows
      .map((x: any) => x.StudentExamID)
      .join(',');

    this.Swal2.Confirmation(this.ConfirmationText,
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();
            this.requestData = studentExamIDs;
            await this.AdminReportsService
              .SaveTrn_ITI_StudentExamsFeeMark(this.requestData)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State === EnumStatus.Success) {
                  this.toastr.success(data.Message);
                } else {
                  this.toastr.error(data.ErrorMessage);
                }
              });

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
      });

  }


}

