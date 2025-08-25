import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AppsettingService } from '../../Common/appsetting.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { StaffMasterService } from '../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../Common/GlobalConstants';

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
  SubjectMasterDDL: any[] = [];
  GetSectionData: any[] = [];
  InstituteMasterDDL: any[] = [];
  DistrictMasterDDL: any[] = [];
  ExaminerDDL: any[] = [];
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
    AttendanceDate: ''
  };
  constructor(
    private fb: FormBuilder,
    private staffMasterService: StaffMasterService,
    private http: HttpClient, private route: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService) {
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
      SubjectID: [0, [Validators.required, DropdownValidators]],
      StreamID: [0, [Validators.required, DropdownValidators]],
      StaffID: [0, [Validators.required, DropdownValidators]],
      SemesterID: [0, [Validators.required, DropdownValidators]],
      AttendanceDate: [new Date(), Validators.required],
      AttendanceStartTime: ['09:00', Validators.required],
      AttendanceEndTime: ['10:00', Validators.required]
    });
    this.getMasterData();
    this.GetAllRosterDisplay();
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
      this.getSubjectMasterDDL(this.streamId, this.semesterId);
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

  resetForm(): void {
    this.filterModel = {
      StaffID: 0,
      SubjectID: 0,
      InstituteID: 0,
      SemesterID: 0,
      AttendanceDate: '',
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

    if (this.TableForm.invalid) {
      return;
    }

    const formValue = this.TableForm.value;

    // Now you can include these in the final payload
    const attendancePayload = {
      ...formValue,
      InstituteID: this.sSOLoginDataModel.InstituteID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      Action: "INSERT",
      ID: 0,
      ActiveStatus: 1,
      DeleteStatus: 0,
      CreatedBy: this.sSOLoginDataModel.RoleID,
      ModifyBy: this.sSOLoginDataModel.RoleID
    };

    this.staffMasterService.SaveRosterDisplay(attendancePayload)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.GetAllRosterDisplay();
          this.toastr.success(data.Message);
          this.reset();
        }
        if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.ErrorMessage);
        }
        if (data.State === EnumStatus.Error) {
          this.toastr.error(data.ErrorMessage);
        }
      }, error => console.error(error));
  }


  reset() {
    this.TableForm.reset();
    this.isSubmitted = false;
    this.TableForm.patchValue({
      SubjectID: 0,
      StreamID: 0,
      StaffID: 0,
      SemesterID: 0,
      AttendanceDate: new Date(),
      AttendanceStartTime: '09:00',
      AttendanceEndTime: '10:00'
    });
  }
}
