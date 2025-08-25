import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { BterSearchmodel } from '../../../Models/ApplicationFormDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { PreviewApplicationModel } from '../../../Models/PreviewApplicationformModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumApplicationFromStatus, EnumConfigurationType, EnumCourseType, EnumDepartment, EnumFeeFor, EnumRole, EnumStatus, EnumUserType, GlobalConstants } from '../../../Common/GlobalConstants';
import { ImageErrorDirective } from '../../../Common/image-error.directive';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { JanAadharMemberDetails } from '../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitraRequestDetails, StudentFeesTransactionItems, TransactionStatusDataModel } from '../../../Models/PaymentDataModel';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { ReportService } from '../../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { DateConfigService } from '../../../Services/DateConfiguration/date-configuration.service';
import { DateConfigurationModel } from '../../../Models/DateConfigurationDataModels';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-preview-form',
  templateUrl: './preview-form.component.html',
  styleUrls: ['./preview-form.component.css'],
  standalone: false
})
export class PreviewFormComponent {

  public CompanyMasterDDLList: any[] = [];
  public BoardList: any = []
  public request = new PreviewApplicationModel()
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
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public janaadharMemberDetails = new JanAadharMemberDetails()
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  emitraRequest = new EmitraRequestDetails();
  public ShowPaymentButton: boolean = false;
  public ShowfinalLButton: boolean = true;
  @Output() saveSuccess = new EventEmitter<void>();
  public documentDetails: DocumentDetailsModel[] = []
  public ApplicationID: number = 0;
  public IsTermAndCondition: boolean = false;
  public IsShowIncompleteData: boolean = false;
  public filteredDocumentDetails: any = []
  public dateConfiguration = new DateConfigurationModel()
  public showFeeButton: boolean = false;
  public transactionStatusDataModel = new TransactionStatusDataModel();

  public _EnumRole= EnumRole;
  
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
    private encryptionService: EncryptionService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    
    let id = this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0";
    this.ApplicationID = Number(this.encryptionService.decryptData(id))
    if (this.ApplicationID > 0) {
      this.searchrequest.ApplicationID = this.ApplicationID;
      this.request.ApplicationID = this.ApplicationID;
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



  async GetById() {
    this.isSubmitted = false;
    this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetPreviewDatabyID(this.searchrequest)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ada');
          this.request.ApplicationID = data['Data']['ApplicationID']
          if (data['Data'] != null) {
            this.request = data['Data']
            console.log()
            this.request.OptionalViewDatas = data['Data']['optionalviewDatas']
            /* alert(this.request.IsSupplement)*/
            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0');
            const day = String(dob.getDate()).padStart(2, '0');
            this.request.DOB = `${year}-${month}-${day}`;
            
            if (this.request?.DocumentDetailList) {
              this.documentDetails = this.request.DocumentDetailList;
           
              this.request.DocumentDetailList = this.request.DocumentDetailList.map(doc => ({
                ...doc,
                DisplayColumnNameEn: doc.DisplayColumnNameEn.replace(/^upload the scanned copy of /i, '') // Remove "upload the "
              }));
              this.filteredDocumentDetails = this.documentDetails.filter((x) => x.GroupNo === 1);
            } else {
              this.documentDetails = [];
              this.filteredDocumentDetails = [];
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
                this.router.navigate(['/PreviewForm'], {
                  queryParams: { AppID: this.encryptionService.encryptData(this.request.ApplicationID??"0") }
                });

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

  async PayApplicationFees() {

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
      await this.reportService.GetApplicationFormPreview(this.searchrequest)
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
}


