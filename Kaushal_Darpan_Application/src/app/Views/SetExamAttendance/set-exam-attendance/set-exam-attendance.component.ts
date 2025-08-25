import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SetExamAttendanceModel, SetExamAttendanceSearchModel } from '../../../Models/SetExamAttendanceDataModel';
import { SetExamAttendanceService } from '../../../Services/SetExamAttendance/set-exam-attendance.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumProfileStatus, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-set-exam-attendance',
    templateUrl: './set-exam-attendance.component.html',
    styleUrls: ['./set-exam-attendance.component.css'],
    standalone: false
})
export class SetExamAttendanceComponent implements OnInit {
  public ExamAttendanceFormGroup!: FormGroup;
  public SemesterMasterDDL: any = []
  public SubjectMasterDDL: any = []
  public StreamMasterList: any = []
  public searchRequest = new SetExamAttendanceSearchModel();
  public attendanceFormData: SetExamAttendanceModel[] = [];
  public attendence = new SetExamAttendanceModel()
  public AttendancePhoto: string = ''
  public Dis_AttendancePhotoName: string = ''
  public isFileUploaded: boolean = false
  public Table_SearchText: string = "";
  public isAnyUFMSelected: boolean = false;
  public model = new UploadFileModel();
  displayedColumns: string[] = ['StudentName', 'StudentRollNo', 'IsPresent', 'IsUFM', 'IsDetain', 'SubjectName', 'StreamName'];
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public Message: string = '';
  public isLocked: boolean = false ;

  public students: any = [];
  public file!: File;
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchStaffMasterSearchModel = new StaffMasterSearchModel();

  public _GlobalConstants: any = GlobalConstants;
  public StaffMasterList: any = [];
  dataSource: MatTableDataSource<SetExamAttendanceModel> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  //startInTableIndex: number = 1;
  //endInTableIndex: number = 10;
  filteredData: any[] = [];
  id: any;
  isDisabled: boolean = false
  filterForm: FormGroup | undefined;

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
    private toastr: ToastrService,

    public appsettingConfig: AppsettingService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private setExamAttendanceService: SetExamAttendanceService,
    private staffMasterService: StaffMasterService


  ) { }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.searchRequest.InvigilatorAppointmentID = this.sSOLoginDataModel.UserID
  await  this.CheckProfileStatus();
    //search params
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.TimeTableID = Number(this.activatedRoute.snapshot.queryParamMap.get("id") ?? 0);
    this.searchRequest.InstituteID = Number(this.activatedRoute.snapshot.queryParamMap.get("InstituteID") ?? 0);

    this.getExamStudentData();
  }

  onUfmChange(student: any) {
    
    if (student.IsUFM) {
      this.paginatedInTableData
      if (this.paginatedInTableData.some((x: any) => x.IsUFM)) {
        this.isAnyUFMSelected = true
      } else if (this.paginatedInTableData.every((x: any) => x.IsUFM )) {
        this.isAnyUFMSelected = true
      }
      else {
        this.isAnyUFMSelected = false
      }
      if (student.IsUFM) {
        student.ShowRemark = true;
      } else {
        student.ShowRemark = false;
        student.Remark = '';
      }
      student.IsPresent = true;
      student.IsDetain = false;
    }
  }

  onDetainedChange(student: any) {
    if (student.IsDetain) {
      student.IsPresent = false;
    } else {
      student.IsPresent = true;
    }
  }

  onPresentChange(student: any) {
    if (student.IsPresent==false) {
      student.IsUFM = false;
      student.UFMDocument = '';
    }
  }

  async getExamStudentData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID
    
    try {
      this.loaderService.requestStarted();

      await this.setExamAttendanceService.GetExamStudentData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.students = data.Data;
        console.log("this.students", this.students)

        this.attendanceFormData = this.students.map((student: any) =>
        {
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
          attendanceModel.rowclass = student.rowclass;
          attendanceModel.isFinalSubmit = student.isFinalSubmit;
          this.onUfmChange(student);
          return attendanceModel;
        });

        this.isLocked = this.attendanceFormData.every(item => item.isFinalSubmit === true);

        
        this.loadInTable();
        this.Dis_AttendancePhotoName = this.students[0].Attendence_Dis_FileName
        this.AttendancePhoto = this.students[0].Attendence_FileName
       
         this.isFileUploaded = true
        console.log("this.attendanceFormData", this.attendanceFormData)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async ClearSearchData() {
    this.searchRequest = new SetExamAttendanceSearchModel();
    this.SubjectMasterDDL = [];
    this.attendanceFormData = [];
  }

  async onFilechange(event: any, Type: string, row: any) {
    try {
      this.file = event.target.files[0];  
      if (this.file) {

        if (['image/jpeg', 'image/jpg', 'image/png','application/pdf'].includes(this.file.type)) {
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        } else {
          this.toastr.error('Select Only jpeg/jpg/png file');
          return;
        }
        
        this.loaderService.requestStarted();
        this.model.FolderName = "Students";
        await this.commonMasterService.UploadDocument(this.file, this.model)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log("image data", data);
            if (data.State === EnumStatus.Success) {
              if (Type == "Document") {
                row.UFMDocument = data['Data'][0]["FileName"];
                row.Dis_UFMDocument = data['Data'][0]["Dis_FileName"];
                console.log(row, 'ListRequest')
                event.target.value = null;
              }
              else if (Type == "attendance") {
                this.AttendancePhoto = data['Data'][0]["FileName"];
                this.Dis_AttendancePhotoName = data['Data'][0]["Dis_FileName"];
            
                this.isFileUploaded = true;
              }
              
            }

            if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);
            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }

            event.target.value = null;
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DeleteImage(FileName: any, Type: string) {
    this.Dis_AttendancePhotoName = ''
    this.AttendancePhoto = ''
  }

  DeleteDocument(row: any) {
    row.UFMDocument = ''; 
    console.log('Document deleted for:', row.RollNo);
  }

  async LockandSubmit() {
    this.isSubmitted = true;


      if (this.AttendancePhoto == '') {
        this.toastr.error("Please Add Attendence Sheet")
        return
      }
      
    this.Swal2.Confirmation("Are you sure? <br> Once Submitted, It can't be edited anymore.",
      async (result: any) => {
        if (result.isConfirmed) {
          this.SaveData();
        }
      });

  }

  async SaveData() {
    this.loaderService.requestStarted();
    try {
      
      this.loaderService.requestStarted();

      this.attendanceFormData.forEach(x => {
        x.ModifyBy = this.sSOLoginDataModel.UserID;
        x.Attendence_Dis_FileName = this.Dis_AttendancePhotoName;
        x.Attendence_FileName = this.AttendancePhoto;
        x.isFinalSubmit = true
      });

      console.log("save data list" + this.attendanceFormData);
      
      await this.setExamAttendanceService.SaveData(this.attendanceFormData, this.searchRequest.InvigilatorAppointmentID)
        .then((data: any) => {
         
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            window.location.href ='/InvigilatorExamList'
            this.ResetControls();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }, (error: any) => console.error(error)
      );
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

  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      this.searchStaffMasterSearchModel.Action = '_checkProfileStatus'
      this.searchStaffMasterSearchModel.SSOID = this.sSOLoginDataModel.SSOID;
      this.searchStaffMasterSearchModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      await this.staffMasterService.GetAllData(this.searchStaffMasterSearchModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];

          if (this.StaffMasterList.length > 0) {
            let status = this.StaffMasterList[0].ProfileStatus;
            if (status == EnumProfileStatus.Pending) {
              this.Swal2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
                window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self")
              }, 'OK', false);
            }
          }

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

  ResetControls() {
    this.getExamStudentData();
    this.Dis_AttendancePhotoName = '';
    this.AttendancePhoto = '';
    this.isFileUploaded = false
  }

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

}


