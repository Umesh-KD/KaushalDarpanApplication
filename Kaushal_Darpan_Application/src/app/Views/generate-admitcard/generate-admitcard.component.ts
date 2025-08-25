import { Component } from '@angular/core';
import { GenerateRollData, GenerateRollSearchModel } from '../../Models/GenerateRollDataModels';
import { EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { GetEnrollService } from '../../Services/GenerateEnroll/generateEnroll.service';
import { GetRollService } from '../../Services/GenerateRoll/generate-roll.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';
import { GenerateEnrollData } from '../../Models/GenerateEnrollDataModel';
import { GetAdmitCardService } from '../../Services/GenerateAdmitCard/generateAdmitCard.service';
import { GenerateAdmitCardModel, GenerateAdmitCardSearchModel } from '../../Models/GenerateAdmitCardDataModel';
import { ReportService } from '../../Services/Report/report.service';
import { AppsettingService } from '../../Common/appsetting.service';

@Component({
    selector: 'app-generate-admitcard',
    templateUrl: './generate-admitcard.component.html',
    styleUrls: ['./generate-admitcard.component.css'],
    standalone: false
})
export class GenerateAdmitcardComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public Table_SearchText: any = '';
  public StudentList: GenerateAdmitCardModel[] = []
  public InstituteMasterList: any = []
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new GenerateAdmitCardSearchModel()
  public InitialValue: number = 0
  public UserID: number = 0
  public AllSelect: boolean = false
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isGenerateDisabled: boolean = false;
  public isReGenerateVisible: boolean = false;
  public PublishVisible: boolean = false
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

 /* _GlobalConstants: GlobalConstants = GlobalConstants;*/
  constructor(
    private commonMasterService: CommonFunctionService,
    private getAdmitCardService: GetAdmitCardService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private reportService: ReportService,
    private sMSMailService: SMSMailService, private cookieService: CookieService,
    private appsettingConfig: AppsettingService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    console.log(this.sSOLoginDataModel);
    this.getSemesterMasterList();
    this.getStreamMasterList();
    this.ddlStream_Change()

    this.getExamMasterList()
    this.getInstituteMasterList()
  }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
        console.log("SemesterMasterDDLList", this.SemesterMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getExamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamName().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamList = data.Data;
        console.log("ExamList", this.ExamList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
        console.log("StreamMasterDDLList", this.StreamMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetAllData() {
    this.StudentList = []
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    try {
      this.loaderService.requestStarted();

      await this.getAdmitCardService.GetGenerateAdmitCardData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];
            console.log(this.StudentList, "Studentlist")
            this.updateButtonStates()
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

  async getInstituteMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterList = data.Data;

        console.log("InstituteMasterList", this.InstituteMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.StudentList) {
      item.Marked = this.AllSelect;
    }
  }
  async SaveAllData() {
    this.isSubmitted = true;
    try {
      this.loaderService.requestStarted();

      const isAnySelected = this.StudentList.some(x => x.Marked)
      if (!isAnySelected) {
        this.toastr.error('Please select at least one student!');
        return;
      }
      const selectedStudents = this.StudentList.filter(student => student.Marked)
      console.log(' student Subjects:', selectedStudents);
      this.StudentList.forEach((item) => {
        item.ModifyBy = this.sSOLoginDataModel.UserID
      })
      //Genrate
      //await this.reportService.GetStudentAdmitCard(selectedStudents)
      //  .then(async (data: any) => {
      //    this.State = data['State'];
      //    this.Message = data['Message'];
      //    this.ErrorMessage = data['ErrorMessage'];
      //    if (this.State == EnumStatus.Success) {
      //      this.toastr.success(this.Message)
      //      await this.ResetControl()
      //      await this.GetAllData();
      //    }
      //    else {
      //      this.toastr.error(this.ErrorMessage)
      //    }
      //  })
      //  .catch((error: any) => {
      //    console.error(error);
      //    this.toastr.error('Failed to Action Short List!');
      //  });
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

  updateButtonStates() {
    const hasEnrollmentNumbers = this.StudentList.some((student) => student.RollNumber)
    console.log(hasEnrollmentNumbers, "hasEnrollmentNumbers")
    if (hasEnrollmentNumbers) {

      this.isGenerateDisabled = true;
      this.isReGenerateVisible = true
    } else {
      this.isGenerateDisabled = false;

    }

    const allEnroll = this.StudentList.every((student) => student.RollNumber)
    if (allEnroll == true) {
      this.PublishVisible = true
    }
    // Disable "Generate Enroll" button



  }

  async ddlStream_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.searchRequest.StreamID, this.sSOLoginDataModel.DepartmentID, this.searchRequest.SemesterID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterDDLList = data.Data;
          console.log("SubjectMasterDDLList", this.SubjectMasterDDLList)
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




  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new GenerateAdmitCardSearchModel()

    this.SubjectMasterDDLList = [];
    this.StudentList = [];
    this.AllSelect = false


  }

  async OnPublish() {

    this.isSubmitted = true;
    //
    /*    this.refreshBranchRefValidation(true);*/
    //
    //if (this.PlacementShortListStudentForm.invalid) {CloseViewStudentDetailsEditStudentData
    //  return console.log("error")
    //}



    try {
      this.loaderService.requestStarted();



      const selectedStudents = this.StudentList.filter(student => student.Marked)
      console.log(' student Subjects:', selectedStudents);

      this.StudentList.forEach((item) => {
        item.ModifyBy = this.sSOLoginDataModel.UserID
      })


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





  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.OnPublish()
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
      else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      //this.sSOLoginDataModel.Mobileno = "8905268611";
      await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, "OTP")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.startTimer();
            //open modal popup
            this.GeneratedOTP = data['Data'];
            if (isResend) {
              this.toastr.success('OTP resent successfully');
            }
          }
          else {
            this.toastr.warning('Something went wrong');
          }
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



  //Start Section Model
  async openModalGenerateOTP(content: any) {
    const isAnySelected = this.StudentList.some(x => x.Marked)
    if (!isAnySelected) {
      this.toastr.error('Please select at least one students(s)!');
      return;
    }

    this.Swal2.Confirmation("Are you sure you want to publish?", async (result: any) => {
      // Check if the user confirmed the action
      if (result.isConfirmed) {
        this.isSubmitted = true;
        // Any additional logic or actions can be placed here if needed

        this.OTP = '';
        this.MobileNo = '';
        this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });


        this.SendOTP();






      }
    });


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

    this.modalService.dismissAll();
  }

  resetOTPControls() {
    this.OTP = "";
    this.GeneratedOTP = "";

  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;


    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true; // Show the button when time is up
      }
    }, 1000); // Update every second
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  //Modal Section END

  ResetAdmitCard(item: any) {
    item.AdmitCard = '';
  }



}
