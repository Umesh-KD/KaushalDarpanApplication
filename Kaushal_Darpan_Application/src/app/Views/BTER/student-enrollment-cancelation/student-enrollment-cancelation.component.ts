import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumDepartment, GlobalConstants, EnumStatus, EnumRole } from '../../../Common/GlobalConstants';
import { DateConfigurationModel } from '../../../Models/DateConfigurationDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentDetailsModel, StudentEnrolmentCancelModel } from '../../../Models/StudentDetailsModel';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { DateConfigService } from '../../../Services/DateConfiguration/date-configuration.service';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { StudentService } from '../../../Services/Student/student.service';
import { StudentEnrollmentCancelationService } from '../../../Services/EnrollmentCancelation/student-enrollment-cancelation.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-student-enrollment-cancelation',
  standalone: false,
  templateUrl: './student-enrollment-cancelation.component.html',
  styleUrl: './student-enrollment-cancelation.component.css'
})

export class StudentEnrollmentCancelationComponent implements OnInit, OnDestroy {
  public StreamMasterList: [] = [];
  public SemesterList: [] = [];
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public ApplicationNo: string = '';
  public DOB: string = '';
  public StudentDetailsModelList: StudentDetailsModel[] = [];
  public searchRequest = new StudentSearchModel();
  public Request = new StudentEnrolmentCancelModel();
  public DateConfigSetting: any = [];
  public DateConfigSetting1: any = [];
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

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  _EnumRole = EnumRole

  BTER: any;
  ITI: any;
  MapKeyEng: number = 0;
  BterMapKeyEng: number = 0;
  studentDetailsModel = new StudentDetailsModel();
  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  ShowBTERApply: boolean = false;
  dateConfiguration = new DateConfigurationModel();
  constructor(private loaderService: LoaderService, private encryptionService: EncryptionService,
    private commonservice: CommonFunctionService, public appsettingConfig: AppsettingService, private Swal2: SweetAlert2,
    private studentService: StudentService, private EnrollmentCancelation: StudentEnrollmentCancelationService, private modalService: NgbModal, private toastrService:
      ToastrService, private sMSMailService: SMSMailService, private cookieService: CookieService, private formBuilder: FormBuilder, private dateMasterService: DateConfigService) { }

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference


  async ngOnInit() {
    this.searchssoform = this.formBuilder.group({
      txtApplicationNo: ['', Validators.required]
      
    })
    this.BTER = this.encryptParameter(this._EnumDepartment.BTER);
    this.ITI = this.encryptParameter(this._EnumDepartment.ITI)
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDateConfig();
    await this.GetBterDateConfig();
    await this.GetDateDataList();
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

  async onSearchClick() {
    /*if (this.ApplicationNo.length > 0) {*/
    await this.GetAllDataActionWise();
    //}
    //else
    //{
    //  this.toastrService.warning('Please Enter Application No')
    //}
  }


  CloseModalPopup() {
    this.modalService.dismissAll();
    this.Request = new StudentEnrolmentCancelModel()
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      debugger;
      this.file = event.target.files[0];
      if (this.file) {

        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonservice.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.Request.Dis_ENRCancelDoc = data['Data'][0]["Dis_FileName"];
                this.Request.ENRCancelDoc = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastrService.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastrService.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
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
 
  async GetAllDataActionWise() {
    this.isSubmitted = true
    if (this.searchssoform.invalid) {
      return
    }
    this.isShowGrid = true;

    this.searchRequest.action = "_GetStudentForEnrollCancelation";

    this.searchRequest.DepartmentID = this.searchRequest.DepartmentID;
    this.searchRequest.CourseTypeID = this.searchRequest.CourseTypeID;

    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();

      await this.EnrollmentCancelation.GetAllData(this.searchRequest)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
            console.log(this.StudentDetailsModelList,"StudentDetailsModelList")
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

  async ViewandUpdate(content: any, row: any) {
    debugger;
    this.Request.StudentName = row.StudentName;
    this.Request.FatherName = row.FatherName;
    this.Request.MotherName = row.MotherName;
    this.Request.StreamName = row.StreamName;
    this.Request.InstituteName = row.InstituteName;
    this.Request.DOB = row.DOB;
    this.Request.StudentID = row.StudentID;
    this.Request.EnrollmentNo = row.EnrollmentNo;
    this.Request.SemesterID = row.SemesterID;
    this.Request.EndTermID = row.EndTermID;
    this.Request.DepartmentID = row.DepartmentID;
    this.Request.InstituteID = row.InstituteID;
    this.Request.CourseType = row.CourseType;

    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: true, centered: true });

  }


  async CancelEnrolment() {
    if (this.Request.ENRCancelDoc == '')
    {
      this.toastrService.error('Please Upload File')
      return;
    }
    this.Swal2.Confirmation("Are you sure you want to Cancel Enrollment Application ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            debugger;
            this.Request.NextRoleId = 7;
            this.Request.ActionId = 1;
            this.Request.Status = this.sSOLoginDataModel.RoleID;
            this.Request.UserId = this.sSOLoginDataModel.UserID;
            this.Request.IsRequestedForEnrCancel = this.sSOLoginDataModel.RoleID;
            this.Request.RoleID = this.sSOLoginDataModel.RoleID;
            this.loaderService.requestStarted();
            await this.EnrollmentCancelation.CancelEnrolment(this.Request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data)

                if (data.State == EnumStatus.Success) {
                  debugger;
                  this.toastrService.success(data.Message)
                  this.CloseModalPopup();
                  this.ResetControl();

                }
                else {
                  this.toastrService.error(data.ErrorMessage)
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
      AcademicYearID: 9,
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


  async GetDateDataList() {
    try {

      this.dateConfiguration.DepartmentID = EnumDepartment.BTER;
      this.dateConfiguration.SSOID = this.sSOLoginDataModel != null ? this.sSOLoginDataModel.SSOID : "";
      await this.dateMasterService.GetDateDataList(this.dateConfiguration)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          if (data.Data.filter(function (dat: any) { return dat.TypeID == 1 && dat.DepartmentID == EnumDepartment.BTER && dat.IsDateOpen == 1 }).length > 0) {
            this.ShowBTERApply = true;
          } else {
            this.ShowBTERApply = false;
          }
          if (this.sSOLoginDataModel.SSOID == 'RJJP198919016890') {
            this.ShowBTERApply = true;
          }

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async GetBterDateConfig() {

    var data = {
      DepartmentID: EnumDepartment.BTER,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: 9,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "Admission",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonservice.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting1 = data['Data'][0];
        this.BterMapKeyEng = this.DateConfigSetting.Admission;
        console.log(this.DateConfigSetting1)
      }, (error: any) => console.error(error)
      );
  }


}
