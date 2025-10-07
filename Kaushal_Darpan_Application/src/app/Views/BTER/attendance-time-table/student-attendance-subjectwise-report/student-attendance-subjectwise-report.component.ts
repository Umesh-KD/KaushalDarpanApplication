import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { GlobalConstants } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AttendanceServiceService } from '../../../../Services/AttendanceServices/attendance-service.service';
import { StaffMasterService } from '../../../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'student-attendance-subjectwise-report', 
  templateUrl: './student-attendance-subjectwise-report.component.html',
  styleUrl: './student-attendance-subjectwise-report.component.css',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAttendanceSubjectwiseReportComponent {
displayedColumns: string[] = ['SrNo', 'EnrollmentNo', 'StudentName', 'StreamName','SemesterName','YearName','ActionName'];
  dynamicColumns: string[] = [];
  displayedColumnsData: string[] = ['SrNo', 'SubjectName', 'Present', 'Absent','Holiday','PresentPercent'];
  dynamicColumnsData: string[] = [];
  filterData: any[] = [];
  attData: any[] = [];
  EditDataFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  StreamMasterDDL: any[] = [];
  SemesterMasterDDL: any[] = [];
  SubjectMasterDDL: any[] = [];
  GetSectionData: any[] = [];
  TableForm!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  private _liveAnnouncer = inject(LiveAnnouncer);
  dataSource = new MatTableDataSource<any>([]);
  attDataSource = new MatTableDataSource<any>([]);
  checkedAll: boolean = false;
  // Pagination related variables
  totalRecords: number = 0;
  pageSize: number = 500;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  // Pagination related variables
  totalRecordsData: number = 0;
  pageSizeData: number = 500;
  currentPageData: number = 1;
  totalPagesData: number = 0;
  startInTableIndexData: number = 1;
  endInTableIndexData: number = 10;
  streamId!: number;
  semesterId!: number;
  sectionId!: number;
  subjectId!: number;
  EnrollmentNo!: string;
  actionName!: string;  
  mEnrollmentNo!: string;  
  mStudentName!: string;  
  mStreamName!: string;  
  mSemesterName!: string;  
  mYearName!: string;   
  modalRef1: NgbModalRef | null=null;
  SelectedStudent:any = {};
  //isSubmitted:boolean =false;
  closeResult:string | undefined;
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(
    private attendanceServiceService: AttendanceServiceService,
    private fb: FormBuilder,
    private staffMasterService: StaffMasterService,
    private http: HttpClient, private route: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,private modalService:NgbModal,) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // Access the route parameters
    this.streamId = parseInt(this.route.snapshot.paramMap.get('streamId') ?? "0");
    this.sectionId = parseInt(this.route.snapshot.paramMap.get('sectionId') ?? "0");
    this.semesterId = parseInt(this.route.snapshot.paramMap.get('semesterId') ?? "0");
    this.subjectId = parseInt(this.route.snapshot.paramMap.get('subjectId') ?? "0");
    this.getMasterData(); 
  }
  ngOnInit() {
    
    
    this.TableForm = this.fb.group({
      SubjectID: ['', Validators.required],
      StreamID: ['', Validators.required],
      SectionID: ['', Validators.required],
      SemesterID: ['', Validators.required],
      EnrollmentNo:['']
    });

    /*this.getSubjectMasterDDL(this.streamId, this.semesterId);*/

    this.TableForm.patchValue({
      StreamID: this.streamId,
      SemesterID: this.semesterId,
      SectionID: this.sectionId,
    }); 
    this.GetAttendanceTimeTable(); 
  }
  get formTable() { return this.TableForm.controls; }

  async getMasterData() {
    try {
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      })
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      }) 

      //await this.commonMasterService.GetSubjectMaster(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.SubjectMasterDDL = data.Data;
      //})
    } catch (error) {
      console.error(error);
    }
  }
  async GetBranchSectionData(streamId: any) {
    let obj = {
      Action: "GET_BY_ID",
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      StreamID: streamId,
    }

    await this.staffMasterService.GetBranchSectionData(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetSectionData = data.Data
      }, (error: any) => console.error(error)
      );
  }

  getSubjectMasterDDL(ID: any, SemesterID: any) {
    if (ID && SemesterID != "" && SemesterID != null) {
      this.commonMasterService.SubjectMaster_StreamIDWise(ID, this.sSOLoginDataModel.DepartmentID, SemesterID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
      })
    } else {
      console.error('Event or value is undefined');
    }

  }
  getData() {
    this.isSubmitted = true;
    if (this.TableForm.value.StreamID != null && this.TableForm.value.SubjectID) {
      this.GetAttendanceTimeTable();
    }
  }
  async GetAttendanceTimeTable() {
    
    try {
        debugger;
      let obj = {
        SemesterID: this.TableForm.value.SemesterID || 0,
        EndTermID: this.sSOLoginDataModel.EndTermID || 0,
        InstituteID: this.sSOLoginDataModel.InstituteID || 0,
        DepartmentID: this.sSOLoginDataModel.DepartmentID || 0,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng || 0,
        StreamID: this.TableForm.value.StreamID || 0,
        SectionID: this.TableForm.value.SectionID || 0,
        SubjectID: this.TableForm.value.SubjectID || 0,
        EnrollmentNo: this.TableForm.value.EnrollmentNo || '',
        StudentId:0,
        ActionName:'_GetStudentAttendance'
      };

      this.filterData = [];

      await this.attendanceServiceService.GetStudentAttendanceSubjectWise(obj).then((data: any) => {
        debugger;
        data = JSON.parse(JSON.stringify(data['Data']));
        console.log(data);
        this.filterData = data;
        if (this.filterData.length > 0) {
          // ✅ Reset dynamic columns and static columns
          this.dynamicColumns = [];
          this.displayedColumns = ['SrNo', 'EnrollmentNo', 'StudentName', 'StreamName','SemesterName','YearName','ActionName'];

          // ✅ Extract dynamic columns from the first row of data
          // this.dynamicColumns = Object.keys(this.filterData[0])
          //   .filter(key => key !== 'SectionID' && key !== 'SectionName' && key !== 'EnrollmentNo' && key !== 'SemesterName' && key !== 'StreamName' && key !== 'StudentName' && key !== 'SubjectName' && key !== 'SemesterID' && key !== 'StreamID' && key !== 'SubjectID' && key !== 'SubjectID1' && key !== 'InstituteID' && key !== 'AttendanceDate' && key !== 'Attendance' && key !== 'EndTermID' && key !== 'CourseTypeID' && key !== 'StudentID' );

          // ✅ Add dynamic columns to displayedColumns
         // this.displayedColumns = [...this.displayedColumns, ...this.dynamicColumns];
        }

        this.dataSource.data = this.filterData;
        this.dataSource.sort = this.sort;
        this.totalRecords = this.filterData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

        this.updateTable(); // ✅ Update table after loading data
      }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }

  // Method to handle attendance change (can be customized)
  onAttendanceChange(event: any, element: any, column: string) {
    const attendanceStatus = event.checked ? 'P' : 'A';
    element[column] = attendanceStatus;
    console.log(`${element.StudentName}'s attendance for ${column} changed to ${attendanceStatus}`);
  }

  // Method to toggle all attendance for a specific column to 'Present'
  toggleAllAttendanceForColumn(column: string, checked: boolean) {
    this.dataSource.data.forEach((row: { [x: string]: string; }) => {
      row[column] = checked ? 'P' : 'A'; // Set all attendance to 'P' or 'A'
    });
  }
  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
    this.dataSource.data = this.filterData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  /** Apply filter to the table */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterData = this.filterData.filter(item =>
      Object.values(item).some(value =>
        value != null && value.toString().toLowerCase().includes(filterValue.trim().toLowerCase())
      )
    );
    this.totalRecords = this.filterData.length; // Update the total record count after filtering
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1; // Reset to the first page after filtering
    this.updateTable();  // Update table with filtered data
  }
  async EditData(content: any, rowData?: any) {
    this.isSubmitted = true;
    this.SelectedStudent = rowData;
    
    debugger
    // Open only once, store reference
    this.modalRef1 = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });
    //await this.fetchById();

    // Handle result or dismissal
    this.modalRef1.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    if (rowData != null && rowData != undefined) {
      console.log(rowData); 
      if (rowData.StudentID != null) {
        let obj = {
          DepartmentID: this.sSOLoginDataModel.DepartmentID,
          EndTermID: this.sSOLoginDataModel.EndTermID,
          Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng, 
          StudentId:rowData.StudentID,
          ActionName:'_GetStudentAttendanceByStudentID'
        }
        this.mEnrollmentNo=rowData.EnrollmentNo;
        this.mStudentName=rowData.StudentName; 
        this.mSemesterName=rowData.SemesterName;
        this.mStreamName=rowData.StreamName;
        this.mYearName=rowData.YearName;
        this.attData = [];

      await this.attendanceServiceService.GetStudentAttendanceSubjectWise(obj).then((data: any) => {
        debugger;
        data = JSON.parse(JSON.stringify(data['Data']));
        console.log(data);
        this.attData = data;
        if (this.attData.length > 0) {
          // ✅ Reset dynamic columns and static columns
          this.dynamicColumnsData = [];
          this.displayedColumnsData = ['SrNo', 'SubjectName', 'Present', 'Absent','Holiday','PresentPercent'];
 
        }

        this.attDataSource.data = this.attData;
        this.attDataSource.sort = this.sort;
        this.totalRecordsData = this.attData.length;
        this.totalPagesData = Math.ceil(this.totalRecordsData / this.pageSizeData);

        this.updateTable(); // ✅ Update table after loading data
      }, error => console.error(error));
      }
    }
  }
  CloseModal1() {
    if (this.modalRef1) {
      this.modalRef1.dismiss();
      this.modalRef1 = null;
      this.isSubmitted = false;
      this.SelectedStudent = {}; 
    }
  }
  
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return `with: ${reason}`;
      }
    }
     exportToExcel(): void {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filterData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'Student_Attendance_SubjectWise_Reports.xlsx');
      }
}
