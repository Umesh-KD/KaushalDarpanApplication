import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { InternalPracticalStudentService } from '../../../Services/InternalPracticalStudent/internal-practical-assessment-student.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { TheoryMarksSearchModel } from '../../../Models/TheoryMarksDataModels';
import { SetExamAttendanceModel, SetExamAttendanceSearchModel } from '../../../Models/SetExamAttendanceDataModel';
import { SetExamAttendanceService } from '../../../Services/SetExamAttendance/set-exam-attendance.service';
import * as XLSX from 'xlsx';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-internal-practical-exam-attendance',
  standalone: false,
  templateUrl: './internal-practical-exam-attendance.component.html',
  styleUrl: './internal-practical-exam-attendance.component.css'
})
export class InternalPracticalExamAttendanceComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  InternalPracticalID: number = 0;
  IsView: boolean = false;
  // public searchRequest = new TheoryMarksSearchModel();
  public searchRequest = new SetExamAttendanceSearchModel();
  public students: any = [];
  public attendanceFormData: SetExamAttendanceModel[] = [];
  public isSubmitted: boolean = false;
  displayedColumns: string[] = ['StudentName', 'StudentRollNo', 'IsPresent', 'IsUFM', 'IsDetain', 'SubjectName', 'StreamName'];
  public Table_SearchText: string = "";

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

  constructor(
    private commonMasterService: CommonFunctionService,
    private activatedRoute: ActivatedRoute,
    private Router: Router,
    private InternalPracticalStudentService: InternalPracticalStudentService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private streamMasterService: StreamMasterService,
    private appsettingConfig: AppsettingService,
    private setExamAttendanceService: SetExamAttendanceService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    /*this.UserID = this.sSOLoginDataModel.UserID;*/

    this.InternalPracticalID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.searchRequest.InternalPracticalID = this.InternalPracticalID;
    console.log(this.InternalPracticalID)
    if (this.InternalPracticalID == 2) {
      this.IsView = true;
    }
    else {
      this.IsView = false;
    }

    this.getExamStudentData();
    
    //load
    // await this.GetMasterData();
    // await this.GetTheoryMarksList();
  }

  async getExamStudentData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    try {
      this.loaderService.requestStarted();

      await this.setExamAttendanceService.GetExamStudentData_Internal(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.students = data.Data;
        console.log("this.students", this.students)

        this.attendanceFormData = this.students.map((student: any) =>
        {
          console.log(this.attendanceFormData,"listAttend")
          const attendanceModel = new SetExamAttendanceModel();
          attendanceModel.StudentName = student.StudentName;
          attendanceModel.StudentRollNo = student.StudentRollNo;
          attendanceModel.StudentID = student.StudentID; // assuming StudentID is available
          attendanceModel.ActiveStatus = student.Status === 'Active';
          attendanceModel.FinancialYearID = student.FinancialYearID;
          attendanceModel.InstituteID = student.InstituteID;
          attendanceModel.SemesterID = student.SemesterId;
          attendanceModel.SubjectID = student.SubjectID;
          attendanceModel.PaperID = student.PaperID;
          attendanceModel.StreamID = student.StreamID;
          attendanceModel.IsDetain = student.IsDetain;
          attendanceModel.IsPresent = student.IsPresent;
          attendanceModel.IsUFM = student.IsUFM;
          attendanceModel.IsDetain = student.IsDetain;
          attendanceModel.IsDetain = student.IsDetain 
          attendanceModel.StudentExamPaperID = student.StudentExamPaperID;
          attendanceModel.StreamName = student.StreamName;
          attendanceModel.SubjectName = student.SubjectName;
          attendanceModel.StudentExamID = student.StudentExamID;
          attendanceModel.UFMDocument = student.UFMDocument;
          attendanceModel.Dis_UFMDocument = student.Dis_UFMDocument;

          return attendanceModel;
        });

        this.loadInTable();
        // this.Dis_AttendancePhotoName = this.students[0].Attendence_Dis_FileName
        // this.AttendancePhoto = this.students[0].Attendence_FileName
       
        //  this.isFileUploaded = true

      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async SaveData() {
    this.loaderService.requestStarted();
    try {
      this.isSubmitted = true;


      // if (this.AttendancePhoto == '') {
      //   this.toastr.error("Please Add Attendence Sheet")
      //   return
       
      // }
      this.loaderService.requestStarted();

      this.attendanceFormData.forEach(x => {
        x.ModifyBy = this.sSOLoginDataModel.UserID;
        // x.Attendence_Dis_FileName = this.Dis_AttendancePhotoName;
        // x.Attendence_FileName = this.AttendancePhoto;
      });

      console.log("save data list" + this.attendanceFormData);
      
      await this.setExamAttendanceService.SaveData(this.attendanceFormData, this.searchRequest.InvigilatorAppointmentID)
        .then((data: any) => {
         
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          if (data.State = EnumStatus.Success) {
            this.toastr.success(data.Message)
            window.location.href ='/InvigilatorExamList'
            this.ResetControls();
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        }, (error: any) => console.error(error)
      );

        //.catch((error: any) => {
        //  console.error(error);
        //  this.toastr.error('Failed to Action on Selection!');
        //});
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        //this.isSubmitted = false;
      }, 200);
    }
  }

  ResetControls() {
    this.getExamStudentData();
    // this.Dis_AttendancePhotoName = '';
    // this.AttendancePhoto = '';
    // this.isFileUploaded = false
  }

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.attendanceFormData].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }

  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.attendanceFormData] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.attendanceFormData.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.attendanceFormData.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  // end table feature

  exportToExcel(): void {
    const columnsToRemove = ['FinancialYearID', 'InstituteID', 'SemesterID', 'Status', 'StudentID', 'SubjectID', 'PaperID', 'StreamID', 'Attendence_FileName', 'Attendence_Dis_FileName',
      'ActiveStatus', 'DeleteStatus', 'ModifyBy', 'UserID', 'StudentExamPaperID','StudentExamID'];
    const filteredData: any = this.attendanceFormData.map(item => {
      const filteredItem : any = { ...item };
      columnsToRemove.forEach(col => delete filteredItem[col]);
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Attendance_Data_Sheet.xlsx');
  }
}
