import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AppsettingService } from '../../Common/appsetting.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { StaffMasterService } from '../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../Common/GlobalConstants';
import { BTERSectionAddDataModel } from '../../Models/BTER/BTERSectionAddDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';

@Component({
  selector: 'app-roste',
  standalone: false,
  templateUrl: './roste.component.html',
  styleUrl: './roste.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RosteComponent implements OnInit {
  displayedColumns: string[] = [];
  columnSchema: Array<{ key: string; label: string; isAction?: boolean; isDate?: boolean }> = [];

  dataSource = new MatTableDataSource<any>();
  dynamicColumns: string[] = [];
  filterData: any[] = [];
  EditDataFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  StreamMasterDDL: any[] = [];
  SemesterMasterDDL: any[] = [];
  DayList: any[] = [];
  SubjectMasterDDL: any[] = [];
  GetSectionData: any[] = [];
  InstituteMasterDDL: any[] = [];
  DistrictMasterDDL: any[] = [];
  ExaminerDDL: any[] = [];
  allSections: any[] = [];
  InstituteName!: string;
  TableForm!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  private _liveAnnouncer = inject(LiveAnnouncer);
  checkedAll: boolean = false;
  // Pagination related variables
  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;
  startInTableIndex = 1;
  endInTableIndex = 10;
  AddedSectionList: BTERSectionAddDataModel[] = [];
  streamId!: number;
  semesterId!: number;
  subjectId!: number;
  minTime = '09:00';
  maxTime = '18:00'; // 6:00 PM in 24-hour format
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filterModel: any = {
    StaffID: 0,
    StreamID: 0,
    SubjectID: 0,
    InstituteID: 0,
    EndTermID: 0,
    DepartmentID: 0,
    CourseTypeID: 0,
    SemesterID: 0,
    SectionID: 0,
    DayID: 0,
    RoomNo:''
    /*AttendanceDate: ''*/
  };
  constructor(
    private fb: FormBuilder,
    private staffMasterService: StaffMasterService,
    private http: HttpClient, private route: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
    private toastr: ToastrService,
    private routers: Router,
    public appsettingConfig: AppsettingService,
    private cd: ChangeDetectorRef) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.InstituteName = this.sSOLoginDataModel.FirstName;

  }


  ngOnInit() {
    this.filterData = [];
    this.filterModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.filterModel.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.filterModel.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.filterModel.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.TableForm = this.fb.group({
      DayID: [0, [Validators.required, DropdownValidators]],
      SectionID: [[], Validators.required],
      SubjectID: [0, [Validators.required, DropdownValidators]],
      StreamID: [0, [Validators.required, DropdownValidators]],
      StaffID: [0, [Validators.required, DropdownValidators]],
      SemesterID: [0, [Validators.required, DropdownValidators]],
      /* AttendanceDate: [new Date(), Validators.required],*/
      AttendanceStartTime: ['09:00 AM', Validators.required],
      AttendanceEndTime: ['10:00 AM', Validators.required],
      RoomNo: [''],
    });
    this.getMasterData();
    this.GetAllRosterDisplay();
    this.DayListBind();
  }
  get formTable() { return this.TableForm.controls; }

  async getMasterData() {
    try {

      await this.GetStaff_InstituteWise();

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      })
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      })
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DistrictMasterDDL = data.Data;
      });
      /*    this.getSubjectMasterDDL(this.streamId, this.semesterId);*/
    } catch (error) {
      console.error(error);
    }
  }

  async getSubjectMasterDDL(ID: any, SemesterID: any) {
    if (ID && SemesterID != "" && SemesterID != null) {
      this.commonMasterService.SubjectMaster_StreamIDWise(ID, this.sSOLoginDataModel.DepartmentID, SemesterID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
      })
    }
  }

  async GetStaff_InstituteWise() {
    let obj = {
      InstituteID: this.sSOLoginDataModel.InstituteID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      RoleID: this.sSOLoginDataModel.RoleID
    }
    this.commonMasterService.GetStaff_InstituteWise(obj).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ExaminerDDL = data.Data;
    })
  }

  SemesterChange() {

    this.TableForm.patchValue({
      
      SubjectID: 0,
      StreamID: 0,
      
    });

  }

  async GetAllRosterDisplay() {
    try {

      const response = await this.staffMasterService.GetAllRosterDisplay(this.filterModel);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.filterData = data.Data;
        this.buildDynamicColumns();
        this.dataSource = new MatTableDataSource(this.filterData);

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.totalRecords = this.filterData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.updateTable();
      } else {
        this.dataSource = new MatTableDataSource();
      }
    } catch (Ex) {
      console.log(Ex);
    }
  }


  DayListBind() {

    this.DayList = [
      { DayID: 1, DayName: 'Sunday' },
      { DayID: 2, DayName: 'Monday' },
      { DayID: 3, DayName: 'Tuesday' },
      { DayID: 4, DayName: 'Wednesday' },
      { DayID: 5, DayName: 'Thursday' },
      { DayID: 6, DayName: 'Friday' },
      { DayID: 7, DayName: 'Saturday' }
    ];

  }


  async BindSubject() {
    this.TableForm.patchValue({     
      SubjectID: 0,      
    });
    const GetstreamId = this.TableForm.get('StreamID')?.value;
    const GetSemesterID = this.TableForm.get('SemesterID')?.value;
    debugger
    let obj = {
      Action: "GET_BY_ID",
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      StreamID: GetstreamId,

    }
    await this.staffMasterService.GetBranchSectionData(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetSectionData = data.Data;
        this.allSections = data.Data;
        this.GetSectionData = [...this.allSections];
      }, (error: any) => console.error(error)
      );





    this.getSubjectMasterDDL(this.TableForm.get('StreamID')?.value, this.TableForm.get('SemesterID')?.value)

  }




  resetForm(): void {
    this.filterModel = {
      StaffID: 0,
      SubjectID: 0,
      InstituteID: 0,
      SemesterID: 0,
      /*AttendanceDate: '',*/
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      CourseTypeID: this.sSOLoginDataModel.Eng_NonEng
    };
    this.totalRecords = 0;
    this.displayedColumns = [];
    this.filterData = [];
    this.GetAllRosterDisplay();
  }

  buildDynamicColumns(): void {
    if (!this.filterData.length) return;

    const sampleItem = this.filterData[0];
    const columnKeys = Object.keys(sampleItem);

    // List of columns you want to exclude
    const excludedColumns = ['ID', 'InstituteID', 'SubjectID', 'EndTermName', 'SemesterID', 'StaffID', 'StreamID', 'CourseTypeID', 'DepartmentID', 'EndTermID'];

    this.columnSchema = columnKeys
      .filter(key => !excludedColumns.includes(key))
      .map(key => ({
        key,
        label: this.formatColumnLabel(key),
        isDate: key.toLowerCase().includes('date')
      }));



    /*this.columnSchema.push({ key: 'Action', label: 'Action', isAction: true });*/
    this.displayedColumns = this.columnSchema.map(col => col.key);
  }

  formatColumnLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.updateTable();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  exportToExcel(): void {
    const filteredData = this.filterData.map(({ StudentID, ...rest }) => rest);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `RosterDasplay.xlsx`);
  }

  saveAttendance() {
    this.isSubmitted = true;
    if (this.AddedSectionList.length == 0) {
      this.toastr.warning('Please select at least one row');
      return;
    }


    //if (this.TableForm.invalid) {
    //  return;
    //}

  
    const formValue = this.TableForm.value;
    this.AddedSectionList.forEach((element: any) => {

      element.CreatedBy = this.sSOLoginDataModel.UserID;
      element.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      element.EndTermID = this.sSOLoginDataModel.EndTermID;      
      element.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      element.InstituteID = this.sSOLoginDataModel.InstituteID;

    })
 
    debugger
    this.staffMasterService.SaveRosterDisplayMultiple(this.AddedSectionList)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.AddedSectionList = [];
          this.routers.navigate(['/roster-display-list']);
          this.toastr.success(data.Message);
          this.reset();
        }
        if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        }
        if (data.State === EnumStatus.Error) {
          this.toastr.error(data.Message);
        }
      }, error => console.error(error));
  }

 async AddMore() {
  
  this.isSubmitted = true;

  if (this.TableForm.invalid) {
    this.toastr.warning('Please fill all required fields!');
    return;
  }

  const formValue = this.TableForm.value;

  const newSection = new BTERSectionAddDataModel();
  newSection.DayID = formValue.DayID;
  newSection.SemesterID = formValue.SemesterID;
  newSection.StreamID = formValue.StreamID;
  newSection.SubjectID = formValue.SubjectID;
   newSection.StaffID = formValue.StaffID;
  newSection.SectionID = Array.isArray(formValue.SectionID) ? formValue.SectionID : [formValue.SectionID];
   newSection.AttendanceStartTime = formValue.AttendanceStartTime;
   newSection.AttendanceEndTime = formValue.AttendanceEndTime;
   newSection.RoomNo = formValue.RoomNo;



  // --- VALIDATION CHECKS ---

   const startNum = this.convertTo24Hour(newSection.AttendanceStartTime);
   const endNum = this.convertTo24Hour(newSection.AttendanceEndTime);
   const durationMinutes = this.getMinutesDiff(newSection.AttendanceStartTime, newSection.AttendanceEndTime);

   // 1. Lunch time block
   if (startNum === 1300 && endNum === 1400) {
     this.toastr.warning('Entries are not allowed during lunch time (1 PM - 2 PM).');
     return;
   }

   // 2. No classes after 5 PM
   //if (startNum >= 1700 || endNum > 1700) {
   //  this.toastr.warning('Entries are not allowed after 5 PM.');
   //  return;
   //}

   // 3. End time cannot be before start time
   if (durationMinutes < 0) {
     this.toastr.warning('End time cannot be earlier than start time.');
     return;
   }

   // 4. Class cannot exceed 1 hour
   if (durationMinutes > 60) {
     this.toastr.warning('Class duration cannot be more than 1 hour.');
     return;
   }

   if (durationMinutes < 45) {
     this.toastr.warning(`Class duration must be at least 45 minutes.`);
     return;
   }
   // 5. Teacher conflict check
   const teacherConflict = this.AddedSectionList.some((element: BTERSectionAddDataModel) => {
     const existingStart = this.convertTo24Hour(element.AttendanceStartTime);
     const existingEnd = this.convertTo24Hour(element.AttendanceEndTime);

     const timeOverlap =
       (startNum < existingEnd && endNum > existingStart);

     return (
       element.StaffID === newSection.StaffID &&
       element.SemesterID === newSection.SemesterID &&
       element.StreamID === newSection.StreamID &&
       element.SectionID.some(id => newSection.SectionID.includes(id)) &&
       timeOverlap
     );
   });

   if (teacherConflict) {
     this.toastr.warning('This teacher already has a class in the same semester, branch, section, and time.');
     return;
   }

   // 6. Section conflict check (ANY teacher, same section/subject/time)
   const sectionConflict = this.AddedSectionList.some((element: BTERSectionAddDataModel) => {
     const existingStart = this.convertTo24Hour(element.AttendanceStartTime);
     const existingEnd = this.convertTo24Hour(element.AttendanceEndTime);

     const timeOverlap =
       (startNum < existingEnd && endNum > existingStart);

     return (
       element.SemesterID === newSection.SemesterID &&
       element.StreamID === newSection.StreamID &&
       element.SubjectID === newSection.SubjectID &&
       element.SectionID.some(id => newSection.SectionID.includes(id)) &&
       timeOverlap
     );
   });

   if (sectionConflict) {
     this.toastr.warning('Another teacher is already assigned for the same subject, section, and time.');
     return;
   }


   // 7. Global teacher time conflict (across all semesters/streams/sections)
   const globalTeacherConflict = this.AddedSectionList.some((element: BTERSectionAddDataModel) => {
     if (element.StaffID !== newSection.StaffID) return false;

     const existingStart = this.convertTo24Hour(element.AttendanceStartTime);
     const existingEnd = this.convertTo24Hour(element.AttendanceEndTime);

     const timeOverlap =
       (startNum < existingEnd && endNum > existingStart); // overlap check

     return timeOverlap;
   });

   if (globalTeacherConflict) {
     this.toastr.warning('This teacher is already assigned in another slot at the same time.');
     return;
   }
  // 8. Full row duplicate check
  const isDuplicate = this.AddedSectionList.some(
    (element: BTERSectionAddDataModel) =>
      element.DayID === newSection.DayID &&
      element.SemesterID === newSection.SemesterID &&
      element.StreamID === newSection.StreamID &&
      element.SubjectID === newSection.SubjectID &&
      element.StaffID === newSection.StaffID &&
      element.AttendanceStartTime === newSection.AttendanceStartTime &&
      element.AttendanceEndTime === newSection.AttendanceEndTime &&
      JSON.stringify(element.SectionID) === JSON.stringify(newSection.SectionID)
  );

  if (isDuplicate) {
    this.toastr.warning('This roster entry already exists!');
    return;
  }

  // --- NAME BINDING ---
  newSection.DayName = this.DayList.find((x: any) => x.DayID == newSection.DayID)?.DayName || '';
  newSection.SectionName = this.GetSectionData
    .filter((x: any) => newSection.SectionID.includes(x.SectionID))
    .map((x: any) => x.SectionName)
    .join(', ');
  newSection.SubjectName = this.SubjectMasterDDL.find((x: any) => x.ID == newSection.SubjectID)?.Name || '';
  newSection.BranchName = this.StreamMasterDDL.find((x: any) => x.StreamID == newSection.StreamID)?.StreamName || '';
   newSection.TeacherName = this.ExaminerDDL.find((x: any) => x.StaffID == newSection.StaffID)?.Name || '';
  newSection.SemesterName = this.SemesterMasterDDL.find((x: any) => x.SemesterID == newSection.SemesterID)?.SemesterName || '';

  //newSection.StartTime = this.formatTime(formValue.AttendanceStartTime);
  //newSection.EndTime = this.formatTime(formValue.AttendanceEndTime);

  this.AddedSectionList.push(newSection);

  this.toastr.success('Roster entry added successfully.');

  // Reset form fields
  this.TableForm.patchValue({
    DayID: 0,
    SectionID: 0,
    SubjectID: 0,
    StreamID: 0,
    StaffID: 0,
    SemesterID: 0,
    AttendanceStartTime: '09:00 AM',
    AttendanceEndTime: '10:00 AM',
    RoomNo: ''
  });

  this.isSubmitted = false;
}


  //async AddMore() {
  //  debugger
  //  this.isSubmitted = true;


  //  if (this.TableForm.invalid) {
  //    this.toastr.error('Please Fill All Star mark details!');
  //    return;
  //  }


  //  const formValue = this.TableForm.value;


  //  const newSection = new BTERSectionAddDataModel();
  //  newSection.DayID = formValue.DayID;
  //  newSection.SemesterID = formValue.SemesterID;
  //  newSection.StreamID = formValue.StreamID;
  //  newSection.SubjectID = formValue.SubjectID;
  //  newSection.TeacherID = formValue.StaffID;
  //  newSection.SectionID = Array.isArray(formValue.SectionID) ? formValue.SectionID : [formValue.SectionID];
  //  newSection.StartTime = formValue.AttendanceStartTime;
  //  newSection.EndTime = formValue.AttendanceEndTime;
   
   

  //  const isDuplicate = this.AddedSectionList.some(
  //    (element: BTERSectionAddDataModel) =>
  //      element.DayID === newSection.DayID &&
  //      element.SemesterID === newSection.SemesterID &&
  //      element.StreamID === newSection.StreamID &&
  //      element.SubjectID === newSection.SubjectID &&
  //      element.TeacherID === newSection.TeacherID &&
  //      element.StartTime === newSection.StartTime &&
  //      element.EndTermID === newSection.EndTermID
  //  );

  //  if (isDuplicate) {
  //    this.toastr.error('This roster entry already exists!');
  //    return;
  //  }

  //  newSection.DayName = this.DayList.find(
  //    (x: any) => x.DayID == newSection.DayID
  //  )?.DayName || '';

  //  newSection.SectionName = this.GetSectionData
  //    .filter((x: any) => newSection.SectionID.includes(x.SectionID))
  //    .map((x: any) => x.SectionName)
  //    .join(', ');
  //  newSection.SubjectName = this.SubjectMasterDDL.find(
  //    (x: any) => x.ID == newSection.SubjectID
  //  )?.Name || '';

  //  newSection.BranchName = this.StreamMasterDDL.find(
  //    (x: any) => x.StreamID == newSection.StreamID
  //  )?.StreamName || '';
   

  //  newSection.TeacherName = this.ExaminerDDL.find(
  //    (x: any) => x.StaffID == newSection.TeacherID
  //  )?.Name || '';

  //  newSection.SemesterName = this.SemesterMasterDDL.find(
  //    (x: any) => x.SemesterID == newSection.SemesterID
  //  )?.SemesterName || '';


  //  newSection.StartTime = this.formatTime(formValue.AttendanceStartTime);
  //  newSection.EndTime = this.formatTime(formValue.AttendanceEndTime);


  //  this.AddedSectionList.push(newSection);
   
  //  this.toastr.success('Roster entry added successfully');

  //  // Reset form fields
  //  this.TableForm.patchValue({
  //    DayID: 0,
  //    SectionID: 0,
  //    SubjectID: 0,
  //    StreamID: 0,
  //    StaffID: 0,
  //    SemesterID: 0,
  //    AttendanceStartTime: '09:00',
  //    AttendanceEndTime: '10:00'
  //  });

  //  this.isSubmitted = false;
  //}

  getMinutesDiff(start: string, end: string): number {
    const startNum = this.convertTo24Hour(start);
    const endNum = this.convertTo24Hour(end);

    // convert HHmm -> minutes
    const startMinutes = Math.floor(startNum / 100) * 60 + (startNum % 100);
    const endMinutes = Math.floor(endNum / 100) * 60 + (endNum % 100);

    return endMinutes - startMinutes; // positive -> valid duration
  }
  convertTo24Hour(time: string): number {
    if (!time) return 0;

    // Example: "1:05 PM" -> ["1", "05 PM"]
    let [hourStr, minuteStrWithMeridian] = time.split(":");
    let minuteStr = minuteStrWithMeridian.substring(0, 2); // "05"
    let meridian = minuteStrWithMeridian.slice(-2).toUpperCase(); // "AM"/"PM"

    let hour = parseInt(hourStr, 10);
    let minute = parseInt(minuteStr, 10);

    if (meridian === "PM" && hour !== 12) {
      hour += 12;
    }
    if (meridian === "AM" && hour === 12) {
      hour = 0; // midnight case
    }

    return hour * 100 + minute; // e.g. 13:05 -> 1305
  }

  reset() {
    this.TableForm.reset();
    this.isSubmitted = false;
    this.TableForm.patchValue({
      SubjectID: 0,
      StreamID: 0,
      StaffID: 0,
      DayID: 0,
      SectionID: 0,
      SemesterID: 0,
      /* AttendanceDate: new Date(),*/
      AttendanceStartTime: '09:00 AM',
      AttendanceEndTime: '10:00 AM',
      RoomNo: ''
    });
  }

  formatTime(time: string): string {
    if (!time) return "";

    let [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    let minute = parseInt(minuteStr, 10);

    let meridian = "AM";

    if (hour === 0) {
      hour = 12; // midnight
      meridian = "AM";
    } else if (hour === 12) {
      meridian = "PM"; // noon
    } else if (hour > 12) {
      hour = hour - 12;
      meridian = "PM";
    } else {
      meridian = "AM";
    }

    return `${hour}:${minute.toString().padStart(2, "0")} ${meridian}`;
  }

  DeleteRow(item: BTERSectionAddDataModel) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          //debugger
            const index: number = this.AddedSectionList.indexOf(item);
            if (index != -1) {
              this.AddedSectionList.splice(index, 1)
              this.toastr.success("Deleted sucessfully")
              this.cd.detectChanges();
            }
          

        }

      });
  }

  trackByFn(index: number, item: any): any {
    return item.id || index; // use unique ID if available
  }
}


