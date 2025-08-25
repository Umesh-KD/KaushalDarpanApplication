import { Component } from '@angular/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { InvigilatorSearchModel, UnlockExamAttendanceDataModel } from '../../../Models/InvigilatorAppointmentDataModel';
import { SetExamAttendanceModel, SetExamAttendanceSearchModel } from '../../../Models/SetExamAttendanceDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
import { InvigilatorAppointmentService } from '../../../Services/InvigilatorAppointment/invigilator-appointment.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SetExamAttendanceService } from '../../../Services/SetExamAttendance/set-exam-attendance.service';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unlock-exam-attendance',
  standalone: false,
  templateUrl: './unlock-exam-attendance.component.html',
  styleUrl: './unlock-exam-attendance.component.css'
})
export class UnlockExamAttendanceComponent {
  searchRequest = new InvigilatorSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchStaffMasterSearchModel = new StaffMasterSearchModel();
  public InvigilatorAppointmentList: any[] = [];
  public ViewInvigilatorAppointmentList: any[] = [];
  public attendanceFormData: SetExamAttendanceModel[] = [];
  public students: any = [];
  public ExamShiftList: any = [];
  public searchRequet = new SetExamAttendanceSearchModel();
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public StaffMasterList: any = [];
  public InstituteMasterDDLList: any = []
  public _GlobalConstants: any = GlobalConstants;
  request = new UnlockExamAttendanceDataModel();

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.searchRequest.action = "_getListForInvigilator";
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.ShiftID = 0
    this.getCenterMasterList()
    this.GetExamShift()
  }
  constructor(
    private loaderService: LoaderService, 
    private setExamAttendanceService: SetExamAttendanceService,
    private invigilatorAppointmentService: InvigilatorAppointmentService, 
    private modalService: NgbModal,
    private staffMasterService: StaffMasterService, 
    private Swal2: SweetAlert2, 
    public appsettingConfig: AppsettingService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
  ) { }

  async getCenterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
        console.log("InstituteMasterDDLList", this.InstituteMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetExamShift() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamShift()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamShiftList = data['Data'];
          console.log("this.ExamShiftList", this.ExamShiftList)
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getAllData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

    if (this.searchRequest.InstituteID ==0) {
      this.toastr.warning("Please select Center")
      return;
    }
    try {
      this.loaderService.requestStarted();
      await this.invigilatorAppointmentService.UnlockExamAttendance_GetCSData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InvigilatorAppointmentList = data.Data;
        console.log("ssoList", this.InvigilatorAppointmentList);
      }, error => console.error(error))
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ViewDetails(content: any, UserID: number) {

    this.ViewInvigilatorAppointmentList=[]
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.ViewInvigilatorAppointmentList = this.InvigilatorAppointmentList.filter((e: any) => e.TimeTableID == UserID)

    //this.searchRequet.TimeTableID = UserID
    //this.searchRequet.EndTermID = this.sSOLoginDataModel.EndTermID;
    //await this.getExamStudentData();
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

  CloseModalPopup() {
    this.modalService.dismissAll();
    this.searchRequet.InvigilatorAppointmentID = 0
  }


  async getExamStudentData() {
    this.searchRequet.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequet.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequet.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequet.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequet.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequet.UserID = this.sSOLoginDataModel.UserID
    try {
      this.loaderService.requestStarted();

      await this.setExamAttendanceService.GetExamStudentData(this.searchRequet).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.students = data.Data;
        console.log("this.students", this.students)
        this.attendanceFormData = this.students.map((student: any) => {
          console.log(this.attendanceFormData, "listAttend")
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
          attendanceModel.Attendence_Dis_FileName = student.Attendence_Dis_FileName
          attendanceModel.Attendence_FileName = student.Attendence_FileName
          attendanceModel.SubjectName = student.SubjectName
          attendanceModel.StreamName = student.StreamName

          attendanceModel.StudentExamPaperID = student.StudentExamPaperID;

          return attendanceModel;
        });

      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async UnlockExamAttendance(item: any) {

    this.Swal2.Confirmation("Are you sure? You want to Unlock Student Exam Attendance for This superintendent?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            this.request.UserID = this.sSOLoginDataModel.UserID
            this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
            this.request.EndTermID = this.sSOLoginDataModel.EndTermID
            this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
            this.request.CenterSuperintendentID = item.CenterSuperintendentID
            this.request.TimeTableID = item.TimeTableID

            await this.invigilatorAppointmentService.UnlockExamAttendance(this.request).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if(data.State == EnumStatus.Success){
                this.toastr.success(data.Message)
              }
            }, error => console.error(error))
          } catch (error) {
            console.error(error);
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
  }

}
