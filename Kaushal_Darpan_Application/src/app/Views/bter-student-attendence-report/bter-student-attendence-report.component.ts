import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
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
import { LeaveMasterSearchModel } from '../../Models/LeaveMasterDataModel';
import { CommonDDLSubjectMasterModel } from '../../Models/CommonDDLSubjectMasterModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { AttendanceServiceService } from '../../Services/AttendanceServices/attendance-service.service';
import { StaffMasterService } from '../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { AppsettingService } from '../../Common/appsetting.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { LeaveMasterService } from '../../Services/LeaveMaster/leave-master.service';
import { GlobalConstants } from '../../Common/GlobalConstants';


@Component({
  selector: 'app-bter-student-attendence-report',
  standalone: false,
  templateUrl: './bter-student-attendence-report.component.html',
  styleUrl: './bter-student-attendence-report.component.css'
})
export class BterStudentAttendenceReportComponent {
  displayedColumns: string[] = ['SrNo', 'EnrollmentNo', 'StudentName','StreamName', 'SubjectName'];
  /* dynamicColumns: string[] = [];*/

  filterData: any[] = [];
  dynamicColumns: { name: string, locked: boolean }[] = [];

  UserID: number = 0
  RoleID:number=0
  StaffID:number=0
  EditDataFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  StreamMasterDDL: any[] = [];
  StaffMasterList: any[] = [];
  SemesterMasterDDL: any[] = [];
  SubjectMasterDDL: any[] = [];
  GetSectionData: any[] = [];
  subjectsearch = new CommonDDLSubjectMasterModel()
  StudentAttandanceTimeDDL: any[] = [];
  public GetLeaveList: any = [];
  public searchRequest = new LeaveMasterSearchModel();
  TableForm!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  private _liveAnnouncer = inject(LiveAnnouncer);
  dataSource = new MatTableDataSource<any>([]);
  checkedAll: boolean = false;
  // Pagination related variables
  totalRecords: number = 0;
  pageSize: number = 500;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  streamId!: number;
  semesterId!: number;
  sectionId!: number;
  subjectId!: number;
  today: Date = new Date();
  yesterdayDate: string;
  sevenDaysLater: Date = new Date();
  selectedRange: { start: Date, end: Date } | null = null;

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  minEndDate: string | null = null;

  constructor(private swat: SweetAlert2,
    private cdr: ChangeDetectorRef,
    private attendanceServiceService: AttendanceServiceService,
    private fb: FormBuilder,
    private staffMasterService: StaffMasterService,
    private http: HttpClient, private route: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private loaderService: LoaderService,
    private HrMasterService: LeaveMasterService,

  ) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));


      this.RoleID = this.sSOLoginDataModel.RoleID
    this.UserID = this.sSOLoginDataModel.UserID

    if (this.sSOLoginDataModel.RoleID == 8 || this.sSOLoginDataModel.RoleID == 14) {
      this.StaffID = this.sSOLoginDataModel.StaffID
    } else {
      this.StaffID=0
    }


    // Access the route parameters
    this.streamId = parseInt(this.route.snapshot.paramMap.get('streamId') ?? "0");
    this.sectionId = parseInt(this.route.snapshot.paramMap.get('sectionId') ?? "0");
    this.semesterId = parseInt(this.route.snapshot.paramMap.get('semesterId') ?? "0");
    this.subjectId = parseInt(this.route.snapshot.paramMap.get('subjectId') ?? "0");
    this.getMasterData();
    this.getbranchmaster();
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Move to the previous day
    this.yesterdayDate = yesterday.toISOString().split('T')[0];
    this.sevenDaysLater.setDate(this.today.getDate() - 7);
    this.selectedRange = {
      start: this.sevenDaysLater,
      end: this.today
    };
  }

  ngOnInit() {


    this.TableForm = this.fb.group({
      SubjectID: ['', Validators.required],
      AttandanceTimeID: ['', Validators.required],
      StreamID: ['', Validators.required],
      SectionID: ['', Validators.required],
      SemesterID: ['', Validators.required],
      StaffID: [''],
      AttendanceStartDate: [this.selectedRange?.start],
      AttendanceEndDate: [this.selectedRange?.end]
    });

    this.getSubjectMasterDDL(this.streamId, this.semesterId);
    this.GetStudentAttandanceTimeDDL();
    this.GetStaffLeaveAllData();
    this.getstaffmaster();

    this.TableForm.patchValue({
      StreamID: this.streamId,
      SemesterID: this.semesterId,
      SectionID: this.sectionId,
    });
    setTimeout(() => {
      if (this.semesterId > 0) {
        this.TableForm.patchValue({
          SubjectID: this.subjectId
        });
        this.getData();
      }
    }, 1000);

    //const defaultTime = this.StudentAttandanceTimeDDL.find(x => x.Name === '09:00:00 - 10:00:00');
    //if (!this.TableForm.get('AttandanceTimeID')?.value && defaultTime) {
    //  this.TableForm.patchValue({ AttandanceTimeID: defaultTime.ID });
    //}

  }
  get formTable() { return this.TableForm.controls; }

  async getMasterData() {
    try {




      await this.commonMasterService.SemesterRolewise(this.sSOLoginDataModel.UserID,
        this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID
        , this.sSOLoginDataModel.RoleID, this.StaffID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      })

      let obj = {
        SemesterID: this.semesterId,
        StreamID: this.streamId,
        SubjectID: this.subjectId,
        StaffID: this.sSOLoginDataModel.StaffID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      }
      await this.staffMasterService.GetBranchSectionAcRosterData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GetSectionData = data.Data;

        }, (error: any) => console.error(error)
        );




      //let obj = {
      //  Action: "GET_BY_ID",
      //  DepartmentID: this.sSOLoginDataModel.DepartmentID,
      //  EndTermID: this.sSOLoginDataModel.EndTermID,
      //  Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      //  StreamID: this.streamId,
      //}

      //await this.staffMasterService.GetBranchSectionData(obj)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.GetSectionData = data.Data
      //  }, (error: any) => console.error(error)
      //);



      //console.log('Get Section all Data ==>', this.GetSectionData)
      //await this.commonMasterService.GetSubjectMaster(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.SubjectMasterDDL = data.Data;
      //})
    } catch (error) {
      console.error(error);
    }
  }


  async getbranchmaster(SemesterID:number=0){

    await this.commonMasterService.StreamRoleWise(this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID
      , this.sSOLoginDataModel.RoleID, SemesterID, this.sSOLoginDataModel.InstituteID, this.StaffID).then((data: any) => {
    data = JSON.parse(JSON.stringify(data));
    this.StreamMasterDDL = data.Data;
  })
  }



  async getstaffmaster(SemesterID: number = 0) {

    let SSOID = ''
    if (this.sSOLoginDataModel.RoleID == 60 || this.sSOLoginDataModel.RoleID == 61) {
      SSOID = this.sSOLoginDataModel.SSOID

    } else{
      SSOID=''
    }

    await this.commonMasterService.StaffAttendence(SSOID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
      this.StaffMasterList = data.Data;
      })
  }


  async GetStudentAttandanceTimeDDL() {

    await this.commonMasterService.GetStudentAttandanceTimeDDL(this.StaffID, this.TableForm.value.SubjectID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));

      debugger
      this.StudentAttandanceTimeDDL = data.Data;
    })

  }

  getSubjectMasterDDL(ID: any=0, SemesterID: any=0) {
    debugger

    this.subjectsearch.StreamID = ID

    this.subjectsearch.SemesterID = SemesterID
    this.subjectsearch.DepartmentID = 1
    this.subjectsearch.SchemeID = 1348
    this.subjectsearch.RoleID = this.sSOLoginDataModel.RoleID
    this.subjectsearch.UserID = this.sSOLoginDataModel.UserID
    this.subjectsearch.EndTermID = this.sSOLoginDataModel.EndTermID
    this.subjectsearch.StaffID = this.StaffID

  
      this.commonMasterService.GetSubjectMasterDDL_New(this.subjectsearch).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
      })
 


  }



  getSubjectMasterDDL1(ID: any, SemesterID: any) {
    debugger

    this.subjectsearch.StreamID = ID

    this.subjectsearch.SemesterID = SemesterID
    this.subjectsearch.DepartmentID = 1
    this.subjectsearch.SchemeID = 1348
    this.subjectsearch.RoleID = this.sSOLoginDataModel.RoleID
    this.subjectsearch.UserID = this.sSOLoginDataModel.UserID
    this.subjectsearch.EndTermID = this.sSOLoginDataModel.EndTermID
    this.subjectsearch.StaffID = this.StaffID
  
      this.commonMasterService.GetSubjectMasterDDL_New(this.subjectsearch).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
      })
   
     this.getbranchmaster(SemesterID)
  }

  async GetStaffLeaveAllData() {
    try {
      debugger
      const rawStart = this.TableForm.value.AttendanceStartDate;
      const rawEnd = this.TableForm.value.AttendanceEndDate;

      // Parse correctly whether string or Date
      const dateStart = new Date(rawStart instanceof Date ? rawStart : new Date(rawStart));
      dateStart.setDate(dateStart.getDate() + 1);
      const formattedDateStart = dateStart.toISOString().split('T')[0];

      const dateEnd = new Date(rawEnd instanceof Date ? rawEnd : new Date(rawEnd));
      dateEnd.setDate(dateEnd.getDate() + 1);
      const formattedDateEnd = dateEnd.toISOString().split('T')[0];

      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.searchRequest.StaffID = this.StaffID;
      this.searchRequest.From_Date = formattedDateStart;
      this.searchRequest.To_Date = formattedDateEnd;


      this.loaderService.requestStarted();
      await this.HrMasterService.ByIDStaffLeaveList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.GetLeaveList = data['Data'];

          console.log(this.GetLeaveList, "Get Leave List")

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

  //async GetAttendanceTimeTable() {
  //  try {
  //    debugger;

  //    const rawStart = this.TableForm.value.AttendanceStartDate;
  //    const rawEnd = this.TableForm.value.AttendanceEndDate;

  //    // Parse correctly whether string or Date
  //    const dateStart = new Date(rawStart instanceof Date ? rawStart : new Date(rawStart));
  //    dateStart.setDate(dateStart.getDate() + 1);
  //    const formattedDateStart = dateStart.toISOString().split('T')[0];

  //    const dateEnd = new Date(rawEnd instanceof Date ? rawEnd : new Date(rawEnd));
  //    dateEnd.setDate(dateEnd.getDate() + 1);
  //    const formattedDateEnd = dateEnd.toISOString().split('T')[0];

  //    let obj = {
  //      SemesterID: this.TableForm.value.SemesterID,
  //      EndTermID: this.sSOLoginDataModel.EndTermID,
  //      InstituteID: this.sSOLoginDataModel.InstituteID,
  //      DepartmentID: this.sSOLoginDataModel.DepartmentID,
  //      CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
  //      StreamID: this.TableForm.value.StreamID,
  //      SectionID: this.TableForm.value.SectionID,
  //      SubjectID: this.TableForm.value.SubjectID,
  //      AttendanceStartDate: formattedDateStart,
  //      AttendanceEndDate: formattedDateEnd,
  //      StaffID: this.sSOLoginDataModel.StaffID,
  //      TimeDDLID: this.TableForm.value.AttandanceTimeID || 0,
  //    };

  //    this.filterData = [];

  //    await this.attendanceServiceService.GetStudentAttendance(obj).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data['Data']));
  //      this.filterData = data;

  //      const leaveDates = this.getLeaveDates(this.GetLeaveList); // e.g., ['2025-10-06', '2025-10-09']

  //      if (this.filterData.length > 0) {
  //        this.dynamicColumns = [];
  //        this.displayedColumns = ['SrNo', 'EnrollmentNo', 'StudentName', 'SubjectName', 'SectionName'];

  //        this.dynamicColumns = Object.keys(this.filterData[0])
  //          .filter(key => ![
  //            'SectionID', 'SectionName', 'EnrollmentNo', 'SemesterName', 'StreamName', 'StudentName', 'SubjectName',
  //            'SemesterID', 'StreamID', 'SubjectID', 'SubjectID1', 'InstituteID', 'AttendanceDate', 'Attendance',
  //            'EndTermID', 'CourseTypeID', 'StudentID'
  //          ].includes(key))
  //          .map(key => {
  //            const dateMatch = key.match(/\d{4}-\d{2}-\d{2}/); // Extract date from column name
  //            const isLeaveDate = dateMatch ? leaveDates.includes(dateMatch[0]) : false;
  //            return { name: key, locked: isLeaveDate };
  //          });
  //          debugger
  //        this.filterData.forEach(student => {
  //          this.dynamicColumns.forEach(col => {
  //            const dateMatch = col.name.match(/\d{4}-\d{2}-\d{2}/); // Extract date from column name
  //            if (dateMatch) {
  //              const colDate = dateMatch[0];
  //              if (leaveDates.includes(colDate)) {
  //                // Freeze the student attendance as Holiday for this leave date
  //                //student[col.name] = 'H';
  //                student[col.name] = 'TL';
  //              } else {
  //                if (!student[col.name]) {
  //                  student[col.name] = col.locked ? 'H' : 'A';
  //                }
  //              }
  //            } else {
  //              if (!student[col.name]) {
  //                student[col.name] = col.locked ? 'H' : 'A';
  //              }
  //            }
  //          });
  //        });

  //        this.displayedColumns = [
  //          ...this.displayedColumns,
  //          ...this.dynamicColumns.map(c => c.name)
  //        ];
  //      }



  //      this.dataSource.data = this.filterData;
  //      this.dataSource.sort = this.sort;
  //      this.totalRecords = this.filterData.length;
  //      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  //      this.updateTable();
  //    }, error => console.error(error));

  //  } catch (Ex) {
  //    console.log(Ex);
  //  }
  //}
  formatDate(value: any): string {
    if (!value) return '';

    const d = value instanceof Date ? value : new Date(value);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  async GetAttendanceTimeTable() {
    try {
      debugger;

      const rawStart = this.TableForm.value.AttendanceStartDate;
      const rawEnd = this.TableForm.value.AttendanceEndDate;

      // Parse correctly whether string or Date
      const formattedDateStart =
        typeof rawStart === 'string'
          ? rawStart
          : this.formatDate(rawStart);

      const formattedDateEnd =
        typeof rawEnd === 'string'
          ? rawEnd
          : this.formatDate(rawEnd);

      let obj = {
        SemesterID: this.TableForm.value.SemesterID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        InstituteID: this.sSOLoginDataModel.InstituteID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        StreamID: this.TableForm.value.StreamID,
        SectionID: this.TableForm.value.SectionID,
        SubjectID: this.TableForm.value.SubjectID,
        AttendanceStartDate: formattedDateStart,
        AttendanceEndDate: formattedDateEnd,
        StaffID: this.StaffID,
        TimeDDLID: this.TableForm.value.AttandanceTimeID || 0,
      };

      this.filterData = [];

      await this.attendanceServiceService.GetStudentAttendanceReport(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data['Data']));
        this.filterData = data;

        const leaveDates = this.getLeaveDates(this.GetLeaveList); // e.g. ['2025-11-06', '2025-11-09']

        if (this.filterData.length > 0) {
          this.dynamicColumns = [];
          this.displayedColumns = ['SrNo', 'EnrollmentNo', 'StudentName','StreamName' ,'SubjectName', 'SectionName'];

          // Generate dynamic columns
          this.dynamicColumns = Object.keys(this.filterData[0])
            .filter(key => ![
              'SectionID', 'SectionName', 'EnrollmentNo', 'SemesterName', 'StreamName', 'StudentName', 'SubjectName',
              'SemesterID', 'StreamID', 'SubjectID', 'SubjectID1', 'InstituteID', 'AttendanceDate', 'Attendance',
              'EndTermID', 'CourseTypeID', 'StudentID'
            ].includes(key))
            .map(key => {
              const dateMatch = key.match(/\d{4}-\d{2}-\d{2}/); // Extract date from column name
              const isLeaveDate = dateMatch ? leaveDates.includes(dateMatch[0]) : false;
              return { name: key, locked: isLeaveDate };
            });

          // Apply attendance logic
          this.filterData.forEach((student: any) => {
            this.dynamicColumns.forEach((col: any) => {

              const key = col.name;
              const rawValue = student[key];

              const attendanceValue = rawValue == null
                ? ''
                : rawValue.toString().trim().toUpperCase();

              if (attendanceValue === 'A') {
                student[key] = 'Absent';
              }
              else if (attendanceValue === 'P' || attendanceValue === 'O') {
                student[key] = 'Present';
              }
              else if (attendanceValue === 'H') {
                student[key] = 'Holiday';
              }
              else if (attendanceValue === 'TL') {
                student[key] = 'Leave (TL)';
              }
              else {
                student[key] = '';
              }

            });
          });

          this.displayedColumns = [
            ...this.displayedColumns,
            ...this.dynamicColumns.map(c => c.name)
          ];
        }

        this.dataSource.data = this.filterData;
        this.dataSource.sort = this.sort;
        this.totalRecords = this.filterData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.updateTable();
      }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }
  }

  // ✅ Disable slide toggle when column is locked or value is 'TL'
  isToggleDisabled(element: any, columnName: string): boolean {
    return this.isColumnLocked(columnName) || element[columnName] === 'TL';
  }

  // ✅ Example helper (if not already defined)
  isColumnLocked(columnName: string): boolean {
    const col = this.dynamicColumns.find(c => c.name === columnName);
    return col ? col.locked : false;
  }


  private getLeaveDates(leaveList: any[]): string[] {
    const leaveDates: string[] = [];

    leaveList.forEach(leave => {
      const fromDate = new Date(leave.From_Date);
      const toDate = new Date(leave.To_Date);

      for (let dt = new Date(fromDate); dt <= toDate; dt.setDate(dt.getDate() + 1)) {
        leaveDates.push(dt.toISOString().split('T')[0]);
      }
    });

    return leaveDates;
  }

  // Method to handle attendance change (can be customized)
  onAttendanceChange(event: any, element: any, column: string) {
    debugger
    const attendanceStatus = event.checked ? 'P' : 'A';
    element[column] = attendanceStatus;
    console.log(`${element.StudentName}'s attendance for ${column} changed to ${attendanceStatus}`);
  }

  // Method to toggle all attendance for a specific column to 'Present'
  toggleAllAttendanceForColumn(column: string, checked: boolean) {
    debugger
    this.dataSource.data.forEach((row: { [x: string]: string; }) => {
      row[column] = checked ? 'P' : 'A'; // Set all attendance to 'P' or 'A'
    });
  }

  getData() {
    debugger
    this.isSubmitted = true;

    this.GetStudentAttandanceTimeDDL();
    this.GetStaffLeaveAllData();

   


      this.GetAttendanceTimeTable();
    
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.updateTable();  // Update table when pagination changes
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

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filterData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Student_Attendance_Reports.xlsx');
  }

  public downloadPDF() {
    const margin = 10;
    const pageWidth = 210 - 2 * margin;
    const pageHeight = 200 - 2 * margin;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [210, 300],
    });

    const pdfTable = this.pdfTable.nativeElement;

    doc.html(pdfTable, {
      callback: function (doc) {
        doc.save('Report.pdf');
      },
      x: margin,
      y: margin,
      width: pageWidth,
      windowWidth: pdfTable.scrollWidth,
    });
  }

  DownloadFile(FileName: string, DownloadfileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }




  saveAttendance() {
    this.swat.Confirmation("Are you sure you want to save the attendance?", (result: any) => {
      if (!result.isConfirmed) return;

      let saveAttendanceData: any[] = this.dataSource.filteredData;
      debugger;

      this.sectionId = this.TableForm.value.SectionID;

      const attendanceData = {
        EndTermID: this.sSOLoginDataModel.EndTermID,
        SemesterID: this.TableForm.value.SemesterID,
        StreamID: this.TableForm.value.StreamID,
        SectionID: this.sectionId,
        SubjectID: this.TableForm.value.SubjectID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        InstituteID: this.sSOLoginDataModel.InstituteID,
        AssignTeacherForSubjectID: this.sSOLoginDataModel.RoleID,
        StaffID: this.sSOLoginDataModel.StaffID
      };

      saveAttendanceData.forEach(item => {
        Object.assign(item, attendanceData);
        const attendanceArray: any[] = [];

        Object.keys(item).forEach(key => {
          const skipKeys = [
            'SectionID', 'SectionName', 'DepartmentID', 'SemesterName', 'StreamName', 'EnrollmentNo',
            'StudentName', 'SubjectName', 'EndTermID', 'SemesterID', 'StreamID', 'SubjectID',
            'CourseTypeID', 'AssignTeacherForSubjectID', 'SubjectID1', 'AttendanceDate', 'Attendance',
            'InstituteID', 'StudentID', 'StaffID'
          ];

          if (!skipKeys.includes(key)) {
            //  Remove (Working Day) / (Holiday) prefix → keep only yyyy-mm-dd
            const cleanedDate = key.replace(/\(.*?\)\s*/g, '').trim();

            attendanceArray.push({
              Date: cleanedDate,
              Status: item[key] || null
            });

            delete item[key];
          }
        });

        item.Attendance = attendanceArray;
      });

      console.log('Prepared data for saving:', saveAttendanceData);

      this.attendanceServiceService.saveAttendanceData(saveAttendanceData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.Data == 1) {
            this.GetAttendanceTimeTable();
            this.toastr.success(data.Message);
            this.checkedAll = false;
          }
        }, error => console.error(error));

    });
  }


  toggleAllAttendance() {
    debugger
    const attendanceStatus = this.checkedAll ? 'P' : 'A';
    this.dataSource.data.forEach((element: { Attendance: string; }) => {
      element.Attendance = attendanceStatus;
    });
  }


  async ChangeSubjectDDL() {

    debugger
    const GetSemesterID = this.TableForm.get('SemesterID')?.value;
    const GetstreamId = this.TableForm.get('StreamID')?.value;
    const GetSubjectID = this.TableForm.get('SubjectID')?.value;

    debugger
    let obj = {
      SemesterID: GetSemesterID,
      StreamID: GetstreamId,
      SubjectID: GetSubjectID,
      StaffID: this.StaffID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
    }
    await this.staffMasterService.GetBranchSectionAcRosterData(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetSectionData = data.Data;

      }, (error: any) => console.error(error)
      );


    //let obj = {
    //  Action: "GET_BY_ID",
    //  DepartmentID: this.sSOLoginDataModel.DepartmentID,
    //  EndTermID: this.sSOLoginDataModel.EndTermID,
    //  Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
    //  StreamID: StreamID,
    //}
    // this.staffMasterService.GetBranchSectionData(obj)
    //  .then((data: any) => {
    //    data = JSON.parse(JSON.stringify(data));
    //    this.GetSectionData = data.Data
    //  }, (error: any) => console.error(error)
    //);



    this.GetStudentAttandanceTimeDDL()


  }


  async sectionDDlAcRoster() {



  }



  lockColumn(columnName: string) {
    this.swat.Confirmation("Are you sure you want to lock this column?", (result: any) => {
      if (!result.isConfirmed) return;

      const col = this.dynamicColumns.find(c => c.name === columnName);
      if (col) {
        col.locked = true;
        this.dataSource.data = [...this.dataSource.data];
        this.cdr.detectChanges();
      }
    });
  }

  unlockColumn(columnName: string) {
    this.swat.Confirmation("Are you sure you want to unlock this column?", (result: any) => {
      if (!result.isConfirmed) return;
      const col = this.dynamicColumns.find(c => c.name === columnName);
      if (col) {
        col.locked = false;
        this.dataSource.data.forEach((row: any) => {
          if (row[columnName] === 'H') row[columnName] = 'A';
        });
        this.dataSource.data = [...this.dataSource.data];
        this.cdr.detectChanges();
      }
    });
  }

  //isColumnLocked(columnName: string): boolean {
  //  const col = this.dynamicColumns.find(c => c.name === columnName);
  //  return col ? col.locked : true;
  //}


  openDatePicker(event: any) {
    event.target.showPicker();
  }


  onStartDateChange(event: any) {

    const startDate = event.target.value;
    if (startDate) {
      this.minEndDate = startDate; // set min for end date
      const endDate = this.TableForm.value.AttendanceEndDate;

      // if already selected end date is smaller, reset it
      if (endDate && endDate < startDate) {
        this.TableForm.patchValue({ AttendanceEndDate: '' });
      }
    }
  }


  async OnStaffChange(row: any) {
    debugger


      const id = Number(row);

    if (id > 0) {
      this.StaffID = id
    } else {
      this.StaffID = 0

     
    }



    this.getMasterData()
    this.getbranchmaster()
    this.getSubjectMasterDDL()
    this.GetStudentAttandanceTimeDDL();







    //  if (id > 0) {
    //    this.UserID=
    //    const staff = this.StaffMasterList.find((x: any) => Number(x.StaffID) === id);

    //    const UserID = staff.UserID

    //    let RoleID = 0
    //    if (this.sSOLoginDataModel.Eng_NonEng == 1) {
    //      RoleID = 8
    //    } else {
    //      RoleID = 14
    //    }
    //    this.StaffID = id
    //    this.RoleID = RoleID
    //    this.UserID = UserID
    //    await this.commonMasterService.SemesterRolewise(UserID,
    //      this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID
    //      , RoleID).then((data: any) => {
    //        data = JSON.parse(JSON.stringify(data));
    //        this.SemesterMasterDDL = data.Data;
    //      })

    //    let obj = {
    //      SemesterID: this.semesterId,
    //      StreamID: this.streamId,
    //      SubjectID: this.subjectId,
    //      StaffID: id,
    //      DepartmentID: this.sSOLoginDataModel.DepartmentID,
    //      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
    //    }
    //    await this.staffMasterService.GetBranchSectionAcRosterData(obj)
    //      .then((data: any) => {
    //        data = JSON.parse(JSON.stringify(data));
    //        this.GetSectionData = data.Data;

    //      }, (error: any) => console.error(error)
    //    );


    //    await this.commonMasterService.StreamRoleWise(UserID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID
    //      , RoleID, this.TableForm.value.SemesterID, this.sSOLoginDataModel.InstituteID).then((data: any) => {
    //        data = JSON.parse(JSON.stringify(data));
    //        this.StreamMasterDDL = data.Data;
    //      })


    //  } else {

    //    this.getMasterData()
    //    this.getbranchmaster()
    //  }
    //}
  }
}
