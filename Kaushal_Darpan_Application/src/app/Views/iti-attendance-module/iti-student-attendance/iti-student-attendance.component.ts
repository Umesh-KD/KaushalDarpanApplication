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
interface DynamicColumn {
  originalKey: string;
  dayType: string;
  date: string;
  isHoliday: boolean;
}

@Component({
  selector: 'app-iti-student-attendance',
  templateUrl: './iti-student-attendance.component.html',
  styleUrl: './iti-student-attendance.component.css',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ITIStudentAttendanceComponent implements OnInit {
  dynamicColumns: DynamicColumn[] = [];

  displayedColumns: string[] = [];

  filterData: any[] = [];

  EditDataFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  StreamMasterDDL: any[] = [];
  SemesterMasterDDL: any[] = [];
  isDateFrozen: boolean = false;
  todayDate: string = '';

  maxDate: string = ''; 

  SubjectMasterDDL: any[] = [];
  TableForm!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  private _liveAnnouncer = inject(LiveAnnouncer);
  dataSource = new MatTableDataSource<any>([]);
  checkedAll: boolean = false;
  minEndDate: string | null = null;
  AttendanceStartDate: string ='';
  AttendanceEndDate: string ='';
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
  subjectIds!: string;
  ShiftID!: number;
  UnitID!: number;
  today: Date = new Date();
  yesterdayDate: string;
  sevenDaysLater: Date = new Date();
  selectedRange: { start: Date, end: Date } | null = null;
  isDisabledButton: boolean = false;

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public isreaasign: boolean=false
  constructor(
    private attendanceServiceService: AttendanceServiceService,
    private fb: FormBuilder,
    private http: HttpClient, private route: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // Access the route parameters
    this.streamId = parseInt(this.route.snapshot.paramMap.get('streamId') ?? "0");
    this.semesterId = parseInt(this.route.snapshot.paramMap.get('semesterId') ?? "0");
    this.subjectIds = this.route.snapshot.paramMap.get('subjectId') ?? "0";
    this.ShiftID = parseInt(this.route.snapshot.paramMap.get('ShiftID') ?? "0");
    this.UnitID = parseInt(this.route.snapshot.paramMap.get('UnitID') ?? "0");
    this.AttendanceStartDate = this.route.snapshot.paramMap.get('AttendanceStartDate') ?? "";
    this.AttendanceEndDate = this.route.snapshot.paramMap.get('AttendanceEndDate') ?? "";




 

    if (this.AttendanceStartDate != '' && this.AttendanceEndDate != '') {
      this.isreaasign = true
    }
    else
    {
      this.isreaasign = false
    }


    this.getMasterData();
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



  formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }





  ngOnInit() {




    this.getcurrentdate();


    this.AttendanceStartDate = this.AttendanceStartDate ? this.formatDate(this.AttendanceStartDate) : "";
    this.AttendanceEndDate = this.AttendanceEndDate ? this.formatDate(this.AttendanceEndDate) : "";
    

    
    this.TableForm = this.fb.group({
      SubjectID: ['', Validators.required],
      StreamID: ['', Validators.required],
      SemesterID: ['', Validators.required],
      AttendanceStartDate: [''],
      //AttendanceEndDate: [this.selectedRange?.end],
      AttendanceStartDateRavi:[]
    });



    this.getSubjectMasterDDL(this.streamId, this.semesterId);




    this.TableForm.patchValue({
      StreamID: this.streamId,
      SemesterID: this.semesterId,

    });
    this.TableForm.controls['StreamID'].disable();
    //if (this.AttendanceStartDate != '' && this.AttendanceStartDate != null && this.AttendanceStartDate != undefined
    //  && this.AttendanceEndDate != '' && this.AttendanceEndDate != null && this.AttendanceEndDate != undefined
    //) {

    //  this.TableForm.patchValue({
    //    AttendanceStartDate: this.AttendanceStartDate,
    //    AttendanceEndDate: this.AttendanceEndDate,

    //  });
    //  this.TableForm.controls['AttendanceEndDate'].disable();
    //  this.TableForm.controls['AttendanceStartDate'].disable();
  
    //}
    

    setTimeout(()=> {
      if (this.semesterId > 0) {
        this.TableForm.patchValue({
          SubjectID: 0
        });
        this.getData();
      }
    }, 1000);

    this.getMasterData()
  }

  formatDateOnly(value: Date): string {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
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

  getSubjectMasterDDL(ID: any, SemesterID: any) {
    if (ID && SemesterID != "" && SemesterID != null) {
      this.commonMasterService.SubjectMaster_StreamIDWise(
        ID,
        this.sSOLoginDataModel.DepartmentID,
        SemesterID
      ).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        const allSubjects = data?.Data ?? [];
        const subjectIdsStr = this.subjectIds ?? ''; // example: "2707,2704,2705"

        if (subjectIdsStr && typeof subjectIdsStr === 'string') {
          const subjectIdsArr = subjectIdsStr
            .split(',')
            .map((x: string) => Number(x.trim()))
            .filter((x: number) => !isNaN(x));

          this.SubjectMasterDDL = allSubjects.filter((item: any) =>
            subjectIdsArr.includes(Number(item?.ID))
          );
        } else {
          this.SubjectMasterDDL = allSubjects;
        }

        console.log('Filtered SubjectMasterDDL:', this.SubjectMasterDDL);
      });
    } else {
      console.error('Event or value is undefined');
      this.SubjectMasterDDL = [];
    }
  }
  async GetAttendanceTimeTable() {

    try {

      debugger;
      const today = new Date();
      const todayDate =
        today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

      const rawStart = this.TableForm.getRawValue().AttendanceStartDate;

      if (rawStart == '' || rawStart == null || rawStart.length == 0) {

        this.toastr.warning('Please Select Attendance Date');
        return;

      }

      this.isDateFrozen = false;
    
      const dateStart = new Date(rawStart);
      const formattedDateStart =
        dateStart.getFullYear() + '-' +
        String(dateStart.getMonth() + 1).padStart(2, '0') + '-' +
        String(dateStart.getDate()).padStart(2, '0');

      //const dateEnd = new Date(rawEnd);
      //let formattedDateEnd =
      //  dateEnd.getFullYear() + '-' +
      //  String(dateEnd.getMonth() + 1).padStart(2, '0') + '-' +
      //  String(dateEnd.getDate()).padStart(2, '0');

      //if (this.isreaasign == false) {
      //  formattedDateEnd = formattedDateStart
      //}

 
   

      let obj = {
        SemesterID: this.TableForm.value.SemesterID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        FinancialYearID: this.sSOLoginDataModel.FinancialYearID,
        InstituteID: this.sSOLoginDataModel.InstituteID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        StreamID: this.TableForm.getRawValue().StreamID,
        SubjectID: this.TableForm.value.SubjectID,
        AttendanceStartDate: formattedDateStart,
        AttendanceEndDate: formattedDateStart,
        UnitID: this.UnitID,
        ShiftID: this.ShiftID,
        TodayDate: todayDate,
        SSOID: this.sSOLoginDataModel.SSOID
      };

      this.filterData = [];

      await this.attendanceServiceService
        .GetStudentAttendance_ITI(obj)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data['Data']));
          this.filterData = data;

          if (this.filterData.length > 0) {

            // Reset columns
            this.dynamicColumns = [];

            this.displayedColumns = [
              'SrNo',
              'EnrollmentNo',
              'StudentName',
              'SubjectName'
            ];

            // Extract dynamic columns properly
            this.dynamicColumns = Object.keys(this.filterData[0])
              .filter(key =>
                ![
                  'StudentID',
                  'EnrollmentNo',
                  'StudentName',
                  'SubjectName',
                  'SemesterID',
                  'StreamID',
                  'SubjectID',
                  'SubjectID1',
                  'InstituteID',
                  'AttendanceDate',
                  'Attendance',
                  'EndTermID',
                  'CourseTypeID',
                  'IsFinalSubmit'
                ].includes(key)
              )
              .map(key => {
                const match = key.match(/\((.*?)\)\s(.+)/);

                const columnValues = this.filterData.map((row: any) => row[key]);

                const isFrozen = columnValues.some((value: any) => this.isFinalSubmitted(String(value || '')));

                return {
                  originalKey: key,
                  dayType: match ? match[1] : '',
                  date: match ? match[2] : key,
                  isHoliday: match ? match[1] === 'Holiday' : false,
                  isFrozen: isFrozen
                };
              });

            // Add to displayedColumns
            this.displayedColumns = [
              ...this.displayedColumns,
              ...this.dynamicColumns.map(x => x.originalKey)
            ];


            this.isDateFrozen = this.dynamicColumns.some((column: any) =>
              this.filterData.some((row: any) =>
                String(row[column.originalKey] || '').includes('(F)')
              )
            );

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



  isColumnFrozen(columnKey: string): boolean {
    this.isDateFrozen = this.filterData.some((row: any) => this.isDisabled(row[columnKey]));
    return this.isDateFrozen;
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
    debugger
    if( this.TableForm.getRawValue().StreamID != null && this.TableForm.value.SubjectID) {
      this.GetAttendanceTimeTable();
    }
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
      item.StaffID = this.sSOLoginDataModel.UserID
      item.isreaasign = this.isreaasign,
        item.Shift = this.ShiftID,
        item.Unit = this.UnitID
    });
    // Iterate over each student record to transform attendance dates into an "Attendance" column
    saveAttendanceData.forEach(item => {
      // Create an empty array to store attendance data
      let attendanceArray:any[] = [];

      // Loop through the object properties and extract attendance date columns
      Object.keys(item).forEach(key => {
        // If the key is a date (i.e., not part of the basic student info)
        if (key.trim() !== "DepartmentID" && key.trim() !== "EnrollmentNo" && key.trim() !== "StudentName"
          && key.trim() !== "SubjectName" && key.trim() !== "EndTermID" && key.trim() !== "FinancialYearID"
          && key.trim() !== "SemesterID" && key.trim() !== "StreamID" && key.trim() !== "SubjectID"
          && key.trim() !== "CourseTypeID" && key.trim() !== "AssignTeacherForSubjectID"
          && key.trim() !== "SubjectID1" && key.trim() !== "AttendanceDate" && key.trim() !== "Attendance"
          && key.trim() !== "InstituteID" && key.trim() !== "StudentID"
          && key.trim() !== "StaffID" && key.trim() !== "Shift" && key.trim() !== "Unit" && key.trim() !== "isreaasign"
        ) {

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
      item.IsFinalSubmit = 1;
      item.StaffID = this.sSOLoginDataModel.UserID,
        item.isreaasign = this.isreaasign,
        item.Shift = this.ShiftID,
        item.Unit = this.UnitID

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
          && key.trim() !== "StudentID" && key.trim() !== "IsFinalSubmit"
          && key.trim() !== "StaffID" && key.trim() !== "isreaasign" && key.trim() !== "Shift" && key.trim() !== "Unit"
        ) {

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


  // Method to handle individual attendance toggle change
  //onAttendanceChange(event: MatSlideToggleChange, element: any) {
  //  element.Attendance = event.checked ? 'P' : 'A';
  //}


  isDisabled(value: any): boolean
  {
    if (!value) return false;
    const v = String(value);
    if (v.includes('(U)')) return false;
    if (v.includes('(F)')) {
      this.isDisabledButton = true;

      return true;
    }
    else {
      this.isDisabledButton = false;
    }
    return false;
  }




  getcurrentdate() {
    const today = new Date();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    this.todayDate = `${today.getFullYear()}-${month}-${day}`;
  }

}
