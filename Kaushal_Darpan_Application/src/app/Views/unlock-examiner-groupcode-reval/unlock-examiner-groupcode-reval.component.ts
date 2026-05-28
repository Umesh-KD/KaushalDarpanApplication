import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../Common/appsetting.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { ExaminerwithGroupcodeModel } from '../../Models/MiscellaneousModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import * as XLSX from 'xlsx';
import { CommonFunctionHelper } from '../../Common/commonFunctionHelper';
import { ExaminerService } from '../../Services/Examiner/examiner.service';


@Component({
  selector: 'app-unlock-examiner-groupcode-reval',
  standalone: false,
  templateUrl: './unlock-examiner-groupcode-reval.component.html',
  styleUrl: './unlock-examiner-groupcode-reval.component.css'
})

export class UnlockExaminerGroupcodeRevalComponent {
  // Data binding for College Wise Reports
  public CollegesWiseReportsModellList: ExaminerwithGroupcodeModel[] = [];

  // Columns to be displayed in the table
  displayedColumns: string[] = [
    'SNo', 'GroupCode', 'ExaminerName', 'SubjectCode', 'AllotedStudentTotal', 'ExaminerCode', 'Action'
  ];

  // Data source for the table
  dataSource: MatTableDataSource<ExaminerwithGroupcodeModel> = new MatTableDataSource();
  sSOLoginDataModel: any;
  InstituteMasterList: any;
  SemesterMasterList: any;
  public requestData = new ExaminerwithGroupcodeModel();
  public unlockRequest = new ExaminerwithGroupcodeModel();
  filterForm!: FormGroup;
  feedbackForm: FormGroup | undefined;
  // Pagination Properties
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  // Search text for table filter
  Table_SearchText: string = '';
  GroupMasterDDLList: any;
  SubjectCodeMasterDDLList: any;
  modalReference: NgbModalRef | undefined;

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private commonMasterService: CommonFunctionService,
    private examinerService: ExaminerService,
    private fb: FormBuilder,
    public appsettingConfig: AppsettingService,
    private toastr: ToastrService,
    public commonFunctionHelper: CommonFunctionHelper
  ) { }

  async ngOnInit() {

    this.filterForm = this.fb.group({
      // displayColumns: [''],
      StateId: [''],
      StudentType: [''],
      SemesterID: ['0'],
      StreamID: [''],
      District: [''],
      gender: [''],
      Block: [''],
      CourseType: [''],
      Institute: [''],
      EndTerm: [this.ssoLoginUser.EndTermID],
      CategaryCast: [''],
      UniqueCol: [''],
      ReportFlagID: [''],
      // Type: [this.repType],
      SchemeID: ['0'],
    });

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // load
    await this.getSemesterMaster();
    // await this.GetAllData();
  }

  async getSemesterMaster() {
    this.commonMasterService.SemesterMaster().then((data: any) => {
      this.SemesterMasterList = data['Data'];
    }, (error: any) => console.error(error));

  }

  applyFilter(filterValue: string): void {
    if (filterValue === "all") {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  // Fetching the data from the service and updating the table
  async GetAllData() {
    try {
      //debugger
      this.requestData.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestData.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      // this.requestData.SchemeID = this.filterForm.seme
      this.requestData.SchemeID = !isNaN(Number(this.filterForm.value.SchemeID)) ? Number(this.filterForm.value.SchemeID) : 0;
      this.requestData.SemesterID = !isNaN(Number(this.filterForm.value.SemesterID)) ? Number(this.filterForm.value.SemesterID) : 0;
      this.CollegesWiseReportsModellList = [];

      // call
      await this.examinerService.GetExaminerWithGroupCode_Reval(this.requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.CollegesWiseReportsModellList = data['Data'];
            this.dataSource = new MatTableDataSource(this.CollegesWiseReportsModellList);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.CollegesWiseReportsModellList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          } else if (data.State === EnumStatus.Warning) {
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
    }
  }

  async UnlockRow(GroupCode: any) {
    //debugger;
    this.unlockRequest.GroupCode = GroupCode;
    this.unlockRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.unlockRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.unlockRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    // 
    this.Swal2.Confirmation("Are you sure, you want to Unlock?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            // call
            await this.examinerService.UnlockExaminerWithGroupCode_Reval(this.unlockRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message);
                }
                else if (data.State == EnumStatus.Error) {
                  this.toastr.error(data.Message);
                  console.error(data.ErrorMessage);
                }
              })
          } catch (error) {
            console.log(error);
          }
        }
      });

  }

  // Handle page change event for pagination
  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    //
    this.updateTable();
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

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.CollegesWiseReportsModellList);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  ResetReport() {
    this.filterForm.reset({
      SchemeID: 0,
      SemesterID: 0
    });
    this.requestData = new ExaminerwithGroupcodeModel();
  }
}
