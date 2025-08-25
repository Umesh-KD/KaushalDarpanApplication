import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { InvigilatorAppointmentService } from '../../../Services/InvigilatorAppointment/invigilator-appointment.service';
import { InvigilatorSearchModel } from '../../../Models/InvigilatorAppointmentDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
import { EnumProfileStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SetExamAttendanceService } from '../../../Services/SetExamAttendance/set-exam-attendance.service';
import { SetExamAttendanceModel, SetExamAttendanceSearchModel } from '../../../Models/SetExamAttendanceDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';



@Component({
  selector: 'app-invigilator-exam-list',
  templateUrl: './invigilator-exam-list.component.html',
  styleUrls: ['./invigilator-exam-list.component.css'],
  standalone: false
})
export class InvigilatorExamListComponent implements OnInit {
  searchRequest = new InvigilatorSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchStaffMasterSearchModel = new StaffMasterSearchModel();
  public InvigilatorAppointmentList: any[] = [];
  public ViewInvigilatorAppointmentList: any[] = [];
  public attendanceFormData: SetExamAttendanceModel[] = [];
  public students: any = [];
  public searchRequet = new SetExamAttendanceSearchModel();
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public StaffMasterList: any = [];

  public _GlobalConstants: any = GlobalConstants;




  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.CheckProfileStatus();
    this.searchRequest.action = "_getListForInvigilator";
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    await this.getAllData();
  }
  constructor(private loaderService: LoaderService, private setExamAttendanceService: SetExamAttendanceService,
    private invigilatorAppointmentService: InvigilatorAppointmentService, private modalService: NgbModal,
    private staffMasterService: StaffMasterService, private Swal2: SweetAlert2, public appsettingConfig: AppsettingService) {
  }

  async getAllData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

    try {
      this.loaderService.requestStarted();
      await this.invigilatorAppointmentService.GetAllData(this.searchRequest).then((data: any) => {
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


  async ViewandUpdate(content: any, UserID: number) {


    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.searchRequet.TimeTableID = UserID
    this.searchRequet.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID
    await this.getExamStudentData();
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
}
