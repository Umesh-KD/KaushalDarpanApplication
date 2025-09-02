  import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { EnumConfigurationType, EnumCourseType, EnumCourseType1, EnumDepartment, EnumDirectAdmissionType, EnumRole, EnumStatus, EnumVerificationAction, GlobalConstants, JailCollegeID } from '../../../Common/GlobalConstants';
import { VerificationDocumentDetailList } from '../../../Models/StudentVerificationDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplicationStatusService } from '../../../Services/ApplicationStatus/EmitraApplicationStatus.service';
import { ToastrService } from 'ngx-toastr';
import { EmitraApplicationstatusModel } from '../../../Models/EmitraApplicationstatusDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { DocumentDetailsService } from '../../../Common/document-details';
import { UploadBTERFileModel, UploadFileModel } from '../../../Models/UploadFileModel';
import { StudentStatusHistoryComponent } from '../../Student/student-status-history/student-status-history.component';
import { ReportService } from '../../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { FormGroup } from '@angular/forms';
import { DateConfigurationModel } from '../../../Models/DateConfigurationDataModels';
import { DateConfigService } from '../../../Services/DateConfiguration/date-configuration.service';
import { ItiApplicationSearchmodel } from '../../../Models/ItiApplicationPreviewDataModel';
import { ItiApplicationService } from '../../../Services/ItiApplication/iti-application.service';
import { ItiApplicationFormService } from '../../../Services/ItiApplicationForm/iti-application-form.service';
import { ITI_DirectAdmissionApplyDataModel } from '../../../Models/ITIFormDataModel';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css'],
  standalone: false
})
export class ApplicationListComponent {
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
  public FromDate:string=''
  public isITIAddmissionOpen: boolean = true
  public CommonRemark:string=''
  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public overallRemark:any = '';
  public applyRequest = new ITI_DirectAdmissionApplyDataModel();
  DirectAdmissionApplicationID: number = 0
  public DateConfigSetting_Direct: any = [];
  DirectAdmissionMapKey: number = 0;

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
    this.courseTypeList = this.commonservice.ConvertEnumToList(EnumCourseType1);
    await this.GetDirectAdmissionDateConfig();
    await this.GetITIDateDataList()
    await this.GetAllDataActionWise()
    this.checkJailCollege();

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

  checkJailCollege() {
    JailCollegeID.map((item: any) => {
      if (item === this.sSOLoginDataModel.InstituteID) {
        this.IsJailCollege = true
      }
    })
  }

  redirectApplication(item: any, action: number) {
    
    

    this.sSOLoginDataModel.Eng_NonEng = item.CourseType;
    this.sSOLoginDataModel.Eng_NonEngName = item.CourseTypeName;
    //if (item.CourseType == 1) {
    //  this.sSOLoginDataModel.Eng_NonEngName = 'Diploma 1st Year Eng';
    //}
    //if (item.CourseType == 2) {
    //  this.sSOLoginDataModel.Eng_NonEngName = 'Diploma Non-Engineering 1stYear';
    //}
    //if (item.CourseType == 3) {
    //  this.sSOLoginDataModel.Eng_NonEngName = 'Diploma 2nd Year Eng Lateral Admission';
    //}
    //if (item.CourseType == 4) {
    //  this.sSOLoginDataModel.Eng_NonEngName = 'Diploma 2nd Year Eng Lateral Admission';
    //} if (item.CourseType == 5) {
    //  this.sSOLoginDataModel.Eng_NonEngName = 'Diploma 2nd Year Eng Lateral Admission';
    //}

    this.sSOLoginDataModel.ApplicationFinalSubmit = item.ApplicationFinalSubmit
    this.sSOLoginDataModel.Mobileno = item.MobileNo;
    this.sSOLoginDataModel.DepartmentID = 1;
    this.sSOLoginDataModel.ApplicationID = item.ApplicationID;

    //set user session 
    localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
    //set cookie

    if (this.sSOLoginDataModel.RoleID == EnumRole.Student) {
      this.route.navigate(['/DTEApplicationform']);
    } else {
      this.route.navigate(['/DirectDTEApplicationform']);
    }
    
    //this.route.navigate(['/DirectDTEApplicationform']);
  }


  ResetControl() {
    this.searchRequest.DOB = ''
    this.searchRequest.MobileNumber = ''
    this.searchRequest.ApplicationNo = ''
    this.GetAllDataActionWise()
  }
  async GetAllDataActionWise() {
    this.isShowGrid = true;
    

    this.StudentDetailsModelList = [];
    if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.BTER)
    {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.roleId = this.sSOLoginDataModel.RoleID;
      this.searchRequest.ServiceID = this.sSOLoginDataModel.ServiceID
      if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon
        || this.sSOLoginDataModel.RoleID == EnumRole.Principle_NonEng_Degree1Year || this.sSOLoginDataModel.RoleID == EnumRole.Principle_NonEng_Degree2YearLateral
      ) {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
        //this.searchRequest.action = "_GetApplicationListForPrinciple_BTER";
        this.searchRequest.action = "_GetDirectApplicationListForPrinciple_BTER";
      }
      else if (this.sSOLoginDataModel.RoleID == EnumRole.Emitra)
      {
        this.searchRequest.InstituteID = 0
        this.searchRequest.DepartmentID = EnumDepartment.BTER;
        this.searchRequest.action = "_GetApplicationList";
      }
      else
      {
        this.searchRequest.InstituteID = 0
        this.searchRequest.action = "_GetApplicationList";
      }
    }
    else if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.ITI)
    {
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.searchRequest.roleId = this.sSOLoginDataModel.RoleID;
      this.searchRequest.ServiceID = this.sSOLoginDataModel.ServiceID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal ||
        this.sSOLoginDataModel.RoleID == EnumRole.Principal_NCVT)
      {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
        this.searchRequest.action = "_GetApplicationListForPrinciple_ITI";
      }
      else if (this.sSOLoginDataModel.RoleID == EnumRole.Emitra)
      {
        this.searchRequest.InstituteID = 0
        this.searchRequest.DepartmentID = EnumDepartment.ITI;
        this.searchRequest.action = "_GetApplicationList";
      }

      else {
        this.searchRequest.InstituteID = 0
        this.searchRequest.action = "_GetApplicationList";
      }
    }
    else
    {
      this.searchRequest.InstituteID = 0
      this.searchRequest.action = "_GetApplicationList";
    }
    // if(this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon || this.sSOLoginDataModel.RoleID == EnumRole.Principal_NCVT) {
    //   this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    //   this.searchRequest.action = "_GetApplicationListForPrinciple";
    // } else {
    //   this.searchRequest.InstituteID = 0
    //   this.searchRequest.action = "_GetApplicationList";
    // }
    try {
      this.loaderService.requestStarted();
      await this.studentService.StudentApplicationStatus(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
            console.log("StudentDetailsModelList", this.StudentDetailsModelList)
            // Precompute encrypted values for each row
            this.encryptedRows = this.StudentDetailsModelList.map(row => {
              return {
                ...row,  // Copy existing row data
                encryptedApplicationID: this.encryptParameter(row.ApplicationID)  // Add the encrypted ApplicationID
              };
            });
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
  async openModal(content: any, ApplicationID: number) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.GetDatabyID(ApplicationID)
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



  async GetDatabyID(ApplicationID: number) {

    this.ApplicationID = ApplicationID


    try {
      this.loaderService.requestStarted();

      await this.studentService.GetByID(ApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DocumentList = data['Data'];
            this.DocumentList.forEach(e => e.FileName = '')
            this.DocumentList = this.DocumentList.map(doc => ({
              ...doc,
              DisplayColumnNameEn: doc.DisplayColumnNameEn.replace(/^upload the scanned copy of /i, '') // Remove "upload the "
            }));
            this.CommonRemark = data['Data'][0]['CommonRemark']
            console.log(this.DocumentList)
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
  async UploadDocument(event: any, item: any) {
    try {
      //upload model
      // let uploadModel = new UploadFileModel();
      // uploadModel.FileExtention = item.FileExtention ?? "";
      // uploadModel.MinFileSize = item.MinFileSize ?? "";
      // uploadModel.MaxFileSize = item.MaxFileSize ?? "";
      // uploadModel.FolderName = item.FolderName ?? "";

      let uploadModel: UploadBTERFileModel = {
        ApplicationID: item.TransactionID?.toString() ?? "0",
        AcademicYear: item.AcademicYear?.toString() ?? "0",
        DepartmentID: '1',
        EndTermID: item.EndTermID?.toString() ?? "0",
        Eng_NonEng: item.CourseType?.toString() ?? "0",
        FileName: item.ColumnName ?? "",
        FileExtention: item.FileExtention ?? "",
        MinFileSize: item.MinFileSize ?? "",
        MaxFileSize: item.MaxFileSize ?? "",
        FolderName: item.FolderName ?? "",
        IsCopy: true 
      }
      //call

      await this.documentDetailsService.UploadBTERDocument(event, uploadModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            //add/update document in js list
            const index = this.DocumentList.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.DocumentList[index].FileName = data.Data[0].FileName;
              this.DocumentList[index].Dis_FileName = data.Data[0].Dis_FileName;
              this.DocumentList[index].OldFileName = data.Data[0].OldFileName;
            }
            console.log(this.DocumentList)
            //reset file type
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
    catch (Ex) {
      console.log(Ex);
    }
  }
  async DeleteDocument(item: any) {
    try {
      // delete from server folder
      let deleteModel = new DeleteDocumentDetailsModel()
      deleteModel.FolderName = item.FolderName ?? "";
      deleteModel.FileName = item.FileName;
      //call
      await this.documentDetailsService.DeleteDocument(deleteModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.DocumentList.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.DocumentList[index].FileName = '';
              this.DocumentList[index].Dis_FileName = '';
            }
            console.log(this.DocumentList)
          }
          if (this.State == EnumStatus.Error) {
            this.toastrService.error(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async DocumentSave() {
    console.log(this.DocumentList)

    if (this.documentDetailsService.HasRequiredDocument(this.DocumentList)) {
      return;
    }
    this.DocumentList.forEach(e => {
      e.ModifyBy = this.sSOLoginDataModel.UserID

    })
    const isEmpty = this.DocumentList.some(x => x.FileName == '' && x.Dis_FileName == '')
    if (isEmpty) {
      this.toastrService.error("Please Upload File ")
      return
    }
    this.Swal2.Confirmation("Are you sure you want to upload this document ? Please verify the details before proceeding.",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          try {
            this.DocumentList.forEach(e => {
              e.SubRemark = this.overallRemark
            })

            this.loaderService.requestStarted();
            await this.studentService.SaveDocumentData(this.DocumentList).then((data: any) => {

              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (data.State == EnumStatus.Success) {

                this.toastrService.success(data.Message);
                this.CloseModal()

              }
              if (data.State === EnumStatus.Error) {
                this.toastrService.error(data.ErrorMessage);
              } else if (data.State === EnumStatus.Warning) {
                this.toastrService.warning(data.ErrorMessage);
              }
            });
          } catch (Ex) {
            console.log(Ex);
          } finally {
            this.loaderService.requestEnded();
          }
        }
      });

  }

  async ViewHistory(row: any) {
    //this.searchRequest.action = "_GetstudentWorkflowdetails";
    //this.GetAllDataActionWise();
    this.childComponent.OpenHistoryPopup();
  }


  async DownloadAllotmentLetter(id: any) {
    try {

      this.loaderService.requestStarted();
      this.ApplicationID = this.StudentDetailsModelList[0].ApplicationID;
      await this.reportService.DownloadAllotmentLetter(this.ApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
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


  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  async openApplyNowModal(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async Redirect(key: number) {
    if (key == EnumDepartment.BTER) {
      this.CloseModal()
      //await this.route.navigate(['/StudentJanAadharDetail'],
      //  { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.BTER), isDirectAdmission: this.encryptionService.encryptData(true) } }
      //);
      await this.route.navigate(['/DirectStudentJanAadharDetail'],
        { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.BTER), isDirectAdmission: this.encryptionService.encryptData(true) } }
      );
    } else if (key == EnumDepartment.ITI) {
      this.CloseModal()
      await this.route.navigate(['/StudentJanAadharDetail'],
        { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.ITI), isDirectAdmission: this.encryptionService.encryptData(true) } }
      );
    } else if (key == EnumDirectAdmissionType.JailAdmission) {
      this.CloseModal()
      this.route.navigate(['/StudentJanAadharDetail'],
        { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.ITI), isJailAdmission: this.encryptionService.encryptData(true) } });
    }
  }

  async GetITIDateDataList() {
    try {
      this.dateConfiguration.DepartmentID = EnumDepartment.ITI;
      this.dateConfiguration.SSOID = this.sSOLoginDataModel.SSOID;
      await this.dateMasterService.GetDateDataList(this.dateConfiguration)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AdmissionDateList = data['Data'];
          
          const today = new Date();
          const deptID = EnumDepartment.ITI;
          var activeCourseID: any = [];
          var lnth= this.AdmissionDateList.filter(function(x:any){return new Date(x.To_Date) > today && new Date(x.From_Date) < today &&  x.TypeID == EnumConfigurationType.Admission && x.DepartmentID == deptID}).length
          if (lnth <= 0)
          {
        /*    this.toastrService.warning("Date for ITI Admission is Closed or Not Open");*/
            this.isITIAddmissionOpen = false;
          }

          const admissionEntry = this.AdmissionDateList.find((e: any) => e.TypeID == 148);
          this.FromDate = admissionEntry ? admissionEntry.From_Date : null;
          console.log(this.FromDate,"from date")
          
          

          this.courseTypeList = this.courseTypeList.filter((course: any) => activeCourseID.includes(course.value));
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async DownloadApplicationForm(ApplicationID:number) {
    try {
      this.loaderService.requestStarted();
      this.downloadRequest.DepartmentID = EnumDepartment.ITI;
      this.downloadRequest.ApplicationID = ApplicationID;
      console.log("searchrequest", this.downloadRequest)
      await this.reportService.GetITIApplicationForm(this.downloadRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFileApplicationForm(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
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
  DownloadFileApplicationForm(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileNameApplicationForm('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileNameApplicationForm(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  //ITI_DirectAdmissionApply
  async applyForDirectAdmission(row: any) {
    try {
      this.applyRequest.ApplicationID = row.ApplicationID
      this.applyRequest.UserID = this.sSOLoginDataModel.UserID

      this.loaderService.requestStarted();
      await this.itiApplicationService.ITI_DirectAdmissionApply(this.applyRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            // this.toastr.success(data.Message)
            this.DirectAdmissionApplicationID = data.Data
            this.route.navigate(['/direct-admission-application-form'],{
                queryParams: { AppID: this.encryptionService.encryptData(this.DirectAdmissionApplicationID) }
              });

          } else if (data.State == EnumStatus.Warning) {
            this.toastr.success(data.Message)
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        }, (error: any) => console.error(error)
        );
    } catch (error) {
      
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200) 
    }
  }

  async redirectToDirectAdmissionApplicationForm(row: any) {
    
    this.route.navigate(['/direct-admission-application-form'],{
      queryParams: { AppID: this.encryptionService.encryptData(row.ApplicationID) }
    });
  }

  async GetDirectAdmissionDateConfig() {

    var data = {
      DepartmentID: EnumDepartment.ITI,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID:9 ,
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

      }, (error: any) => console.error(error)
      );
  }
}
