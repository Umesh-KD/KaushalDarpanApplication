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
import { AddStaffSubjectSectionModel, BranchHODModel, GetHODWiseSemesterDataModel, PostAttendanceTimeTable } from '../../Models/StaffMasterDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../Services/Student/student.service';

@Component({
  selector: 'app-bter-assign-teacher',
  standalone: false,
  templateUrl: './bter-assign-teacher.component.html',
  styleUrl: './bter-assign-teacher.component.css'
})
export class BterAssignTeacherComponent {
  displayedColumns: string[] = ['SrNo', 'EnrollmentNo', 'StudentName', 'StreamName', 'SubjectName', 'SectionName', 'PresentDays', 'TotalWorkingDays', 'TotalPercent'];
  /* dynamicColumns: string[] = [];*/
  public StudentList: any[] = [];
  filterData: any[] = [];
  dynamicColumns: { name: string, locked: boolean }[] = [];
  AddStaffSubjectSectionModel = new AddStaffSubjectSectionModel();
  SSOIDExists: boolean = false;
  public oldSemesterID: number = 0;
  public oldStreamID: number = 0;
  UserID: number = 0
  RoleID: number = 0
  StaffID: number = 0
  EditIndex: number = -1;
  EditRowID: number = -1;
  IsEditMode: boolean = false;
  postItem = new PostAttendanceTimeTable();
  EditDataFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  StreamMasterDDL: any[] = [];
  StaffMasterList: any[] = [];
  SemesterMasterDDL: any[] = [];
  SubjectMasterDDL: any[] = [];
  GetSectionData: any[] = [];
  subjectsearch = new CommonDDLSubjectMasterModel()
  StudentAttandanceTimeDDL: any[] = [];
  AddStaffSubjectSectionModelList: any[] = [];
  AddStaffSubjectSectionModelList1: any[] = [];
 HistoryList1: any[] = [];
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


  GetBranchSectionData: any = [];
  GetBranchStudentList: any = [];
  GetBranchStreamData: any = [];
  resBranchHOD: any = [];
  GetBranchSectionStudentData: any[] = [];
  ApprovedTeacherList: any[] = [];
  allSections: any[] = [];

  isEdit = false;
  iSHOD = false;
  IIPMasterFormGroup!: FormGroup;

  requestBranchHOD = new BranchHODModel();

  AddStaffSubjectAllSectionModelList: AddStaffSubjectSectionModel[] = [];
  PostAttendanceTimeTableList: PostAttendanceTimeTable[] = [];

  sectionForm!: FormGroup;
  totalRecord = 0;
  totalRecord1 = 0;
  totalRecord2 = 0;
  totalStudents = 0;
  sectionSize = 0;
  TusectionSize = 0;
  PsectionSize = 0;
  streamName = '';
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: number = 0;


  availSectionData: any[] = [];

  GetdataHODWiseSemester: any[] = [];


  displayedColumns1: string[] = [
    'SNo',
    'SectionName',
    'StudentCount',
    'StreamName',
    'CreatedDate',
    'actions'
  ];
  displayedColumns2: string[] = [
    'SNo',
    // 'ApplicationID',
    'EnrollmentNo',
    'StudentName',
    'SectionName',
    'StreamName',
    'CreatedDate'
  ];

  dataSource1!: MatTableDataSource<any>;
  dataSource2!: MatTableDataSource<any>;
  @ViewChild('mainPaginator') paginator!: MatPaginator;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  modalReference: NgbModalRef | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  closeResult: string | undefined;
  modalRef1: NgbModalRef | null = null;
  modalRef2: NgbModalRef | null = null;
  public IsBranch: boolean = false;


  public GetHODWiseSemester = new GetHODWiseSemesterDataModel();

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

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
    private StudentService: StudentService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,

  ) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));


    this.RoleID = this.sSOLoginDataModel.RoleID
    this.UserID = this.sSOLoginDataModel.UserID

    if (this.sSOLoginDataModel.RoleID == 8 || this.sSOLoginDataModel.RoleID == 14) {
      this.StaffID = this.sSOLoginDataModel.StaffID
    } else {
      this.StaffID = 0
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

async  ngOnInit() {


    this.TableForm = this.fb.group({
      SubjectID: ['', Validators.required],
      AttandanceTimeID: ['', Validators.required],
      StreamID: ['', Validators.required],
      SectionID: ['', Validators.required],
      SemesterID: ['', Validators.required],
      StaffID: [''],
      Percent: [''],
      AttendanceStartDate: [this.selectedRange?.start],
      AttendanceEndDate: [this.selectedRange?.end]
    });


    this.EditDataFormGroup = this.fb.group({
      ID: [''],
      SubjectID: [0, Validators.required],
      //AssignToSSOID: ['', Validators.required],
      StreamID: ['', Validators.required],
      SectionID: [0, Validators.required],
      AssignbyStaffID: [0, Validators.required],
      SemesterID: [{ value: 0, }, Validators.required],
      //  StreamID: [0, Validators.required]
    });


    this.getSubjectMasterDDL(this.streamId, this.semesterId);
    this.GetStudentAttandanceTimeDDL();
    this.GetStaffLeaveAllData();
    this.getstaffmaster();
  this.GetAssignedTeacherForSubject();
 

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


  async getbranchmaster(SemesterID: number = 0) {

    await this.commonMasterService.StreamRoleWise(this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID
      , this.sSOLoginDataModel.RoleID, SemesterID, this.sSOLoginDataModel.InstituteID, this.StaffID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      })
  }



  async getstaffmaster(SemesterID: number = 0) {

    let SSOID = ''
    let RoleID = 0

    SSOID = this.sSOLoginDataModel.SSOID
    RoleID = this.sSOLoginDataModel.RoleID





    await this.commonMasterService.StaffAttendence(SSOID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.InstituteID, RoleID).then((data: any) => {
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

  getSubjectMasterDDL(ID: any = 0, SemesterID: any = 0) {
    debugger

    this.subjectsearch.StreamID = ID

    this.subjectsearch.SemesterID = SemesterID
    this.subjectsearch.DepartmentID = 1
    this.subjectsearch.SchemeID = 1348
    this.subjectsearch.RoleID = this.sSOLoginDataModel.RoleID
    this.subjectsearch.UserID = this.sSOLoginDataModel.UserID
    this.subjectsearch.EndTermID = this.sSOLoginDataModel.EndTermID
    this.subjectsearch.StaffID = this.StaffID


    this.commonMasterService.Get_SubjectMasterByCondition(this.subjectsearch).then((data: any) => {
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

    this.commonMasterService.Get_SubjectMasterByCondition(this.subjectsearch).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SubjectMasterDDL = data.Data;
    })

    this.getbranchmaster(SemesterID)
   
  }


  getSubjectMasterDDL2(ID: any, SemesterID: any) {
    debugger

    this.subjectsearch.StreamID = ID

    this.subjectsearch.SemesterID = SemesterID
    this.subjectsearch.DepartmentID = 1
    this.subjectsearch.SchemeID = 1348
    this.subjectsearch.RoleID = this.sSOLoginDataModel.RoleID
    this.subjectsearch.UserID = this.sSOLoginDataModel.UserID
    this.subjectsearch.EndTermID = this.sSOLoginDataModel.EndTermID
    this.subjectsearch.StaffID = this.StaffID

    this.commonMasterService.Get_SubjectMasterByCondition(this.subjectsearch).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SubjectMasterDDL = data.Data;
    })

    this.getbranchmaster(SemesterID)
    this.ChangeSubjectDDL1()
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
        SubjectID: this.TableForm.value.SubjectID || 0,
        AttendanceStartDate: formattedDateStart,
        AttendanceEndDate: formattedDateEnd,
        StaffID: this.StaffID,
        TimeDDLID: this.TableForm.value.AttandanceTimeID || 0,
        Percent: this.TableForm.value.Percent || 0,
      };

      this.filterData = [];

      await this.attendanceServiceService.GetStudentAttendancePercentReport(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data['Data']));
        this.filterData = data;

        const leaveDates = this.getLeaveDates(this.GetLeaveList); // e.g. ['2025-11-06', '2025-11-09']

        if (this.filterData.length > 0) {
          this.dynamicColumns = [];
          this.displayedColumns = ['SrNo', 'EnrollmentNo', 'StudentName', 'StreamName', 'SubjectName', 'SectionName', 'PresentDays', 'TotalWorkingDays', 'TotalPercent'];

          // Generate dynamic columns



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





    this.GetAssignedTeacherForSubject();

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

  async ChangeSubjectDDL1() {


    const GetSemesterID = this.EditDataFormGroup.get('SemesterID')?.value;
    const GetstreamId = this.EditDataFormGroup.get('StreamID')?.value;
    const GetSubjectID = this.EditDataFormGroup.get('SubjectID')?.value;

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



  async GetAssignedTeacherForSubjectHistory(Content:any,ID:number=0) {
    //debugger
   
    
    ;
    try {
      this.HistoryList1 = []
      let obj = {
        SectionID: this.TableForm.value.SectionID,
        SubjectID: this.TableForm.value.SubjectID,
        StreamID: this.TableForm.value.StreamID,
        SemesterID: this.TableForm.value.SemesterID,
        EndtermID: this.sSOLoginDataModel.EndTermID,
        InstituteId: this.sSOLoginDataModel.InstituteID,
        SSOID: this.sSOLoginDataModel.SSOID,
        ID:ID
      }
      //get all data
      //debugger
      await this.staffMasterService.GetAssignedTeacherForSubject_History(obj).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data['Data']));
        //debugger
        if (data.length > 0) {
          // this.toastr.success(data.Message)

          if (ID > 0) {
            this.HistoryList1 = data
          } else {



            this.HistoryList1 = data
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
    this.modalService.open(Content, {

      size: 'xl',

      ariaLabelledBy: 'modal-basic-title',

      backdrop: 'static'

    }).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

    }, (reason: any) => {

      this.closeResult =
        `Dismissed ${this.getDismissReason(reason)}`;
    })
  }


  async GetAssignedTeacherForSubject(ID: number = 0) {
    //debugger

    debugger
    ;
    try {
      this.AddStaffSubjectSectionModelList = []
      let obj = {
        SectionID: this.TableForm.value.SectionID,
        SubjectID: this.TableForm.value.SubjectID,
        StreamID: this.TableForm.value.StreamID,
        SemesterID: this.TableForm.value.SemesterID,
        EndtermID: this.sSOLoginDataModel.EndTermID,
        InstituteId: this.sSOLoginDataModel.InstituteID,
        SSOID: this.sSOLoginDataModel.SSOID,
        ID: ID
      }
      //get all data
      //debugger
      await this.staffMasterService.GetAssignedTeacherForSubject_BySecctionID(obj).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data['Data']));
        //debugger
        if (data.length > 0) {
          // this.toastr.success(data.Message)

          if (ID > 0) {
            this.AddStaffSubjectSectionModelList1 = data
          } else {



            this.AddStaffSubjectSectionModelList = data
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }






  async AddStaffData(content: any, rowData: any = null) {

    debugger;

    // ============================
    // RESET LIST FOR NEW ENTRY
    // ============================

    this.AddStaffSubjectSectionModelList1 = [];

    // ============================
    // CHECK EDIT MODE
    // ============================

    if (rowData && rowData.ID > 0) {

      this.IsEditMode = true;

      this.EditRowID = rowData.ID;

      this.AddStaffSubjectSectionModel.SubjectID =
        rowData?.SubjectID || 0;

      this.AddStaffSubjectSectionModel.StaffID =
        rowData?.StaffID || 0;

      this.AddStaffSubjectSectionModel.SemesterID =
        rowData?.SemesterID || 0;

      this.AddStaffSubjectSectionModel.StreamID =
        rowData?.StreamID || 0;

    } else {

      this.IsEditMode = false;

      this.EditRowID = 0;
    }

    // ============================
    // LOAD DROPDOWNS
    // ============================

    this.loadDropdownData();

    // ============================
    // EDIT DATA
    // ============================



    // ============================
    // STREAM LOAD
    // ============================

    await this.commonMasterService
      .StreamMasterwithcount(
        this.sSOLoginDataModel.DepartmentID,
        this.sSOLoginDataModel.Eng_NonEng,
        this.sSOLoginDataModel.EndTermID,
        this.AddStaffSubjectSectionModel.SemesterID,
        this.sSOLoginDataModel.InstituteID
      )
      .then((data: any) => {

        data = JSON.parse(JSON.stringify(data));

        this.StudentList = this.StreamMasterDDL
          .map((x: any) => x.students)
          .filter(Boolean)
          .join(',')
          .split(',')
          .map((s: any) => s.trim());

        console.log('data ==>', this.StreamMasterDDL);
      });

    // ============================
    // PATCH FORM IN EDIT MODE
    // ============================

    if (rowData && rowData.ID > 0) {

      const selectedSections =
        rowData.SectionIDs
          ? rowData.SectionIDs
            .split(',')
            .map((x: string) => Number(x))
          : [];

      this.EditDataFormGroup.patchValue({

        ID: rowData.ID,

        SubjectID: rowData.SubjectID,

        AssignToSSOID: rowData.AssignToSSOID,

        StreamID: rowData.StreamID,

        SemesterID: rowData.SemesterID,

        SectionID: selectedSections,

        AssignbyStaffID: rowData.StaffID
      });

      this.oldSemesterID =
        rowData.SemesterID;

      this.oldStreamID =
        rowData.StreamID;

      await this.ChangeSubjectDDL1();

      await this.getSubjectMasterDDL(
        rowData.StreamID,
        rowData.SemesterID
      );

      this.refreshAvailableSections();
    }

    // ============================
    // NEW ADD MODE
    // ============================

    else {

      this.isSubmitted = false;

      this.EditDataFormGroup.reset({

        ID: 0,

        SubjectID: 0,

        AssignToSSOID: '',

        SectionID: [],

        AssignbyStaffID: 0
      });

      this.AddStaffSubjectSectionModel =
        new AddStaffSubjectSectionModel();

      this.oldSemesterID = 0;

      this.oldStreamID = 0;
    }

    // ============================
    // OPEN MODAL
    // ============================

    this.modalService.open(content, {

      size: 'xl',

      ariaLabelledBy: 'modal-basic-title',

      backdrop: 'static'

    }).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

    }, (reason: any) => {

      this.closeResult =
        `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async getstreamedit() {


    await this.commonMasterService.StreamMasterwithcount(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID,
      this.AddStaffSubjectSectionModel.SemesterID, this.sSOLoginDataModel.InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
      
        //this.StreamMasterDDL = this.StreamMasterDDL.filter((item: any) => item.StreamTypeID = this.sSOLoginDataModel.Eng_NonEng && item.SemesterID == formSemesterID && item.InstituteId == this.sSOLoginDataModel.InstituteID)
        // split
        this.StudentList = this.StreamMasterDDL
          .map((x: any) => x.students)      // Get array of comma-separated strings
          .filter(Boolean)                  // Remove null/undefined
          .join(',')                        // Join into one string
          .split(',')                      // Split by comma into array
          .map((s: any) => s.trim());             // Trim spaces if needed
        console.log('data ==>', this.StreamMasterDDL)
      })


  }

  refreshAvailableSections() {
    // collect all used section IDs
    //debugger
    const usedIds = this.AddStaffSubjectSectionModelList
      .flatMap(x => (x.SectionIDs ? x.SectionIDs.split(',').map(Number) : []));

    // filter sections
    // this.GetSectionData = this.GetSectionData.filter(sec => !usedIds.includes(sec.SectionID));
  }

  refreshAvailableSections1(subjectId: number) {
    if (!subjectId || subjectId === 0) {
      return;
    }
    //debugger
    const DepartmentID = this.sSOLoginDataModel.DepartmentID;
    const EndTermID = this.sSOLoginDataModel.EndTermID;
    const Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    const StreamID = this.AddStaffSubjectSectionModel.StreamID;
    const SemesterID = this.AddStaffSubjectSectionModel.SemesterID;
    let obj = {
      DepartmentID: DepartmentID,
      EndTermID: EndTermID,
      StreamID: StreamID,
      SemesterID: SemesterID
      // SubjectID:subjectId
    }
    // Call your service which hits backend API/SP
    try {
      this.StudentService.getdublicateCheckSection(obj)
        .then((data: any) => {
          // data = JSON.parse(JSON.stringify(data['Data']));
          // const availSectionData = data;
          // parse response
          this.availSectionData = JSON.parse(JSON.stringify(data['Data'])) || [];
          //this.availSectionData = JSON.parse(JSON.stringify(data['Data'])) || [];

          // extract SectionIDs into a simple number[] list
          const usedIds = this.availSectionData.map(x => Number(x.SectionID));

          console.log("Used Section IDs:", usedIds);

          // filter allSections to exclude already used ones
          this.GetSectionData = this.allSections.filter(sec => !usedIds.includes(sec.SectionID));

          console.log("Filtered Sections:", this.GetSectionData);
          this.refreshAvailableSections();

        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
      console.error("Error loading sections:", Ex);
      this.toastr.error('Failed to load sections');
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

  CloseModal() {

    this.modalService.dismissAll()
      this.modalRef1 = null;
      this.isSubmitted = false;
    this.getSubjectMasterDDL(this.streamId, this.semesterId);
    this.GetStudentAttandanceTimeDDL();
    this.GetStaffLeaveAllData();
    this.getstaffmaster();
    this.getMasterData();
    this.getbranchmaster();
    this.TableForm.reset()
  }

  // Global Variables

  AddToList() {

    debugger;

    this.isSubmitted = true;

    if (this.EditDataFormGroup.invalid) {
      return;
    }

    const formValue = this.EditDataFormGroup.value;

    const selectedSections = formValue.SectionID || [];

    const newItem = new AddStaffSubjectSectionModel();

    // =========================
    // PRESERVE ID DURING EDIT
    // =========================

    if (this.IsEditMode) {

      newItem.ID = this.EditRowID;

    } else {

      newItem.ID =
        0
    }

    // =========================
    // ASSIGN IDS
    // =========================

    newItem.StreamID =
      this.AddStaffSubjectSectionModel.StreamID;

    newItem.SemesterID =
      this.AddStaffSubjectSectionModel.SemesterID;

    newItem.SubjectID =
      this.AddStaffSubjectSectionModel.SubjectID;

    newItem.StaffID =
      this.AddStaffSubjectSectionModel.StaffID;

    // =========================
    // SECTION IDS
    // =========================

    newItem.SectionIDs =
      selectedSections.join(',');

    // =========================
    // ASSIGN NAMES
    // =========================

    newItem.StreamName =
      this.StreamMasterDDL.find(
        (x: any) => x.StreamID == newItem.StreamID
      )?.StreamName || '';

    newItem.SemesterName =
      this.SemesterMasterDDL.find(
        (x: any) => x.SemesterID == newItem.SemesterID
      )?.SemesterName || '';

    newItem.SubjectName =
      this.SubjectMasterDDL.find(
        (x: any) => x.ID == newItem.SubjectID
      )?.Name || '';

    newItem.SatffName =
      this.ApprovedTeacherList.find(
        (x: any) => x.StaffID == newItem.StaffID
      )?.Name || '';

    newItem.SectionsName =
      this.GetSectionData
        .filter((x: any) =>
          selectedSections.includes(x.ID)
        )
        .map((x: any) => x.Name)
        .join(', ');

    // =========================
    // DUPLICATE CHECK
    // =========================

    let duplicateFound = false;

    let duplicateSectionNames: string[] = [];

    for (const secID of selectedSections) {

      // =====================================
      // CHECK DB ONLY DURING ADD
      // =====================================

      let existsInAllSection = false;


      debugger
      if (!this.IsEditMode && this.EditRowID == 0) {

        existsInAllSection =
          this.AddStaffSubjectSectionModelList.some(
            (x: any) => {

              const existingSectionIDs =
                (x.SectionIDs || x.SectionID || '')
                  .toString()
                  .split(',')
                  .map((id: string) => id.trim());

              return (
                x.SubjectID == newItem.SubjectID &&
                existingSectionIDs.includes(
                  String(secID)
                )
              );
            });
      }

      // =====================================
      // CHECK TEMP LIST
      // =====================================

      const existsInTempList =
        this.AddStaffSubjectSectionModelList1.some(
          (x: any) => {

            // Skip same row during edit

            if (
              this.IsEditMode &&
              x.ID == this.EditRowID
            ) {
              return false;
            }

            const existingSectionIDs =
              (x.SectionIDs || '')
                .toString()
                .split(',')
                .map((id: string) => id.trim());

            return (
              x.SubjectID == newItem.SubjectID &&
              existingSectionIDs.includes(
                String(secID)
              )
            );
          });

      // =====================================
      // DUPLICATE FOUND
      // =====================================

      if (
        existsInAllSection ||
        existsInTempList
      ) {

        duplicateFound = true;

        const sectionName =
          this.GetSectionData.find(
            (s: any) => s.ID == secID
          )?.Name;

        if (
          sectionName &&
          !duplicateSectionNames.includes(
            sectionName
          )
        ) {

          duplicateSectionNames.push(
            sectionName
          );
        }
      }
    }

    // =====================================
    // SHOW WARNING
    // =====================================

    if (duplicateFound) {

      this.toastr.warning(
        `Section(s) already assigned for this subject: ${duplicateSectionNames.join(', ')}`
      );

      this.isSubmitted = false;

      return;
    }

    // =========================
    // FINAL ADD / UPDATE
    // =========================

    if (this.IsEditMode) {

      // remove old edited row if exists

      this.AddStaffSubjectSectionModelList1 =
        this.AddStaffSubjectSectionModelList1.filter(
          (x: any) => x.ID != this.EditRowID
        );
    }

    // add updated/new row

    this.AddStaffSubjectSectionModelList1.push(
      newItem
    );

    // =========================
    // RESET EDIT MODE
    // =========================



    this.EditRowID = 0;

    // =========================
    // REFRESH SECTION LIST
    // =========================

    this.refreshAvailableSections();

    // =========================
    // RESET FORM
    // =========================

    this.EditDataFormGroup.reset({

      SectionID: [],

      StreamID: this.oldStreamID,

      SemesterID: this.oldSemesterID
    });

    // =========================
    // RESET MODEL
    // =========================

    this.AddStaffSubjectSectionModel =
      new AddStaffSubjectSectionModel();

    this.AddStaffSubjectSectionModel.SemesterID =
      this.oldSemesterID;

    this.AddStaffSubjectSectionModel.StreamID =
      this.oldStreamID;

    console.log(this.AddStaffSubjectSectionModelList1);

    this.isSubmitted = false;
  }

  DeleteFromList(index: number) {
    this.AddStaffSubjectSectionModelList1.splice(index, 1);
    // this.refreshAvailableSections1(this.AddStaffSubjectSectionModel.SubjectID);
    this.refreshAvailableSections();
  }

  async getupBranchHodData() {
    //debugger
    const GetstreamId = this.AddStaffSubjectSectionModel.StreamID;
    const GetSemesterID = this.AddStaffSubjectSectionModel.SemesterID;

    let obj = {
      Action: "GET_BY_ID",
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      StreamID: GetstreamId,
      SemesterID: GetSemesterID
    }
    await this.staffMasterService.GetBranchSectionData(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetSectionData = data.Data;
        this.GetSectionData = this.GetSectionData.filter((item: any) => item.CreatedBy == this.sSOLoginDataModel.UserID)
        this.allSections = this.GetSectionData;
        //debugger

        const usedSectionIds = this.AddStaffSubjectSectionModelList.map(
          (x: any) => Number(x.SectionID)
        );

        // this.GetSectionData = this.GetSectionData.filter(
        //   (item: any) => !usedSectionIds.includes(Number(item.SectionID))
        // );
        // this.allSections = this.GetSectionData;


        // this.allSections = data.Data;   // all sections
        // this.GetSectionData = [...this.allSections];
        //  console.log(this.GetBranchSectionData)
        // this.initTable(this.GetBranchSectionData);
      }, (error: any) => console.error(error)
      );
  }
  get formEditData() { return this.EditDataFormGroup.controls; }
  createSection(): FormGroup {
    return this.formBuilder.group({
      sectionName: [''],
      studentCount: [0]
    });
  }

  async loadDropdownData() {
    ////debugger
    let obj = {
      InstituteID: this.sSOLoginDataModel.InstituteID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      RoleID: this.sSOLoginDataModel.RoleID,
      WorkInstituteID: this.sSOLoginDataModel.InstituteID,
    }
    this.commonMasterService.GetStaff_InstituteAndWorkWise(obj).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ApprovedTeacherList = data['Data'];
    });
  }

  SaveData_EditDetails() {
    //debugger
    this.isSubmitted = true;

    if (this.AddStaffSubjectSectionModelList1.length === 0) {
      this.toastr.warning("Please add at least one subject-section assignment.");
      return;
    }


    this.PostAttendanceTimeTableList = [];

    for (let i = 0; i < this.AddStaffSubjectSectionModelList1.length; i++) {
      const item = this.AddStaffSubjectSectionModelList1[i];
      this.postItem.StreamID = item.StreamID,
        this.postItem.SemesterID = item.SemesterID,
        this.postItem.SubjectID = item.SubjectID,
        this.postItem.StaffID = item.StaffID,
        this.postItem.SectionID = 0,
        this.postItem.EndTermID = this.sSOLoginDataModel.EndTermID,
        this.postItem.DepartmentID = this.sSOLoginDataModel.DepartmentID,
        this.postItem.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng,
        this.postItem.RoleID = this.sSOLoginDataModel.RoleID,
        this.postItem.SectionIDs = item.SectionIDs,
        this.postItem.SectionIDs = item.SectionIDs,
        this.postItem.AssignBySSOID = this.sSOLoginDataModel.SSOID,
        this.postItem.AssignBySSOID = this.sSOLoginDataModel.SSOID,
        this.postItem.AssignToSSOID = this.ApprovedTeacherList.find((x: any) => x.StaffID == item.StaffID)?.SSOID,
        this.postItem.InstituteID = this.sSOLoginDataModel.InstituteID,
        this.postItem.ID=item.ID
        this.PostAttendanceTimeTableList.push(this.postItem);
      this.postItem = new PostAttendanceTimeTable();
    }

    try {
      this.attendanceServiceService.PostAttendanceTimeTableList(this.PostAttendanceTimeTableList)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          this.toastr.success('Saved Successfully');
          this.GetAssignedTeacherForSubject()
          this.CloseModal();
         
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }

  async DeleteRow(row: any) {

    try {

      if (!row || row.ID <= 0) {

        this.toastr.warning('Invalid record');
        return;
      }

      const isConfirm = confirm('Are you sure you want to delete this record?');

      if (!isConfirm) {
        return;
      }

      const obj = {
        ID: row.ID,
        DeleteStatus: 1
      };

      await this.attendanceServiceService
        .DeleteAssignTeacherForSubject(obj)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));

          if (data.State === 1 || data.State === true) {

            this.toastr.success('Deleted Successfully');

            // remove from local list
          

            // refresh main list if needed
            this.GetAssignedTeacherForSubject();

          } else {

            this.toastr.error(data.Message || 'Unable to delete');
          }

        }, (error:any) => {

          console.error(error);
          this.toastr.error('Something went wrong');
        });

    }
    catch (Ex) {

      console.log(Ex);
      this.toastr.error('Error while deleting');
    }
  }

  async ResetButton() {

  }
}
