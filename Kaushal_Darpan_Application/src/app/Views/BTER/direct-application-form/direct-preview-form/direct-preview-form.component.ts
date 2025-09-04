import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { BterSearchmodel, DirectAdmissionUpdatePayment } from '../../../../Models/ApplicationFormDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { PreviewApplicationModel } from '../../../../Models/PreviewApplicationformModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumApplicationFromStatus, EnumConfigurationType, EnumCourseType, EnumDepartment, EnumEmitraService, EnumFeeFor, EnumMessageType, EnumRole, EnumStatus, EnumUserType, EnumVerificationAction, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ImageErrorDirective } from '../../../../Common/image-error.directive';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { JanAadharMemberDetails } from '../../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitraRequestDetails, StudentFeesTransactionItems, TransactionStatusDataModel } from '../../../../Models/PaymentDataModel';
import { EmitraPaymentService } from '../../../../Services/EmitraPayment/emitra-payment.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';
import { DocumentDetailsModel } from '../../../../Models/DocumentDetailsModel';
import { DateConfigService } from '../../../../Services/DateConfiguration/date-configuration.service';
import { DateConfigurationModel } from '../../../../Models/DateConfigurationDataModels';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { ApplicationMessageDataModel } from '../../../../Models/ApplicationMessageDataModel';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { ApplicationStatusService } from '../../../../Services/ApplicationStatus/EmitraApplicationStatus.service';
import { DeleteDocumentDetailsModel } from '../../../../Models/DeleteDocumentDetailsModel';
import { UploadBTERFileModel, UploadFileModel } from '../../../../Models/UploadFileModel';
import { QualificationViewDetails } from '../../../../Models/ItiApplicationPreviewDataModel';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ElementRef, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { SSOLoginService } from '../../../../Services/SSOLogin/ssologin.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-direct-preview-form',
  templateUrl: './direct-preview-form.component.html',
  styleUrls: ['./direct-preview-form.component.css'],
  standalone: false
})
export class DirectPreviewFormComponent {
  @ViewChild('modal_ViewApplication') modal_ViewApplication: any;
  public DocumentList: DocumentDetailsModel[] = []
  public CompanyMasterDDLList: any[] = [];
  public CommonRemark:string=''
  public BoardList: any = []
  public request = new PreviewApplicationModel()
  public QualificationView10: any = [];
  public HighestQualificationView: any = [];
  public QualificationLateralView: any = [];
  public EnglishQualificationLateralView: any = [];
  public Status: number = 0
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public UserID: number = 0
  public ErrorMessage: string = '';
  public _GlobalConstants: any = GlobalConstants;
  public Imagedirective: any = ImageErrorDirective
  public sSOLoginDataModel = new SSOLoginDataModel();
  closeResult: string | undefined;
  public PassingYearList: any = []
  public AdmissionDateList: any = []
  public isSupplement: boolean = false
  calculatedPercentage: number = 0;
  public searchrequest = new BterSearchmodel()
  updatePaymentRequest = new DirectAdmissionUpdatePayment();
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public janaadharMemberDetails = new JanAadharMemberDetails()
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  emitraRequest = new EmitraRequestDetails();
  public ShowPaymentButton: boolean = false;
  public ShowfinalLButton: boolean = true;
  public _EnumVerfication = EnumVerificationAction
  @Output() saveSuccess = new EventEmitter<void>();
  public documentDetails: DocumentDetailsModel[] = []
  public ApplicationID: number = 0;
  public IsTermAndCondition: boolean = false;
  public IsShowIncompleteData: boolean = false;
  public filteredDocumentDetails: any = []
  public dateConfiguration = new DateConfigurationModel()
  public showFeeButton: boolean = false;
  public transactionStatusDataModel = new TransactionStatusDataModel();
  public PDFURL: string = '';
  public _EnumRole= EnumRole;
  public messageModel = new ApplicationMessageDataModel();
  public overallRemark: any = ''
  UserName: string = '';
  OptionalList: any = []

  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  public isSupp: boolean = false
  imageSrc: string | null = null;
  isError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ApplicationService: BterApplicationForm,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private emitraPaymentService: EmitraPaymentService,
    private reportService: ReportService,
    private http: HttpClient,
    private router: Router,
    private dateMasterService: DateConfigService,
    private encryptionService: EncryptionService,
    private smsMailService: SMSMailService,
    private documentDetailsService: DocumentDetailsService,
    private studentService: ApplicationStatusService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private sSOLoginService: SSOLoginService,
    private cookieService: CookieService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ApplicationID = this.sSOLoginDataModel.ApplicationID;
    
    let id = this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0";
    //this.ApplicationID = Number(this.encryptionService.decryptData(id))
    if (this.ApplicationID > 0) {
      this.searchrequest.ApplicationID = this.sSOLoginDataModel.ApplicationID;
      this.request.ApplicationID = this.sSOLoginDataModel.ApplicationID;
      await this.GetById();
      await this.GetDateDataList();
    }
  }


  Changetab(index: number) {
    this.formSubmitSuccess.emit(true)
    this.tabChange.emit(index)
  }

  //filteredDocumentDetails(groupNo: number): any[] {
  //    this.documentDetails = this.request.DocumentDetailList
  //    return this.documentDetails.filter((x) => x.GroupNo == groupNo);
  //  }


  async openRevertModal(content: any, ApplicationID: number) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.GetDatabyID(ApplicationID)
  }


  async GetById() {
    this.isSubmitted = false;
    this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    this.searchrequest.AcademicYear = this.sSOLoginDataModel.FinancialYearID
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetPreviewDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ada');
          debugger
          this.request.ApplicationID = data['Data']['ApplicationID']
          if (data['Data'] != null) {
            this.request = data['Data']
            
            this.request.OptionalViewDatas = data['Data']['optionalviewDatas']

            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0');
            const day = String(dob.getDate()).padStart(2, '0');
            //this.request.DOB = `${year}-${month}-${day}`;
            
            if (this.request?.DocumentDetailList) {
              this.documentDetails = this.request.DocumentDetailList;
           
              this.request.DocumentDetailList = this.request.DocumentDetailList.map(doc => ({
                ...doc,
                DisplayColumnNameEn: doc.DisplayColumnNameEn.replace(/^Upload /i, '') // Remove "upload the "
              }));
              this.filteredDocumentDetails = this.documentDetails.filter((x) => x.GroupNo === 1);
            } else {
              this.documentDetails = [];
              this.filteredDocumentDetails = [];
            }

            

            this.QualificationView10 = this.request.QualificationViewDetails.filter(function (dat: any) { return dat.QualificationID == '10' });
            if (this.request.CourseTypeID == 2 && this.request.IsHighestQualification) {
              this.HighestQualificationView = this.request.QualificationViewDetails.filter(function (dat: any) { return dat.QualificationID != '10' });
            }

            if (this.request.CourseTypeID == 3) {
              this.QualificationLateralView = this.request.QualificationViewDetails.filter(function (dat: any) { return dat.QualificationID != '10' });
            }

            if (this.request.CourseTypeID == 4 || this.request.CourseTypeID == 5) {
              this.QualificationLateralView = this.request.QualificationViewDetails.filter(function (dat: any) { return dat.QualificationID != '10' && dat.QualificationID != 'English' });
            }

            if (this.request.CourseTypeID == 4 && this.QualificationLateralView[0]?.QualificationPriority == '280') {
              this.EnglishQualificationLateralView = this.request.QualificationViewDetails.filter(function (dat: any) { return dat.QualificationID == 'English' });
            }

            this.ShowHideButtons(this.request.IsfinalSubmit, this.request.IsFinalPay);
            if (this.request.PendingDataModel?.length > 0) { this.IsShowIncompleteData = true }
            else { this.IsShowIncompleteData = false }

          }
          console.log(this.request, "fff");
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  
  async DirectAdmissionPaymentUpdate() {
    this.isSubmitted = true
    this.UserID = this.sSOLoginDataModel.UserID

    if (this.request.PendingDataModel?.length > 0) {
      this.toastr.error("Please fill in all the pending details first.")
      return;
    }
    if (!this.IsTermAndCondition) {
      this.toastr.error("Please read terms carefully before proceeding.")
      return;
    }

    try {
      this.Swal2.Confirmation("Are you sure you want to Submit?", async (result: any) => {
        // Check if the user confirmed the action
        if (result.isConfirmed) {
          this.loaderService.requestStarted();
          this.updatePaymentRequest.ApplicationId = this.request.ApplicationID
          this.updatePaymentRequest.DepartmentID = this.request.DepartmentID
          await this.ApplicationService.DirectAdmissionPaymentUpdate(this.updatePaymentRequest)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              
              if (data.State == EnumStatus.Success) {
                await this.Login();
              }
              else {
                this.toastr.error(data.ErrorMessage)
                this.toastr.warning(data.Message)
              }
            }
            )
        }
      });
    }
    catch (ex) {
      console.log(ex)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  async SaveData(content: any) {

    this.isSubmitted = true
    this.UserID = this.sSOLoginDataModel.UserID
    
    if (this.request.PendingDataModel?.length > 0) {
      this.toastr.error("Please fill in all the pending details first.")
      return;
    }
    if (!this.IsTermAndCondition) {
      this.toastr.error("Please read terms carefully before proceeding.")
      return;
    }

    try {
      this.Swal2.Confirmation("Are you sure you want to Submit?", async (result: any) => {
        // Check if the user confirmed the action
        if (result.isConfirmed) {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          
          await this.ApplicationService.SavefinalData(this.request.ApplicationID, this.Status = EnumApplicationFromStatus.FinalSave)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              if (this.State == EnumStatus.Success) {
                this.loaderService.requestEnded();
                this.toastr.success(this.Message)
                this.ShowHideButtons(EnumApplicationFromStatus.FinalSave);
               
                // this.router.navigate(['/DTEApplicationform'], {
                //   queryParams: { AppID: this.encryptionService.encryptData(this.request.ApplicationID??"0") }
                // });

                this.SavePreview(content, this.request.ApplicationID);

              }
              else {


                this.toastr.error(this.ErrorMessage)
              }
            }
            )
        }
      }
      )
    }
    catch (ex) {
      console.log(ex)
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  ShowHideButtons(status: number, IsPaymentSuccess: boolean = false)
  {



    if (status == EnumApplicationFromStatus.FinalSave && IsPaymentSuccess == false)
    {

      this.ShowfinalLButton = false;
      this.ShowPaymentButton = true;
      this.IsTermAndCondition = true;
    }
    else if (status == EnumApplicationFromStatus.FinalSave && IsPaymentSuccess == true)
    {
      this.ShowPaymentButton = false;
      this.ShowfinalLButton = false
      this.IsTermAndCondition = true;
    }
    else 
    {
      this.ShowfinalLButton = true;
      this.ShowPaymentButton = false;
      this.IsTermAndCondition = false;
    }
  } 

  async PayApplicationFees111() {

    ;
    this.emitraRequest = new EmitraRequestDetails();
    //Set Parameters for emitra
    this.emitraRequest.Amount = Number(this.request.ApplicationFees);
    this.emitraRequest.ApplicationIdEnc = this.request.ApplicationID.toString();
    this.emitraRequest.ServiceID = this.request.ServiceID.toString();
    this.emitraRequest.ID =  this.request?.UniqueServiceID??0;
    this.emitraRequest.UserName = this.request.StudentName;
    this.emitraRequest.MobileNo = this.request.MobileNo;
    this.emitraRequest.StudentID = this.request.ApplicationID;
    this.emitraRequest.SemesterID = 0;
    this.emitraRequest.ExamStudentStatus = 0;
    this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
    this.emitraRequest.DepartmentID = EnumDepartment.BTER;
    this.emitraRequest.CourseTypeID = this.request.CourseTypeID;
    this.emitraRequest.TypeID = EnumConfigurationType.Admission;
    this.emitraRequest.FeeFor = EnumFeeFor.Application;


    this.emitraRequest.DepartmentID = EnumDepartment.BTER;
    if (this.sSOLoginDataModel.RoleID == EnumRole.Emitra || this.sSOLoginDataModel.UserType == EnumUserType.KIOSK ) {
      this.emitraRequest.IsKiosk = true;
    }
    


    this.loaderService.requestStarted();
    try {
      await this.emitraPaymentService.EmitraApplicationPayment(this.emitraRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            await this.RedirectEmitraPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA, data.Data.PaymentRequestURL)
          }
          else
          {
            let displayMessage = this.Message ?? this.ErrorMessage;
            this.toastr.error(displayMessage)
          }
        })
    }
    catch (ex) {

      console.log(ex)

    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  RedirectEmitraPaymentRequest111(pMERCHANTCODE: any, pENCDATA: any, pServiceURL: any) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", pServiceURL);

    //Hidden Encripted Data
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "ENCDATA");
    hiddenField.setAttribute("value", pENCDATA);
    form.appendChild(hiddenField);

    //Hidden Service ID
    var hiddenFieldService = document.createElement("input");
    hiddenFieldService.setAttribute("type", "hidden");
    hiddenFieldService.setAttribute("name", "SERVICEID");
    hiddenFieldService.setAttribute("value", this.emitraRequest.ServiceID);
    form.appendChild(hiddenFieldService);
    //Hidden Service ID
    var MERCHANTCODE = document.createElement("input");
    MERCHANTCODE.setAttribute("type", "hidden");
    MERCHANTCODE.setAttribute("name", "MERCHANTCODE");
    MERCHANTCODE.setAttribute("value", pMERCHANTCODE);
    form.appendChild(MERCHANTCODE);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  async PayApplicationFees() {

    this.Swal2.Confirmation("Are you sure you want to Submit & Make Payment?", async (result: any) => {
      if (result.isConfirmed) {
        
        this.isLoading = true;
        this.emitraRequest = new EmitraRequestDetails();
        //Set Parameters for emitra
        this.emitraRequest.Amount = Number(this.request.ApplicationFees);
        this.emitraRequest.ProcessingFee = 0;// Number(this.request.ProcessingFee);
        this.emitraRequest.ApplicationIdEnc = this.request.ApplicationID.toString();
        this.emitraRequest.DirectAdmission = Number(this.request.DirectAdmission);
        if (this.sSOLoginDataModel.IsKiosk)
        {
          this.emitraRequest.ServiceID = this.sSOLoginDataModel.ServiceID.toString();
          this.emitraRequest.KIOSKCODE = this.sSOLoginDataModel.KIOSKCODE;
          if (
            EnumEmitraService.BTER_DeplomaENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
            EnumEmitraService.BTER_DeplomaNonENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
            EnumEmitraService.BTER_DeplomaLateral_2ENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
            EnumEmitraService.BTER_DegreeNonENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
            EnumEmitraService.BTER_DegreeLateral_2Year_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID 

          )
          {
            this.emitraRequest.SSoToken = this.sSOLoginDataModel.SSoToken;
            this.emitraRequest.FormCommision =this.request.FormCommision;
          }
          else
          {
            this.emitraRequest.SSoToken = this.sSOLoginDataModel.SSoToken;
            this.emitraRequest.FormCommision = 10;
          }
        }
        else {
         
          this.emitraRequest.ServiceID = this.request.ServiceID.toString()
          this.emitraRequest.ID = this.request?.UniqueServiceID ?? 0;
          this.emitraRequest.FormCommision = 0;
        }
        this.emitraRequest.IsKiosk = this.sSOLoginDataModel.IsKiosk;
        this.emitraRequest.UserName = this.request.StudentName;
        this.emitraRequest.MobileNo = this.request.MobileNo;
        this.emitraRequest.StudentID = this.request.ApplicationID;
        this.emitraRequest.SemesterID = 0;
        this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
        this.emitraRequest.TypeID = EnumConfigurationType.Admission;
        this.emitraRequest.DepartmentID = EnumDepartment.BTER;
        this.emitraRequest.FeeFor = EnumFeeFor.Application;
        this.emitraRequest.USEREMAIL = this.request.Email;
        if (this.emitraRequest.IsKiosk)
        {
          this.loaderService.requestStarted();
          try {
            await this.emitraPaymentService.EmitraApplicationPayment(this.emitraRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                this.PDFURL = data['PDFURL'];
                if (data.State == EnumStatus.Success) {
                  this.Swal2.ConfirmationSuccess("Thank you! Your application payment was successful", async (result: any) => {
                    if (result.isConfirmed) {
                      this.isLoading = false;
                      //sms code missiog
                      try {
                        await this.SendApplicationMessage();
                        window.open(this.PDFURL, '_blank');
                        setTimeout(function () { window.location.reload(); }, 200)
                      }
                      catch (ex) {
                        console.log(ex)
                        this.isLoading = false;
                      }
                    }
                    else {
                      let displayMessage = this.Message ?? this.ErrorMessage;
                      this.toastr.error(displayMessage);
                      this.isLoading = false;
                    }
                  });
                  //open
                }
                else {
                  let displayMessage = this.Message ?? this.ErrorMessage;
                  this.toastr.error(displayMessage)
                  this.isLoading = false;
                }
              })
          }
          catch (ex) {
            console.log(ex)
          }
          finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
              // this.isLoading = false;
            }, 2000);
          }

        }
        else {
          this.loaderService.requestStarted();
          try {
            await this.emitraPaymentService.EmitraApplicationPaymentNew(this.emitraRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                if (data.State == EnumStatus.Success) {
                  await this.RedirectEmitraPaymentRequest(
                    data.Data.MERCHANTCODE,
                    data.Data.ENCDATA,
                    data.Data.PaymentRequestURL
                  )

                }
                else {

                  let displayMessage = this.Message ?? this.ErrorMessage;
                  this.toastr.error(displayMessage)
                  this.isLoading = false;
                }
              })
          }

          catch (ex) { console.log(ex) }

          finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
              // this.isLoading = false;
            }, 2000);
          }
        }
      }
    }
    )

  }

  RedirectEmitraPaymentRequest(pMERCHANTCODE: any, pENCDATA: any, pServiceURL: any) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", pServiceURL);

    //Hidden Encripted Data
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "ENCDATA");
    hiddenField.setAttribute("value", pENCDATA);
    form.appendChild(hiddenField);

    //Hidden Service ID
    var hiddenFieldService = document.createElement("input");
    hiddenFieldService.setAttribute("type", "hidden");
    hiddenFieldService.setAttribute("name", "SERVICEID");
    hiddenFieldService.setAttribute("value", this.emitraRequest.ServiceID);
    form.appendChild(hiddenFieldService);
    //Hidden Service ID
    var MERCHANTCODE = document.createElement("input");
    MERCHANTCODE.setAttribute("type", "hidden");
    MERCHANTCODE.setAttribute("name", "MERCHANTCODE");
    MERCHANTCODE.setAttribute("value", pMERCHANTCODE);
    form.appendChild(MERCHANTCODE);



    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  async SendApplicationMessage() {
    try {
      this.loaderService.requestStarted();
      this.messageModel.MobileNo = this.request.MobileNo;
      this.messageModel.MessageType = EnumMessageType.ApplicationMessageBTER;
      this.messageModel.ApplicationNo = this.request.ApplicationNo;
      await this.smsMailService.SendApplicationMessage(this.messageModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success('Message sent successfully');
          } else {
            this.toastr.warning('Something went wrong');
          }
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async SavePreview(content: any, ApplicationID: number)
  {
    ////this.IsShowViewStudent = true;
    this.request.ApplicationID = ApplicationID
    this.GetById();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    /*await this.GetById();*/
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

  async CloseModel() {
    this.loaderService.requestStarted();
    setTimeout(() => {
      this.modalService.dismissAll();
      this.loaderService.requestEnded();
    }, 200);
  }
  printDiv(): void {
    const printContent = document.getElementById('Preview')?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent; // Replace body content with the div content
      window.print(); // Open print dialog
      document.body.innerHTML = originalContent; // Restore original content after printing
      window.location.reload(); // Optional: Reload the page to ensure content is restored
    }
  }

  async DownloadApplicationForm() {
    try {
      
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = EnumDepartment.BTER;
      this.searchrequest.ApplicationID = this.request.ApplicationID
      console.log("searchrequest", this.searchrequest)
      await this.reportService.GetApplicationFormPreview1(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
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

  async DownloadChallan() {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.searchrequest.ApplicationID;
      console.log("searchrequest", this.searchrequest)
      await this.reportService.DownloadChallan(this.searchrequest.ApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadChallanFile(data.Data, 'file download');
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

  DownloadFile(FileName: string, DownloadfileName: any): void {
            
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + this.request.DocumentDetailList[0].FolderName + "/" + FileName;
    // const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  DownloadChallanFile(FileName: string, DownloadfileName: any): void {
            debugger
    // const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + this.request.DocumentDetailList[0].FolderName + "/" + FileName;
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

  // Added on 2025-01-25 #Pradeep 
  async GetDateDataList() {
    try {
      this.dateConfiguration.DepartmentID = this.request.DepartmentID;
      this.dateConfiguration.SSOID = this.sSOLoginDataModel.SSOID;
      await this.dateMasterService.GetDateDataList(this.dateConfiguration)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AdmissionDateList = data['Data'];
          const today = new Date();
          this.AdmissionDateList.filter((x: any) => {
            if (new Date(x.To_Date) > today && x.DepartmentID == this.request.DepartmentID && x.CourseTypeID == this.request.CourseTypeID) {
              this.showFeeButton = true;
            }
          })
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async CheckPaymentSataus() {
    try
    {
      this.transactionStatusDataModel.TransactionID = this.request.TransactionID;
      this.transactionStatusDataModel.DepartmentID = this.request.DepartmentID;
      this.transactionStatusDataModel.PRN = this.request.PRN;
      this.transactionStatusDataModel.ServiceID = this.request.ServiceID;
      this.transactionStatusDataModel.ApplicationID = this.request.ApplicationID.toString();
      
      await this.emitraPaymentService.EmitraApplicationVerifyPaymentStatus(this.transactionStatusDataModel)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success)
          {
            if (data.Data?.STATUS == 'SUCCESS' || data.Data?.STATUS == 'Success')
            {
              if (data.Data?.PRN)
              {
                //this.router.navigate(['/ApplicationPaymentStatus'], { queryParams: { TransID: data.Data.PRN } });
                window.open(`/ApplicationPaymentStatus?TransID=${data.Data.PRN}`, "_self")
              }
            }
            else
            {
              this.toastr.error(this.Message)
            }
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
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
              DisplayColumnNameEn: doc.DisplayColumnNameEn.replace(/^Upload/i, '') // Remove "upload the "
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
          debugger
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
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)
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
            this.toastr.error(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  CloseModal() {

    this.modalService.dismissAll();
    this.DocumentList = []
/*    this.GetAllDataActionWise()*/
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
      this.toastr.error("Please Upload File ")
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

                this.toastr.success(data.Message);
                window.location.reload();
                this.CloseModal()

              }
              if (data.State === EnumStatus.Error) {
                this.toastr.error(data.ErrorMessage);
              } else if (data.State === EnumStatus.Warning) {
                this.toastr.warning(data.ErrorMessage);
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


  @ViewChild('appMenu', { static: false }) menuElementRef!: ElementRef;
  async openPdfModal(url: string): Promise<void> {

    const el = document.getElementById('app-menu');
    if (el) {
      el.classList.add('DocShowers'); // or any class you want
    }


    const ext = url.split('.').pop()?.toLowerCase();
    this.isPdf = ext === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');

    this.safePdfUrl = null;
    this.imageSrc = '';
    this.pdfUrl = url;
    this.isError = false;

    try {
      const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.imageSrc = blobUrl;
      } else {
        throw new Error('Blob is undefined');
      }
    } catch (error) {
      console.error('File load failed, using dummy image.', error);
      this.isPdf = false;
      this.isImage = true;
      this.safePdfUrl = null;
      this.imageSrc = 'assets/images/dummyImg.jpg';
      this.isError = true;
    }

    this.showPdfModal = true;
  }


  //openPdfModal(url: string): void {

  //  const ext = url.split('.').pop()?.toLowerCase();
  //  this.isPdf = ext === 'pdf';
  //  this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');
  //  let url1: string = '';
  //  this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
  //    url1 = window.URL.createObjectURL(blob);
  //  });
  //   
  //  this.pdfUrl = url;
  //  this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url1);  // <-- Sanitize here
  //  this.showPdfModal = true;
  //}



  ClosePopupAndGenerateAndViewPdf(): void {
    const el = document.getElementById('app-menu');
    if (el) {
      el.classList.remove('DocShowers'); // or any class you want
    }
    this.showPdfModal = false;
    this.safePdfUrl = null;
    this.pdfUrl = null;
    this.imageSrc = null;
    this.isPdf = false;
    this.isImage = false;
    this.isError = false;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/dummyImg.jpg';
  }

  async Login() {
    this.loaderService.requestStarted();

    if(this.sSOLoginDataModel.PrincipleSSOID == undefined || this.sSOLoginDataModel.PrincipleSSOID == ''){
      return
    } else {
      this.UserName = this.sSOLoginDataModel.PrincipleSSOID
    }

    try {
      
      
      await this.sSOLoginService.login(this.UserName, "KD@1230").subscribe({
        next: (data) => {
          data = JSON.parse(JSON.stringify(data.body));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          
          if (this.State == EnumStatus.Success) {
            this.sSOLoginDataModel = data['Data'];
            

            if (this.sSOLoginDataModel.RoleID == this._EnumRole.HostelWarden || this.sSOLoginDataModel.RoleID == this._EnumRole.HostelWardenITINCVT || this.sSOLoginDataModel.RoleID == this._EnumRole.HostelWardenITISCVT)
            {
              this.sSOLoginDataModel.IsMutiHostelWarden = true;
              const getHostelSID = data['Data']['HostelIDs'];
              if (getHostelSID != null && getHostelSID != '') {
                const hostelIDArray = getHostelSID.split(",");
                //alert(hostelIDArray);
                this.sSOLoginDataModel.HostelID =  hostelIDArray[0];
              }
              else {
                this.sSOLoginDataModel.HostelID = 0;
              }

            }

           

            //set user session 
            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
            //set cookie
            this.cookieService.set('LoginStatus', "OK");

            //redirect
            //window.open('/dashboard', "_self");
            this.router.navigate(['/dashboard']);
          }
          else {
            this.toastr.error(this.Message);

          }
        },
        error: (error) => {
          //this.errorMessage = 'Invalid SSOID or Password';
        }
      });



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
}


