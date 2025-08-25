
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumDepartment, EnumStatus, GlobalConstants, enumExamStudentStatus } from '../../../Common/GlobalConstants';
import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { StudentService } from '../../../Services/Student/student.service';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { CookieService } from 'ngx-cookie-service';


import { AppsettingService } from '../../../Common/appsetting.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
  selector: 'app-student-sso-by-tpo-mapping',
  templateUrl: './student-sso-by-tpo-mapping.component.html',
  styleUrls: ['./student-sso-by-tpo-mapping.component.css'],
    standalone: false
})
export class StudentSsoByTpoMappingComponent implements OnInit, OnDestroy {
  public StreamMasterList: [] = [];
  public SemesterList: [] = [];
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public ApplicationNo: string = '';
  public DOB: string = '';
  public StudentDetailsModelList: StudentDetailsModel[] = [];
  public searchRequest = new StudentSearchModel();
  public DateConfigSetting: any = [];
  public _EnumDepartment = EnumDepartment;
  public isShowGrid: boolean = false;
  public searchssoform!: FormGroup
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public isSubmitted: boolean = false
  encryptedParam!: string;
  public DefaultApplicationText: String = '';
  BTER: any;
  ITI: any;
  MapKeyEng: number = 0;
  studentDetailsModel = new StudentDetailsModel();
  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  constructor(private loaderService: LoaderService, private encryptionService: EncryptionService, private commonservice: CommonFunctionService, public appsettingConfig: AppsettingService,
    private studentService: StudentService, private modalService: NgbModal, private toastrService:
      ToastrService, private sMSMailService: SMSMailService, private cookieService: CookieService, private formBuilder: FormBuilder, private Swal2: SweetAlert2) { }

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  

  async ngOnInit()
  {
    this.searchssoform = this.formBuilder.group({
      txtApplicationNo:['', Validators.required],
      txtMobileNo:['', Validators.required],
      DOB: ['', Validators.required],
      ddlDepartment: ['', [DropdownValidators]]
    })
    this.BTER = this.encryptParameter(this._EnumDepartment.BTER);
    this.ITI = this.encryptParameter(this._EnumDepartment.ITI)
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDateConfig()
  }
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  encryptParameter(param: any) {
    return this.encryptionService.encryptData(param);
  }


  get _searchssoform() { return this.searchssoform.controls; }

  async onSearchClick()
  {
    /*if (this.ApplicationNo.length > 0) {*/
      await this.GetAllDataActionWise();
    //}
    //else
    //{
    //  this.toastrService.warning('Please Enter Application No')
    //}
  }

  async ResetControl() {
    this.SemesterID = 0;
    this.StreamID = 0;
    this.ApplicationNo = '';
    this.isShowGrid = false;
    this.StudentDetailsModelList = [];
    this.studentDetailsModel = new StudentDetailsModel();
    this.searchRequest = new StudentSearchModel();
  }
  async GetStreamMaster() {
    this.StreamMasterList = [];
    try {
      this.loaderService.requestStarted();
      await this.commonservice.StreamMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StreamMasterList = data['Data'];
          }
          else {

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
  async GetSemesterMaster() {
    this.SemesterList = [];
    try {
      this.loaderService.requestStarted();

      await this.commonservice.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.SemesterList = data['Data'];
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

  async GetAllDataActionWise()
  {
    this.isSubmitted = true
    if (this.searchssoform.invalid) {
      return
    }
    this.isShowGrid = true;

    this.searchRequest.action =
this.searchRequest.DepartmentID == EnumDepartment.ITI ? "_GetStudentForSsoMapping_ITI" : "_GetStudentForSsoMapping";

    this.searchRequest.DepartmentID = this.searchRequest.DepartmentID;

    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();

      await this.studentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success)
          {
            this.StudentDetailsModelList = data['Data'];
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


  async mapstudent(item: StudentDetailsModel) {
    this.Swal2.Confirmation("Are you sure you want to this student sso mapping?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.searchRequest.studentId = this.studentDetailsModel.StudentID;
            this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;
            this.loaderService.requestStarted();
            await this.studentService.UpdateStudentSsoMapping(this.searchRequest)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State == EnumStatus.Success) {
                  this.toastrService.success('Student Mapped Successfully');
                  //Set User cookie
                  this.sSOLoginDataModel.StudentID = this.studentDetailsModel.StudentID;
                  this.sSOLoginDataModel.DepartmentID = this.searchRequest.DepartmentID;
                  localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
                  this.cookieService.set('LoginStatus', "OK");
                  window.open("StudentDashboard", "_self");
                }
                else {
                  this.toastrService.success(data.Message);
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
      });


   
  }


  async PayFees(item: any) { }

  async VerifyOTP()
  {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP))
      {
        try {
          this.searchRequest.studentId = this.studentDetailsModel.StudentID;
          this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;
      /*    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;*/
          this.loaderService.requestStarted();
          await this.studentService.UpdateStudentSsoMapping(this.searchRequest)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State == EnumStatus.Success)
              {
                this.toastrService.success('Student Mapped Successfully');
                //Set User cookie
                this.sSOLoginDataModel.StudentID = this.studentDetailsModel.StudentID;
                this.sSOLoginDataModel.DepartmentID = this.searchRequest.DepartmentID;
                localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
                this.cookieService.set('LoginStatus', "OK");
                window.open("StudentDashboard", "_self");
              }
              else
              {
                this.toastrService.success(data.Message);
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
      else {
        this.toastrService.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastrService.warning('Please Enter OTP');
    }
  }

  async SendOTP(isResend?: boolean)
  {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      //this.studentDetailsModel.MobileNo = "7737348604";
      await this.sMSMailService.SendMessage(this.studentDetailsModel.MobileNo, "OTP")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success)
          {
            this.startTimer();
            //open modal popup
            this.GeneratedOTP = data['Data'];
            if (isResend)
            {
              this.toastrService.success('OTP resent successfully');
            }
          }
          else
          {
            this.toastrService.warning('Something went wrong');
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
  async openModalGenerateOTP(content: any, item: StudentDetailsModel) {
    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = item.MobileNo;
    this.studentDetailsModel = item;
    this.SendOTP();
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

  resetOTPControls()
  {
    this.OTP = "";
    this.GeneratedOTP = "";
  
  }

  startTimer(): void
  {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP*60;
    

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

  @ViewChild('content') content: ElementRef | any;

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  //Modal Section END



  async openModal(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });


  }


  async GetDateConfig() {

    var data = {
      DepartmentID: EnumDepartment.ITI,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID:9 ,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "Admission",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonservice.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.Admission;
        console.log(this.DateConfigSetting)
      }, (error: any) => console.error(error)
      );
  }

}
