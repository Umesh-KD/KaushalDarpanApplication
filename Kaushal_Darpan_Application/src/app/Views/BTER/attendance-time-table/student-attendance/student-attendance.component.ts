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

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrl: './student-attendance.component.css',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAttendanceComponent implements OnInit {
  displayedColumns: string[] = ['SrNo', 'EnrollmentNo', 'StudentName', 'SubjectName'];
 /* dynamicColumns: string[] = [];*/

  filterData: any[] = [];
  dynamicColumns: { name: string, locked: boolean }[] = [];
 
 
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

  constructor(
    private attendanceServiceService: AttendanceServiceService,
    private fb: FormBuilder,
    private staffMasterService: StaffMasterService,
    private http: HttpClient, private route: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // Access the route parameters
    this.streamId = parseInt(this.route.snapshot.paramMap.get('streamId') ?? "0");
    this.sectionId = parseInt(this.route.snapshot.paramMap.get('sectionId') ?? "0");
    this.semesterId = parseInt(this.route.snapshot.paramMap.get('semesterId') ?? "0");
    this.subjectId = parseInt(this.route.snapshot.paramMap.get('subjectId') ?? "0");
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

  ngOnInit() {
    
    
    this.TableForm = this.fb.group({
      SubjectID: ['', Validators.required],
      StreamID: ['', Validators.required],
      SectionID: ['', Validators.required],
      SemesterID: ['', Validators.required],
      AttendanceStartDate: [this.selectedRange?.start],
      AttendanceEndDate: [this.selectedRange?.end]
    });

    this.getSubjectMasterDDL(this.streamId, this.semesterId);

    this.TableForm.patchValue({
      StreamID: this.streamId,
      SemesterID: this.semesterId,
      SectionID: this.sectionId,
    });
    setTimeout(()=> {
      if (this.semesterId > 0) {
        this.TableForm.patchValue({
          SubjectID: this.subjectId
        });
        this.getData();
      }
    }, 1000);
    
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
    
      let obj = {
        Action: "GET_BY_ID",
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        StreamID: this.streamId,
      }

      await this.staffMasterService.GetBranchSectionData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GetSectionData = data.Data
        }, (error: any) => console.error(error)
        );
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
      this.commonMasterService.SubjectMaster_StreamIDWise(ID, this.sSOLoginDataModel.DepartmentID, SemesterID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
      })
    } else {
      console.error('Event or value is undefined');
    }

  }

  async GetAttendanceTimeTable() {
    debugger
    try {
      const dateStart = new Date(this.TableForm.value.AttendanceStartDate.toLocaleDateString());
      dateStart.setDate(dateStart.getDate() + 1);
      const formattedDateStart = dateStart.toISOString().split('T')[0];
      const dateEnd = new Date(this.TableForm.value.AttendanceEndDate.toLocaleDateString());
      dateEnd.setDate(dateEnd.getDate() + 1);
      const formattedDateEnd = dateEnd.toISOString().split('T')[0];
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
        AttendanceEndDate: formattedDateEnd
      };

      this.filterData = [];


      await this.attendanceServiceService.GetStudentAttendance(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data['Data']));
        this.filterData = data;

        if (this.filterData.length > 0) {
          this.dynamicColumns = [];
          this.displayedColumns = ['SrNo', 'EnrollmentNo', 'StudentName', 'SubjectName', 'SectionName'];

          this.dynamicColumns = Object.keys(this.filterData[0])
            .filter(key => ![
              'SectionID', 'SectionName', 'EnrollmentNo', 'SemesterName', 'StreamName', 'StudentName', 'SubjectName',
              'SemesterID', 'StreamID', 'SubjectID', 'SubjectID1', 'InstituteID', 'AttendanceDate', 'Attendance',
              'EndTermID', 'CourseTypeID', 'StudentID'
            ].includes(key))
            .map(key => {
              const isHoliday = key.toLowerCase().includes('holiday');
              return { name: key, locked: isHoliday };
            });

          
          this.filterData.forEach(student => {
            this.dynamicColumns.forEach(col => {
              if (!student[col.name]) {
                student[col.name] = col.locked ? 'H' : 'A'; // Holiday=H, Working=A
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
    if (this.TableForm.value.StreamID != null && this.TableForm.value.SubjectID) {
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

  //saveAttendance() {
  //  debugger
  //  console.log(this.dataSource.filteredData);
  //  let saveAttendanceData: any[] = this.dataSource.filteredData;
  //  const attendanceData = {
  //    EndTermID: this.sSOLoginDataModel.EndTermID,
  //    SemesterID: this.TableForm.value.SemesterID,
  //    StreamID: this.TableForm.value.StreamID,
  //    SectionID: this.sectionId,
  //    SubjectID: this.TableForm.value.SubjectID,
  //    DepartmentID: this.sSOLoginDataModel.DepartmentID,
  //    CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
  //    InstituteID: this.sSOLoginDataModel.InstituteID,
  //    AssignTeacherForSubjectID: this.sSOLoginDataModel.RoleID
  //  };

  //  saveAttendanceData.forEach(item => {
  //    // Add new columns (data) to each item
  //    item.EndTermID = attendanceData.EndTermID;
  //    item.DepartmentID = attendanceData.DepartmentID;
  //    item.SemesterID = attendanceData.SemesterID;
  //    item.StreamID = attendanceData.StreamID;
  //    item.SectionID = attendanceData.SectionID;
  //    item.SubjectID = attendanceData.SubjectID;
  //    item.InstituteID = attendanceData.InstituteID,
  //    item.CourseTypeID = attendanceData.CourseTypeID;
  //    item.AssignTeacherForSubjectID = attendanceData.AssignTeacherForSubjectID;
  //  });
  //  // Iterate over each student record to transform attendance dates into an "Attendance" column
  //  saveAttendanceData.forEach(item => {
  //    // Create an empty array to store attendance data
  //    let attendanceArray:any[] = [];

  //    // Loop through the object properties and extract attendance date columns
  //    Object.keys(item).forEach(key => {
  //      // If the key is a date (i.e., not part of the basic student info)
  //      if (key.trim() !== "SectionID" && key.trim() !== 'SectionName' && key.trim() !== "DepartmentID" && key !== 'SemesterName' && key !== 'StreamName' &&  key.trim() !== "EnrollmentNo" && key.trim() !== "StudentName" && key.trim() !== "SubjectName" && key.trim() !== "EndTermID" && key.trim() !== "SemesterID" && key.trim() !== "StreamID" && key.trim() !== "SubjectID" && key.trim() !== "CourseTypeID" && key.trim() !== "AssignTeacherForSubjectID" && key.trim() !== "SubjectID1" && key.trim() !== "AttendanceDate" && key.trim() !== "Attendance" && key.trim() !== "InstituteID" && key.trim() !== "StudentID") {

  //        // Push the date and its status as an object into the attendance array
  //        attendanceArray.push({ "Date": key.trim(), "Status": item[key] });

  //        // Delete the attendance date key from the item object
  //        delete item[key];
  //      }
  //    });

  //    // Add the attendance array as a new column 'Attendance'
  //    item.Attendance = attendanceArray;
  //  });
  //  // Optionally, log the updated data to verify the result
  //  console.log(saveAttendanceData);

  //  this.attendanceServiceService.saveAttendanceData(saveAttendanceData)
  //    .then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      if (data.Data == 1) {
  //        this.GetAttendanceTimeTable();
  //        this.toastr.success(data.Message);
  //        this.checkedAll = false;
  //      }
  //    }, error => console.error(error));
  //}


  saveAttendance() {
    debugger;

    let saveAttendanceData: any[] = this.dataSource.filteredData;
    debugger
    
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
      AssignTeacherForSubjectID: this.sSOLoginDataModel.RoleID
    };

    saveAttendanceData.forEach(item => {
      // Assign common fields
      Object.assign(item, attendanceData);
      debugger
      const attendanceArray: any[] = [];

      Object.keys(item).forEach(key => {
        const skipKeys = [
          'SectionID', 'SectionName', 'DepartmentID', 'SemesterName', 'StreamName', 'EnrollmentNo',
          'StudentName', 'SubjectName', 'EndTermID', 'SemesterID', 'StreamID', 'SubjectID',
          'CourseTypeID', 'AssignTeacherForSubjectID', 'SubjectID1', 'AttendanceDate', 'Attendance',
          'InstituteID', 'StudentID'
        ];

        if (!skipKeys.includes(key)) {
          // ✅ Remove (Working Day) / (Holiday) prefix → keep only yyyy-mm-dd
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
  }


  // Method to toggle all attendance to present or absent
  toggleAllAttendance() {
    const attendanceStatus = this.checkedAll ? 'P' : 'A';
    this.dataSource.data.forEach((element: { Attendance: string; }) => {
      element.Attendance = attendanceStatus;
    });
  }

  // Method to handle individual attendance toggle change
  //onAttendanceChange(event: MatSlideToggleChange, element: any) {
  //  element.Attendance = event.checked ? 'P' : 'A';


  //}

  ChangeStreamDDL(StreamID: number) {
    
    let obj = {
      Action: "GET_BY_ID",
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      StreamID: StreamID,
    }

     this.staffMasterService.GetBranchSectionData(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetSectionData = data.Data
      }, (error: any) => console.error(error)
      );

  
  }

  unlockColumn(columnName: string) {
    const col = this.dynamicColumns.find(c => c.name === columnName);
    if (col) {
      col.locked = false;
      this.dataSource.data.forEach((row: any) => {
        if (row[columnName] === 'H') {
          row[columnName] = 'A'; // ✅ Change default from Holiday → Absent
        }
      });
    }
  }
}

