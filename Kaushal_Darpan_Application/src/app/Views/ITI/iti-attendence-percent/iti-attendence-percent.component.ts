
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { of } from "rxjs";
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { AttendanceServiceService } from '../../../Services/AttendanceServices/attendance-service.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { StaffMasterDDLDataModel } from '../../../Models/CenterObserverDataModel';
interface DynamicColumn {
  originalKey: string;
  dayType: string;
  date: string;
  isHoliday: boolean;
}
@Component({
  selector: 'app-iti-attendence-percent',
  standalone: false,
  templateUrl: './iti-attendence-percent.component.html',
  styleUrl: './iti-attendence-percent.component.css'
})
export class ItiAttendencePercentComponent {
  dynamicColumns: DynamicColumn[] = [];

  displayedColumns: string[] = [];
  public InstituteID:number=0
  filterData: any[] = [];
  public requestStaff = new StaffMasterDDLDataModel();
  SubjectMasterDDL: any[] = [];
  StaffList: any[] = [];
  InstituteList: any[] = [];
  SSOID: string = ''
  EditDataFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  StreamMasterDDL: any[] = [];
  SemesterMasterDDL: any[] = [];
  shiftddl: any[] = [];


  TableForm!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  private _liveAnnouncer = inject(LiveAnnouncer);
  dataSource = new MatTableDataSource<any>([]);
  checkedAll: boolean = false;
  minEndDate: string | null = null;
  AttendanceStartDate: string = '';
  AttendanceEndDate: string = '';
  // Pagination related variables
  totalRecords: number = 0;
  pageSize: number = 500;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  streamId!: number;
  semesterId!: number;
  subjectId!: number;
  ShiftID!: number;
  UnitID!: number;
  today: Date = new Date();
  yesterdayDate: string='';
  sevenDaysLater: Date = new Date();
  selectedRange: { start: Date, end: Date } | null = null;

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private attendanceServiceService: AttendanceServiceService,
    private fb: FormBuilder,
    private http: HttpClient, private route: ActivatedRoute,  
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.InstituteID = this.sSOLoginDataModel.InstituteID

    // Access the route parameters
    this.streamId = parseInt(this.route.snapshot.paramMap.get('streamId') ?? "0");
    this.semesterId = parseInt(this.route.snapshot.paramMap.get('semesterId') ?? "0");
    this.subjectId = parseInt(this.route.snapshot.paramMap.get('subjectId') ?? "0");
    this.ShiftID = parseInt(this.route.snapshot.paramMap.get('ShiftID') ?? "0");
    this.UnitID = parseInt(this.route.snapshot.paramMap.get('UnitID') ?? "0");
    this.AttendanceStartDate = this.route.snapshot.paramMap.get('AttendanceStartDate') ?? "";
    this.AttendanceEndDate = this.route.snapshot.paramMap.get('AttendanceEndDate') ?? "0";

    this.getMasterData();
  

  }


 async ngOnInit() {


    this.TableForm = this.fb.group({
      SubjectID: ['', Validators.required],
      StreamID: ['', Validators.required],
      SemesterID: ['', Validators.required],
      AttendanceStartDate: [this.selectedRange?.start],
      AttendanceEndDate: [this.selectedRange?.end],
      ShiftId: [''],
      SSOID: [''],
      Percent: [''],
      InstituteID: [''],

    });
   if (this.sSOLoginDataModel.InstituteID == 0) {
     await this.GetInstituteList()
   }
  await this.getSubjectMasterDDL(this.streamId, this.semesterId);
  await  this.GetStaff_InstituteWise()
    this.TableForm.patchValue({
      StreamID: this.streamId,
      SemesterID: this.semesterId,

    });
    if (this.AttendanceStartDate != '' && this.AttendanceStartDate != null && this.AttendanceStartDate != undefined
      && this.AttendanceEndDate != '' && this.AttendanceEndDate != null && this.AttendanceEndDate != undefined
    ) {

      this.TableForm.patchValue({
        AttendanceStartDate: this.AttendanceStartDate,
        AttendanceEndDate: this.AttendanceEndDate,

      });



      this.TableForm.controls['AttendanceEndDate'].disable();
      this.TableForm.controls['AttendanceStartDate'].disable();
    }

    if (this.sSOLoginDataModel.RoleID == 222) {
      this.TableForm.patchValue({
        SSOID: this.sSOLoginDataModel.SSOID


      });
      this.TableForm.controls['SSOID'].disable();
     await this.GetstaffDetails(this.sSOLoginDataModel.SSOID)
    }

    setTimeout(() => {
      if (this.semesterId > 0) {
        this.TableForm.patchValue({
          SubjectID: this.subjectId
        });
        this.getData();
      }
    }, 1000);

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


  get formTable() { return this.TableForm.controls; }

  async getMasterData() {
    try {
      await this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, this.InstituteID).then((data: any) => {
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


  async ItiShiftUnitDDL(ID: number) {
    try {
      debugger

      

      await this.commonMasterService.ItiShiftUnitDDL(ID, this.sSOLoginDataModel.FinancialYearID, this.sSOLoginDataModel.Eng_NonEng, this.InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.shiftddl = data.Data;
      })

    } catch (error) {
      console.error(error);
    }
  }


  getSubjectMasterDDL(ID: any, SemesterID: any) {


    this.TableForm.patchValue({
      SubjectID: 0,

    })
    this.ItiShiftUnitDDL(ID)
    if (this.SSOID) {
      this.Onyearchange()
      return
    }



    if (ID && SemesterID != "" && SemesterID != null) {
      this.commonMasterService.SubjectMaster_StreamIDWise(ID, this.sSOLoginDataModel.DepartmentID, SemesterID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
      })
    } else {
      console.error('Event or value is undefined');
    }

  }
  async GetAttendanceTimeTable() {

    try {

      if (this.InstituteID == 0) {
        this.toastr.warning("Please Select Iti")
        return
      }

      debugger
      const rawStart = this.TableForm.getRawValue().AttendanceStartDate;
      const rawEnd = this.TableForm.getRawValue().AttendanceEndDate;

      let formattedDateStart = null;
      let formattedDateEnd = null;

      if (rawStart) {
        const dateStart = new Date(rawStart);
        formattedDateStart =
          dateStart.getFullYear() + '-' +
          String(dateStart.getMonth() + 1).padStart(2, '0') + '-' +
          String(dateStart.getDate()).padStart(2, '0');
      }

      if (rawEnd) {
        const dateEnd = new Date(rawEnd);
        formattedDateEnd =
          dateEnd.getFullYear() + '-' +
          String(dateEnd.getMonth() + 1).padStart(2, '0') + '-' +
          String(dateEnd.getDate()).padStart(2, '0');
      }

      let obj = {
        SemesterID: this.TableForm.value.SemesterID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        FinancialYearID: this.sSOLoginDataModel.FinancialYearID,
        InstituteID: this.InstituteID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        StreamID: this.TableForm.getRawValue().StreamID,
        SubjectID: this.TableForm.value.SubjectID,
        AttendanceStartDate: formattedDateStart,
        AttendanceEndDate: formattedDateEnd,
        UnitID: this.UnitID,
        ShiftID: this.ShiftID,
        Seatintake: this.TableForm.value.ShiftId,
        Percent: this.TableForm.value.Percent,
        SSOID: this.TableForm.value.SSOID
      };

      console.log(obj); // check values

      this.filterData = [];

      await this.attendanceServiceService
        .GetStudentAttendance_PercentReport(obj)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data['Data']));
          this.filterData = data;

          if (this.filterData.length > 0) {

            this.displayedColumns = [
              'SrNo',
              'EnrollmentNo',
              'StudentName',
              'SubjectName',
              'PresentDays',
              'TotalWorkingDays',
              'Percent'
            ];

          }

          this.dataSource.data = this.filterData;
          this.dataSource.sort = this.sort;

          this.totalRecords = this.filterData.length;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

          this.updateTable();

        });

    } catch (Ex) {

      console.log(Ex);

    }

  }
  isFinalSubmitted(value: any): boolean {
    return value?.includes('(F)');
  }

  isPresent(value: any): boolean {
    return value?.startsWith('P');
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

  getData() {
    this.isSubmitted = true;
   
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
    XLSX.writeFile(wb, 'Reports.xlsx');
  }
  public downloadPDF() {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [210, 300],
    });

    const pdfTable = this.pdfTable.nativeElement as HTMLElement;

    // store old styles
    const oldOverflow = pdfTable.style.overflow;
    const oldMaxHeight = pdfTable.style.maxHeight;
    const oldHeight = pdfTable.style.height;

    // expand full content
    pdfTable.style.overflow = 'visible';
    pdfTable.style.maxHeight = 'none';
    pdfTable.style.height = 'auto';

    doc.html(pdfTable, {
      callback: (doc) => {
        doc.save('Report.pdf');

        // restore old styles
        pdfTable.style.overflow = oldOverflow;
        pdfTable.style.maxHeight = oldMaxHeight;
        pdfTable.style.height = oldHeight;
      },
      x: 10,
      y: 10,
      width: 190,
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
      window.URL.revokeObjectURL(url);this.TableForm.getRawValue().StreamID
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  saveAttendance() {
    console.log(this.dataSource.filteredData);
    let saveAttendanceData: any[] = this.dataSource.filteredData;
    const attendanceData = {
      EndTermID: this.sSOLoginDataModel.EndTermID,
      FinancialYearID: this.sSOLoginDataModel.FinancialYearID,
      SemesterID: this.TableForm.value.SemesterID,
      StreamID: this.TableForm.getRawValue().StreamID,
      SubjectID: this.TableForm.value.SubjectID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
      InstituteID: this.sSOLoginDataModel.InstituteID,
      AssignTeacherForSubjectID: this.sSOLoginDataModel.RoleID
    };

    saveAttendanceData.forEach(item => {
      // Add new columns (data) to each item
      item.EndTermID = attendanceData.EndTermID;
      item.FinancialYearID = attendanceData.FinancialYearID;
      item.DepartmentID = attendanceData.DepartmentID;
      item.SemesterID = attendanceData.SemesterID;
      item.StreamID = attendanceData.StreamID;
      item.SubjectID = attendanceData.SubjectID;
      item.InstituteID = attendanceData.InstituteID,
        item.CourseTypeID = attendanceData.CourseTypeID;
      item.AssignTeacherForSubjectID = attendanceData.AssignTeacherForSubjectID;
    });
    // Iterate over each student record to transform attendance dates into an "Attendance" column
    saveAttendanceData.forEach(item => {
      // Create an empty array to store attendance data
      let attendanceArray: any[] = [];

      // Loop through the object properties and extract attendance date columns
      Object.keys(item).forEach(key => {
        // If the key is a date (i.e., not part of the basic student info)
        if (key.trim() !== "DepartmentID" && key.trim() !== "EnrollmentNo" && key.trim() !== "StudentName" && key.trim() !== "SubjectName" && key.trim() !== "EndTermID" && key.trim() !== "FinancialYearID" && key.trim() !== "SemesterID" && key.trim() !== "StreamID" && key.trim() !== "SubjectID" && key.trim() !== "CourseTypeID" && key.trim() !== "AssignTeacherForSubjectID" && key.trim() !== "SubjectID1" && key.trim() !== "AttendanceDate" && key.trim() !== "Attendance" && key.trim() !== "InstituteID" && key.trim() !== "StudentID") {

          // Push the date and its status as an object into the attendance array
          attendanceArray.push({ "Date": key.trim(), "Status": item[key] });

          // Delete the attendance date key from the item object
          delete item[key];
        }
      });

      // Add the attendance array as a new column 'Attendance'
      item.Attendance = attendanceArray;
    });
    // Optionally, log the updated data to verify the result
    console.log(saveAttendanceData);

    this.attendanceServiceService.saveITI_AttendanceData(saveAttendanceData)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data == 1) {
          this.GetAttendanceTimeTable();
          this.toastr.success(data.Message);
          this.checkedAll = false;
        }
      }, error => console.error(error));
  }


  saveAttendancefinal() {
    console.log(this.dataSource.filteredData);
    let saveAttendanceData: any[] = this.dataSource.filteredData;
    const attendanceData = {
      EndTermID: this.sSOLoginDataModel.EndTermID,
      FinancialYearID: this.sSOLoginDataModel.FinancialYearID,
      SemesterID: this.TableForm.value.SemesterID,
      StreamID: this.TableForm.getRawValue().StreamID,
      SubjectID: this.TableForm.value.SubjectID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
      InstituteID: this.sSOLoginDataModel.InstituteID,
      AssignTeacherForSubjectID: this.sSOLoginDataModel.RoleID
    };

    saveAttendanceData.forEach(item => {
      // Add new columns (data) to each item
      item.EndTermID = attendanceData.EndTermID;
      item.FinancialYearID = attendanceData.FinancialYearID;
      item.DepartmentID = attendanceData.DepartmentID;
      item.SemesterID = attendanceData.SemesterID;
      item.StreamID = attendanceData.StreamID;
      item.SubjectID = attendanceData.SubjectID;
      item.InstituteID = attendanceData.InstituteID,
        item.CourseTypeID = attendanceData.CourseTypeID;
      item.AssignTeacherForSubjectID = attendanceData.AssignTeacherForSubjectID;
      item.IsFinalSubmit = 1
    });
    debugger
    // Iterate over each student record to transform attendance dates into an "Attendance" column
    saveAttendanceData.forEach(item => {
      // Create an empty array to store attendance data
      let attendanceArray: any[] = [];

      // Loop through the object properties and extract attendance date columns
      Object.keys(item).forEach(key => {
        // If the key is a date (i.e., not part of the basic student info)
        if (key.trim() !== "DepartmentID" && key.trim() !== "EnrollmentNo" && key.trim() !== "StudentName" && key.trim() !== "SubjectName" && key.trim() !== "EndTermID" && key.trim() !== "FinancialYearID" && key.trim() !== "SemesterID" && key.trim() !== "StreamID" && key.trim() !== "SubjectID" && key.trim() !== "CourseTypeID"
          && key.trim() !== "AssignTeacherForSubjectID" && key.trim() !== "SubjectID1"
          && key.trim() !== "AttendanceDate" && key.trim() !== "Attendance" && key.trim() !== "InstituteID"
          && key.trim() !== "StudentID" && key.trim() !== "IsFinalSubmit") {

          // Push the date and its status as an object into the attendance array
          attendanceArray.push({
            "Date": key.trim(),
            "Status": item[key],
            "IsFinalSubmit": 1
          });

          // Delete the attendance date key from the item object
          delete item[key];
        }
      });

      // Add the attendance array as a new column 'Attendance'
      item.Attendance = attendanceArray;
    });
    // Optionally, log the updated data to verify the result
    console.log(saveAttendanceData);

    this.attendanceServiceService.saveITI_AttendanceData(saveAttendanceData)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data == 1) {
          this.GetAttendanceTimeTable();
          this.toastr.success(data.Message);
          this.checkedAll = false;
        }
      }, error => console.error(error));
  }




  // Method to toggle all attendance to present or absent
  toggleAllAttendance() {
    const attendanceStatus = this.checkedAll ? 'P' : 'A';
    this.dataSource.data.forEach((element: { Attendance: string; }) => {
      element.Attendance = attendanceStatus;
    });
  }

  isDateFinalSubmitted(element: any, dateKey: string): boolean {

    const record = element.Attendance?.find(
      (x: any) => x.Date === dateKey
    );

    return record?.IsFinalSubmit == 1;
  }


 async GetStaff_InstituteWise(ID:any='') {

   if (ID > 0) {
     this.InstituteID = ID
   } else {
     this.InstituteID = this.sSOLoginDataModel.InstituteID
   }
    this.requestStaff.InstituteID =this.InstituteID;
    this.requestStaff.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.requestStaff.DepartmentID = this.sSOLoginDataModel.Eng_NonEng;
   await this.commonMasterService.ITIInstructor_InstituteWise(this.requestStaff).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      debugger;
      if (data.Data.length > 0) {
        this.StaffList = data.Data;
      }
      else {
        this.StaffList = [];
      }

      //this.ExaminerDDL = [{ StaffID: 1, Name: 'Staff 1', SSOID: 'Staff1' },{ StaffID: 2, Name: 'Staff 2', SSOID: 'Staff2' },{ StaffID: 3, Name: 'Staff 3', SSOID: 'Staff3' }];
    })
  }


  async GetstaffDetails(SSOID: any) {
    this.SSOID = SSOID;

    const ssoid = this.TableForm.get('SSOID')?.value;

    if (ssoid == null || ssoid === '' || ssoid === 'null') {
      this.TableForm.get('StreamID')?.enable();
      this.TableForm.get('ShiftId')?.enable();

      this.TableForm.patchValue({
        StreamID: null,
        ShiftId: null
      });

      this.SSOID = '';
      return;
    } else {
      this.TableForm.get('StreamID')?.disable();
     // this.EditDataFormGroup.get('StreamID')?.disable();
     
    }

    const item = this.StaffList.find(
      (e: any) => e.SSOID?.trim().toLowerCase() === ssoid?.trim().toLowerCase()
    );
    if (!item) return;

    this.TableForm.patchValue({
      StreamID: item.TradeID,
      ShiftId: item.SeatIntakeID
    });

    await this.getSubjectMasterDDL(item.TradeID, this.TableForm.getRawValue().SemesterID);

    console.log(this.TableForm.getRawValue());
  }
  Onyearchange() {
    debugger

    this.ItiShiftUnitDDL(this.TableForm.getRawValue().StreamID)
    this.SubjectMasterDDL = []
    this.commonMasterService.GetAssignedSubject(this.SSOID, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SubjectMasterDDL = data.Data;
    })
  }



  async GetInstituteList() {



    await this.commonMasterService.Iticollege(2, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      debugger;
      if (data.Data.length > 0) {
        this.InstituteList = data.Data;
      }
      else {
        this.InstituteList = [];
      }

      //this.ExaminerDDL = [{ StaffID: 1, Name: 'Staff 1', SSOID: 'Staff1' },{ StaffID: 2, Name: 'Staff 2', SSOID: 'Staff2' },{ StaffID: 3, Name: 'Staff 3', SSOID: 'Staff3' }];
    })
  }

}
