import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../Common/common';
import { EnumDepartment, GlobalConstants, EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { DateConfigurationModel } from '../../../Models/DateConfigurationDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentDetailsModel, StudentEnrolmentCancelModel } from '../../../Models/StudentDetailsModel';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { DateConfigService } from '../../../Services/DateConfiguration/date-configuration.service';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { StudentEnrollmentCancelationService } from '../../../Services/EnrollmentCancelation/student-enrollment-cancelation.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { StudentService } from '../../../Services/Student/student.service';
import { ReportService } from '../../../Services/Report/report.service';

@Component({
  selector: 'app-enrollment-cancellation-list',
  standalone: false,
  templateUrl: './enrollment-cancellation-list.component.html',
  styleUrl: './enrollment-cancellation-list.component.css'
})


export class EnrollmentCancellationListComponent implements OnInit, OnDestroy {
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

  public ActionDynamic: string = 'Cancel-Enrollment-migration';

  public statusOptions = [
    { value: 205, label: 'Section Incharge Requested' },
    { value: 3, label: 'Student Requested' },
    { value: 7, label: 'Principal Approved' },
    { value: 38, label: 'Exam Incharge Approved' },
    { value: 40, label: 'Registrar Approved' },
    { value: 2, label: 'Admin Approved' },
    { value: 206, label: 'Verified' }
  ];


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
  constructor(private loaderService: LoaderService,
    private encryptionService: EncryptionService,
    private commonservice: CommonFunctionService,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private studentService: StudentService,
    private EnrollmentCancelation: StudentEnrollmentCancelationService,
    private modalService: NgbModal, private toastrService: ToastrService,
    private sMSMailService: SMSMailService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private dateMasterService: DateConfigService) { }

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference


  async ngOnInit() {
    this.searchssoform = this.formBuilder.group({
      txtApplicationNo: ['']

    })
    this.BTER = this.encryptParameter(this._EnumDepartment.BTER);
    this.ITI = this.encryptParameter(this._EnumDepartment.ITI)
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllDataActionWise();
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

  exportToExcel(): void {
    const columnOrder = [
      'SrNo', 'StudentName', 'MotherName','FatherName', 'DOB', 'InstituteName', 'StreamName', 'SemesterName', 'EnrollmentNo', 'RollNumber', 'Action',
    ];

    const unwantedColumns = [
      'StudentID', 'RollNumber', 'dob_org', 'StreamID', 'SemesterID', 'InstituteID', 'InstituteCode', 'streamCode', 'MobileNo', 'EndTermID',
    ];

    // ✅ Define status labels (same as in your template)
    const statusLabels: { [key: number]: string } = {
      205: 'Section Incharge Requested',
      3: 'Student Requested',
      7: 'Principal Approved',
      38: 'Exam Incharge Approved',
      40: 'Registrar Approved',
      2: 'Admin Approved',
      206: 'Verified',
    };

    const filteredData = this.StudentDetailsModelList.map((item: any, index: number) => {
      const filteredItem: any = {};

      columnOrder.forEach((column) => {
        if (column === 'SrNo') {
          filteredItem[column] = index + 1;
        } else if (column === 'Action') {
          // ✅ Set Action column based on Status
          filteredItem[column] = statusLabels[item.Status] || 'Pending';
        } else if (item[column] && !unwantedColumns.includes(column)) {
          filteredItem[column] = item[column];
        }
      });

      return filteredItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const columnWidths = columnOrder.map((column) => ({
      wch: Math.max(
        column.length,
        ...filteredData.map((item: any) => item[column]?.toString().length || 0)
      ) + 2,
    }));

    ws['!cols'] = columnWidths;

    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    if (range.s && range.e) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_col(col) + '1';
        if (!ws[cellAddress]) continue;

        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '#f3f3f3' } },
          alignment: { horizontal: 'center', vertical: 'center' },
        };
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'SectionInchargeCancellationRequestData.xlsx');
  }



  async ResetControl() {
    this.SemesterID = 0;
    this.StreamID = 0;
    this.ApplicationNo = '';
    this.searchRequest.Status = 0;
    this.isShowGrid = false;
    this.GetAllDataActionWise();
    this.studentDetailsModel = new StudentDetailsModel();
    this.searchRequest = new StudentSearchModel();
  }

  onSearchClick() {
    this.GetAllDataActionWise();
  }


  async GetAllDataActionWise() {
    debugger;
    this.isSubmitted = true
    if (this.searchssoform.invalid) {
      return
    }
    this.isShowGrid = true;

    this.searchRequest.action = "_GetStudentForEnrollCancelation";

    this.searchRequest.DepartmentID = this.searchRequest.DepartmentID;

    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();

      await this.EnrollmentCancelation.GetEnrollmentCancelList(this.searchRequest)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
            console.log(this.StudentDetailsModelList, "StudentDetailsModelList")
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


  downloadBase64PDF(base64: string, filename: string): void {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  async CertificateDownload(row: any): Promise<void> {
    try {
      this.loaderService.requestStarted();
      this.Request.Action = this.ActionDynamic;
      this.Request.StudentID = row.StudentID;
      this.Request.EnrollmentNo = row.EnrollmentNo;
      this.Request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Request.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      const data = await this.reportService.BterCertificateReportDownload(this.Request);
      if (data && data.Data) {
        this.downloadBase64PDF(data.Data, `${this.ActionDynamic}.pdf`);
      } else {
        this.toastrService.error('Data not found');
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async CancelEnrolment(row: any) {

    this.Swal2.Confirmation("Are you sure you want to Cancel Enrollment ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            debugger;
            this.Request.StudentID = row.StudentID;
            this.Request.EnrollmentNo = row.EnrollmentNo;
            this.Request.NextRoleId = 7;
            this.Request.SemesterID = row.SemesterID;
            this.Request.EndTermID = row.EndTermID;
            this.Request.DepartmentID = row.DepartmentID;
            this.Request.ActionId = 1;
            this.Request.InstituteID = row.InstituteID;
            this.Request.CourseType = row.CourseType;
            this.Request.Status = this.sSOLoginDataModel.RoleID;
            this.Request.UserId = this.sSOLoginDataModel.UserID;
            this.Request.IsRequestedForEnrCancel = this.sSOLoginDataModel.RoleID;

            this.Request.StudentName = row.StudentName;
            this.Request.FatherName = row.FatherName;
            this.Request.MotherName = row.MotherName;
            this.Request.StreamName = row.StreamName;
            this.Request.InstituteName = row.InstituteName;
            this.Request.DOB = row.DOB;
            this.Request.RoleID = this.sSOLoginDataModel.RoleID;


            this.loaderService.requestStarted();
            await this.EnrollmentCancelation.CancelEnrolment(this.Request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data)

                if (data.State == EnumStatus.Success) {
                  debugger;
                  this.toastrService.success(data.Message)
                  this.GetAllDataActionWise()

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


  //async PayFees(item: any) { }

  //async VerifyOTP() {
  //  if (this.OTP.length > 0) {
  //    if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
  //      try {
  //        this.searchRequest.studentId = this.studentDetailsModel.StudentID;
  //        this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;
  //        /*    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;*/
  //        this.loaderService.requestStarted();
  //        await this.studentService.UpdateStudentSsoMapping(this.searchRequest)
  //          .then((data: any) => {
  //            data = JSON.parse(JSON.stringify(data));
  //            if (data.State == EnumStatus.Success) {
  //              this.toastrService.success('Student Mapped Successfully');
  //              //Set User cookie
  //              this.sSOLoginDataModel.StudentID = this.studentDetailsModel.StudentID;
  //              this.sSOLoginDataModel.DepartmentID = this.searchRequest.DepartmentID;
  //              localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
  //              this.cookieService.set('LoginStatus', "OK");
  //              window.open("StudentDashboard", "_self");
  //            }
  //            else {
  //              this.toastrService.success(data.Message);
  //            }
  //          }, (error: any) => console.error(error)
  //          );
  //      }
  //      catch (ex) {
  //        console.log(ex);
  //      }
  //      finally {
  //        setTimeout(() => {
  //          this.loaderService.requestEnded();
  //        }, 200);
  //      }


  //    }
  //    else {
  //      this.toastrService.warning('Invalid OTP Please Try Again');
  //    }
  //  }
  //  else {
  //    this.toastrService.warning('Please Enter OTP');
  //  }
  //}

  //async SendOTP(isResend?: boolean) {
  //  try {
  //    this.GeneratedOTP = "";
  //    this.loaderService.requestStarted();
  //    //this.studentDetailsModel.MobileNo = "7737348604";
  //    await this.sMSMailService.SendMessage(this.studentDetailsModel.MobileNo, "OTP")
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {
  //          this.startTimer();
  //          //open modal popup
  //          this.GeneratedOTP = data['Data'];
  //          if (isResend) {
  //            this.toastrService.success('OTP resent successfully');
  //          }
  //        }
  //        else {
  //          this.toastrService.warning('Something went wrong');
  //        }
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}



  ////Start Section Model
  //async openModalGenerateOTP(content: any, item: StudentDetailsModel) {
  //  this.OTP = '';
  //  this.MobileNo = '';
  //  this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
  //    this.closeResult = `Closed with: ${result}`;
  //  }, (reason) => {
  //    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //  });
  //  this.MobileNo = item.MobileNo;
  //  this.studentDetailsModel = item;
  //  this.SendOTP();
  //}

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
