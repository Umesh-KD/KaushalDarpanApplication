import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { EnumDepartment, EnumDirectAdmissionType, EnumRole, EnumStatus, EnumVerificationAction, GlobalConstants } from '../../../Common/GlobalConstants';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ItiApplicationFormService } from '../../../Services/ItiApplicationForm/iti-application-form.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DateConfigService } from '../../../Services/DateConfiguration/date-configuration.service';
import { HttpClient } from '@angular/common/http';
import { ReportService } from '../../../Services/Report/report.service';
import { DocumentDetailsService } from '../../../Common/document-details';
import { CookieService } from 'ngx-cookie-service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { ApplicationStatusService } from '../../../Services/ApplicationStatus/EmitraApplicationStatus.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../Common/common';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITI_DirectAdmissionApplyDataModel } from '../../../Models/ITIFormDataModel';
import { DateConfigurationModel } from '../../../Models/DateConfigurationDataModels';
import { StudentStatusHistoryComponent } from '../../Student/student-status-history/student-status-history.component';
import { FormGroup } from '@angular/forms';
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { EmitraApplicationstatusModel } from '../../../Models/EmitraApplicationstatusDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ItiApplicationSearchmodel } from '../../../Models/ItiApplicationPreviewDataModel';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2'

@Component({
  selector: 'app-add-qualification-list',
  standalone: false,
  templateUrl: './add-qualification-list.component.html',
  styleUrl: './add-qualification-list.component.css'
})
export class AddQualificationListComponent {
  public StreamMasterList: [] = [];
  public SemesterList: [] = [];
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public ApplicationNo: string = '';
  public DOB: string = '';
  public ApplicationID: number = 0
  public searchRequest = new StudentSearchModel();
  public downloadRequest = new ItiApplicationSearchmodel()
  public _EnumDepartment = EnumDepartment;
  public _EnumVerfication = EnumVerificationAction;
  public isShowGrid: boolean = false;
  encryptedRows: any[] = [];
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public StudentDetailsModelList: EmitraApplicationstatusModel[] = []
  public DocumentList: DocumentDetailsModel[] = []
  public DefaultApplicationText: String = '';
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  @ViewChild(StudentStatusHistoryComponent) childComponent!: StudentStatusHistoryComponent;
  _EnumDirectAdmissionType = EnumDirectAdmissionType
  _EnumRole = EnumRole
  public searchssoform!: FormGroup
  public IsJailCollege: boolean = false
  dateConfiguration = new DateConfigurationModel();
  public AdmissionDateList: any = []
  public courseTypeList: any = []
  public FromDate: string = ''
  public isITIAddmissionOpen: boolean = true
  public CommonRemark: string = ''
  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public overallRemark: any = '';
  public applyRequest = new ITI_DirectAdmissionApplyDataModel();
  DirectAdmissionApplicationID: number = 0
  public DateConfigSetting_Direct: any = [];
  DirectAdmissionMapKey: number = 0;
  public IsAlloted: boolean = false
  constructor(
    private loaderService: LoaderService,
    private encryptionService: EncryptionService,
    private commonservice: CommonFunctionService,
    public appsettingConfig: AppsettingService,
    private studentService: ApplicationStatusService,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    private cookieService: CookieService,
    private cdRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private documentDetailsService: DocumentDetailsService,
    private reportService: ReportService,
    private http: HttpClient,
    private Swal2: SweetAlert2,
    private dateMasterService: DateConfigService,
    private toastrService: ToastrService,
    private route: Router,
    private toastr: ToastrService,
    private itiApplicationService: ItiApplicationFormService,
  ) { }

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID



    await this.GetAllDataActionWise()


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
  onSearchClick() {
    this.GetAllDataActionWise()
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }





  ResetControl() {
    this.searchRequest.DOB = ''
    this.searchRequest.MobileNumber = ''
    this.searchRequest.ApplicationNo = ''
    this.GetAllDataActionWise()
  }
  async GetAllDataActionWise() {
    this.isShowGrid = true;



    // if(this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon || this.sSOLoginDataModel.RoleID == EnumRole.Principal_NCVT) {
    //   this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    //   this.searchRequest.action = "_GetApplicationListForPrinciple";
    // } else {
    //   this.searchRequest.InstituteID = 0
    //   this.searchRequest.action = "_GetApplicationList";
    // }
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID

    try {
      this.loaderService.requestStarted();
      await this.studentService.EditQualificationList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
            console.log("StudentDetailsModelList", this.StudentDetailsModelList)
            //    debugger Precompute encrypted values for each row
            debugger
            this.encryptedRows = this.StudentDetailsModelList.map(row => {
              return {
                ...row,  // Copy existing row data
                encryptedApplicationID: this.encryptParameter(row.ApplicationID)  // Add the encrypted ApplicationID
              };
            });
            //if (isaLLOT && this.sSOLoginDataModel.RoleID == 3)
            //{
            //  this.IsAlloted=true
            //}
            console.log(this.StudentDetailsModelList)
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
    this.DocumentList = []
    this.GetAllDataActionWise()
  }













  //ITI_DirectAdmissionApply


  async redirectToDirectAdmissionApplicationForm(row: any) {

    this.route.navigate(['/direct-admission-application-form'], {
      queryParams: { AppID: this.encryptionService.encryptData(row.ApplicationID) }
    });
  }

  async GetDirectAdmissionDateConfig() {

    var data = {
      DepartmentID: EnumDepartment.ITI,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: 9,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "DIRECT ADDMISSSION",
      SSOID: this.sSOLoginDataModel.SSOID
    }
    await this.commonservice.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting_Direct = data['Data'][0];
        // this.DirectAdmissionMapKey = 1
        this.DirectAdmissionMapKey = this.DateConfigSetting_Direct['DIRECT ADDMISSSION'];
        console.log(this.DirectAdmissionMapKey)
      }, (error: any) => console.error(error)
      );
  }
}
