import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ItiApplicationSearchmodel, PreviewApplicationModel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumApplicationFromStatus, EnumConfigurationType, EnumDepartment, EnumEmitraService, EnumFeeFor, EnumMessageType, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitraRequestDetails, StudentFeesTransactionItems, TransactionStatusDataModel } from '../../../../Models/PaymentDataModel';
import { EmitraPaymentService } from '../../../../Services/EmitraPayment/emitra-payment.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';
import { DocumentDetailsModel } from '../../../../Models/DocumentDetailsModel';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { ApplicationMessageDataModel } from '../../../../Models/ApplicationMessageDataModel';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { DateConfigurationModel } from '../../../../Models/DateConfigurationDataModels';
import { DateConfigService } from '../../../../Services/DateConfiguration/date-configuration.service';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ElementRef, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';

@Component({
  selector: 'app-iti-direct-preview-form',
  standalone: false,
  templateUrl: './iti-direct-preview-form.component.html',
  styleUrl: './iti-direct-preview-form.component.css'
})
export class ITIDirectPreviewFormComponent {
  @ViewChild('modal_ViewApplication') modal_ViewApplication: any;
  public DepartmentID: any = 0;
  public _enumDepartment = EnumDepartment
  public CompanyMasterDDLList: any[] = [];
  public BoardList: any = []
  public request = new PreviewApplicationModel()
  Eligible8thTradesID:number=0
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public PDFURL: string = '';
  public _GlobalConstants: any = GlobalConstants;
  public Options8thLevel: any =[]
  public Options10thLevel: any = []
  public Options12thLevel: any = []
  public transactionStatusDataModel = new TransactionStatusDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();

  emitraRequest = new EmitraRequestDetails();

  public PassingYearList: any = []
  public isSupplement: boolean = false
  calculatedPercentage: number = 0;
  public searchrequest = new ItiApplicationSearchmodel()
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  public Status: number = 0
  public UserID: number = 0
  public ApplicationID: number = 0
  closeResult: string | undefined;
  public ShowPaymentButton: boolean = false;
  public IsTermAndCondition: boolean = false;
  public IsShowIncompleteData: boolean = false;
  public ShowfinalLButton: boolean = true; 
  public documentDetails: DocumentDetailsModel[] = []
  public filteredDocumentDetails:any=[]
  public messageModel = new ApplicationMessageDataModel()

  dateConfiguration = new DateConfigurationModel();
  public AdmissionDateList: any = []
  public courseTypeList: any = []
  public FromDate:string=''
  public isITIAddmissionOpen: boolean = true
  sciencePercentage:string = '0';
  mathPercentage: string = '0';

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
    private ItiApplicationFormService: ItiApplicationFormService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private emitraPaymentService: EmitraPaymentService,
    private reportService: ReportService,
    private http: HttpClient,
    private smsMailService: SMSMailService,
    private router: Router,
    private encryptionService: EncryptionService,
    private dateMasterService: DateConfigService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private ApplicationService: BterApplicationForm,
  ) { }

  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchrequest.DepartmentID = EnumDepartment.ITI;
    this.GetITIDateDataList();
    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"))
    if (this.ApplicationID > 0)
    {
      this.searchrequest.ApplicationID = this.ApplicationID;
      this.request.ApplicationID = this.ApplicationID;
      this.GetById()
    } else {
      window.open(`/StudentJanAadharDetail`, "_self");
    }
  }

  Changetab(index: number) {
    this.formSubmitSuccess.emit(true)
    this.tabChange.emit(index)
  }

  async GetById() {

    this.Options10thLevel = []
    this.Options12thLevel = []
    this.Options8thLevel=[]
    this.isSubmitted = false;
    this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
    this.searchrequest.RoleID = this.sSOLoginDataModel.RoleID
    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetApplicationPreviewbyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          this.request.ApplicationID = data['Data']['ApplicationID']
          if (data['Data'] != null) {
            this.request = data['Data']
            this.request.OptionalViewDatas = data['Data']['OptionsViewData']
             
            console.log("this.request.OptionalViewDatas", this.request.OptionalViewDatas)
            if(this.request.IsFinalPay == true && this.request.IsfinalSubmit == EnumApplicationFromStatus.FinalSave) {
              this.router.navigate(['/Itipreviewform'], {
                  queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
                });
            }
            this.request.OptionalViewDatas.map((option: any) => {
              if(option.TradeLevel == 8) {
                this.Options8thLevel.push(option)
              } else if(option.TradeLevel == 10) {
                this.Options10thLevel.push(option)
              }
              else if (option.TradeLevel == 12) {
                this.Options12thLevel.push(option)
              }
            })
            
            this.request.QualificationViewDetails = data.Data.QualificationViewDetails
            console.log("this.request", this.request)
            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0'); 
            const day = String(dob.getDate()).padStart(2, '0');
            this.request.DOB = `${year}-${month}-${day}`;
            this.ShowHideButtons(this.request.IsfinalSubmit, this.request.IsFinalPay);
            if (this.request.PendingDataModel?.length > 0) { this.IsShowIncompleteData = true }
            else { this.IsShowIncompleteData = false }
          }

          if (this.request?.DocumentDetailList) {
            this.documentDetails = this.request.DocumentDetailList;
            this.filteredDocumentDetails = this.documentDetails.filter((x) => x.GroupNo === 1);
          } else {
            this.documentDetails = [];
            this.filteredDocumentDetails = [];
          }

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, (error: any) => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async SaveFinalSubmit()
  {
    this.isSubmitted = true
    this.UserID = this.sSOLoginDataModel.UserID


    if (!this.IsTermAndCondition) {
      this.toastr.error("Please read terms carefully before proceeding.")
      return;
    }

    if (this.request.PendingDataModel?.length > 0) {
      this.toastr.error("Please fill in all the pending details first.")
      return;
    }

    if (!await this.ChekTradeMinimunPer()) {
      return;
    }

    let obj = {
      ApplicationID: this.request.ApplicationID
    }

    try
    {
    
          this.isSubmitted = true;
          this.loaderService.requestStarted();

      await this.ApplicationService.JailAdmissionFinalSubmit(obj)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
               
              if (this.State == EnumStatus.Success) {
                
               /* this.GetById();*/
                //this.toastr.success(this.Message)

/*                this.SavePreview(content, this.request.ApplicationID)*/


                //if (this.Status == EnumApplicationFromStatus.FinalSave) {
                //    this.router.navigate(['/Itipreviewform'], {
                //    queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
                //  });
                //}

                this.ShowHideButtons(EnumApplicationFromStatus.FinalSave, true);
                // this.router.navigate(['/Itipreviewform'], {
                //   queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
                // });
                
              }
              else
              {
                this.toastr.error(this.ErrorMessage)
                this.loaderService.requestEnded();
              }

            }
  
      )
    
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ShowHideButtons(status: number, IsPaymentSuccess: boolean = false) {

     

    if (status == EnumApplicationFromStatus.FinalSave && IsPaymentSuccess == false) {

      this.ShowfinalLButton = false;
      this.ShowPaymentButton = true;
      this.IsTermAndCondition = true;
    }
    else if (status == EnumApplicationFromStatus.FinalSave && IsPaymentSuccess == true) {
      this.ShowPaymentButton = false;
      this.ShowfinalLButton = false
      this.IsTermAndCondition = true;
    }
    else {
      this.ShowfinalLButton = true;
      this.ShowPaymentButton = false;
      this.IsTermAndCondition = false;
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

  async PayApplicationFees() {

    this.Swal2.Confirmation("Are you sure you want to Submit & Make Payment?", async (result: any) =>
    {
      if (result.isConfirmed) {
        
        this.isLoading = true;
        this.emitraRequest = new EmitraRequestDetails();
        //Set Parameters for emitra
        this.emitraRequest.Amount = Number(this.request.ApplicationFees);
        this.emitraRequest.ProcessingFee = Number(this.request.ProcessingFee);
        this.emitraRequest.ApplicationIdEnc = this.request.ApplicationID.toString();

        if (this.sSOLoginDataModel.IsKiosk)
        {
          this.emitraRequest.ServiceID = this.sSOLoginDataModel.ServiceID.toString();
          this.emitraRequest.KIOSKCODE = this.sSOLoginDataModel.KIOSKCODE;
          if (EnumEmitraService.ITIEmitraFormService.toString() == this.sSOLoginDataModel.ServiceID)
          {
            this.emitraRequest.SSoToken = this.sSOLoginDataModel.SSoToken;
            this.emitraRequest.FormCommision = this.request.FormCommision;
          }
          else
          {
            this.emitraRequest.SSoToken = this.sSOLoginDataModel.SSoToken;
            this.emitraRequest.FormCommision = 10;
          }
        }
        else
        {
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
        this.emitraRequest.DepartmentID = EnumDepartment.ITI;
        this.emitraRequest.FeeFor = EnumFeeFor.Application;
        this.emitraRequest.USEREMAIL = this.request.Email;
        if (this.emitraRequest.IsKiosk)
        {
          this.loaderService.requestStarted();
          try
          {
            await this.emitraPaymentService.EmitraApplicationPayment(this.emitraRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                this.PDFURL = data['PDFURL'];
                if (data.State == EnumStatus.Success)
                {
                  this.Swal2.ConfirmationSuccess("Thank you! Your application payment was successful", async (result: any) =>
                  {
                    if (result.isConfirmed)
                    {
                      this.isLoading = false;
                      //sms code missiog
                      try
                      {
                        await this.SendApplicationMessage();
                        window.open(this.PDFURL, '_blank');
                        setTimeout(function () { window.location.reload(); }, 200)
                      }
                      catch (ex)
                      {
                        console.log(ex)
                        this.isLoading = false;
                      }
                    }
                    else
                    {
                      let displayMessage = this.Message ?? this.ErrorMessage;
                      this.toastr.error(displayMessage);
                      this.isLoading = false;
                    }
                  });
                  //open
                }
                else
                {
                  let displayMessage = this.Message ?? this.ErrorMessage;
                  this.toastr.error(displayMessage)
                  this.isLoading = false;
                }
              })
          }
          catch (ex)
          {
            this.isLoading = false;;
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

  async DownloadApplicationForm() {
    try {
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = EnumDepartment.ITI;
      console.log("searchrequest",this.searchrequest)
      await this.reportService.GetITIApplicationForm(this.searchrequest)
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
  DownloadFile(FileName: string, DownloadfileName: any): void
  {
 
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

  async SendApplicationMessage()
  {
    try
    {
      this.loaderService.requestStarted();
      this.messageModel.MobileNo = this.request.MobileNo;
      this.messageModel.MessageType = EnumMessageType.FormSubmit;
      this.messageModel.ApplicationNo = this.request.ApplicationNo;
      await this.smsMailService.SendApplicationMessage(this.messageModel)
        .then((data: any) =>
        {
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

  async DownloadChallan() {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.searchrequest.ApplicationID;
      console.log("searchrequest", this.searchrequest)
      await this.reportService.DownloadITIChallan(this.searchrequest.ApplicationID)
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


  async CheckPaymentSataus() {
    try {
      this.transactionStatusDataModel.TransactionID = this.request.TransactionID;
      this.transactionStatusDataModel.DepartmentID = EnumDepartment.ITI;
      this.transactionStatusDataModel.PRN = this.request.PRN;
      this.transactionStatusDataModel.ServiceID = this.request.ServiceID;
      this.transactionStatusDataModel.ApplicationID = this.request.ApplicationID.toString();

      await this.emitraPaymentService.EmitraApplicationVerifyPaymentStatus(this.transactionStatusDataModel)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            if (data.Data?.STATUS == 'SUCCESS' || data.Data?.STATUS == 'Success') {
              if (data.Data?.PRN) {
                //this.router.navigate(['/ApplicationPaymentStatus'], { queryParams: { TransID: data.Data.PRN } });
                window.open(`/ApplicationPaymentStatus?TransID=${data.Data.PRN}`, "_self")
              }
            }
            else {
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






  async GetITIDateDataList()
  {
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

          var lnth = this.AdmissionDateList.filter(function (x: any) { return new Date(x.To_Date) > today && new Date(x.From_Date) < today && x.TypeID == EnumConfigurationType.JailAdmission && x.DepartmentID == deptID }).length
          if (lnth <= 0)
          {
            this.toastr.warning("Date for ITI Admission is Closed or Not Open");
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


  async ChekTradeMinimunPer() {

    var result = true;

    if (this.Options10thLevel.length > 0 && this.request.QualificationViewDetails.filter(function (x: any) { return x.QualificationID == 10 }).length== 0)
    {
      this.Swal2.Info('Please enter your 10th class educational details, as you have selected trades that require 10th-level qualification');
      result = false;

    }


    if (this.request.QualificationViewDetails.filter(function (x: any) { return x.QualificationID == 10 }).length > 0)

    {
      await this.calculatePercentages10thsubject()
    
      if (this.Options10thLevel.filter((choice: any) => { return this.sciencePercentage < choice.MinPercentageInScience }).length > 0) {
        var dataScience = this.Options10thLevel.filter((choice: any) => { return this.sciencePercentage < choice.MinPercentageInScience })[0];

        var msg = 'In the selected trade ' + dataScience.TradeName + ', the minimum required percentage in Science is ' + dataScience.MinPercentageInScience + '%, but your percentage is ' + this.sciencePercentage + '%. Please remove this trade or choose another one.'

        var msgHi = 'चयनित ट्रेड ' + dataScience.TradeName + ' में, विज्ञान में न्यूनतम आवश्यक प्रतिशत ' + dataScience.MinPercentageInScience + '% है, लेकिन आपका प्रतिशत ' + this.sciencePercentage + '% है। कृपया इस ट्रेड को हटा दें या कोई दूसरा ट्रेड चुनें।';


        //this.toastr.warning(msg);

        this.Swal2.Info(msg+'<br/>'+msgHi);

        result=false;
      }

      if (this.Options10thLevel.filter((choice: any) => { return this.mathPercentage < choice.MinPercentageInMath }).length > 0) {
        var dataMaths = this.Options10thLevel.filter((choice: any) => { return this.mathPercentage < choice.MinPercentageInMath })[0];
               
        var msgM = 'In the selected trade ' + dataMaths.TradeName + ', the minimum required percentage in Maths is ' + dataMaths.MinPercentageInScience + '%, but your percentage is ' + this.mathPercentage +'%. Please remove this trade or choose another one.'

        var msgMHi = 'चयनित ट्रेड ' + dataMaths.TradeName + ' में, गणित में न्यूनतम आवश्यक प्रतिशत ' + dataMaths.MinPercentageInScience + '% है, लेकिन आपका प्रतिशत ' + this.mathPercentage + '% है। कृपया इस ट्रेड को हटा दें या कोई दूसरा ट्रेड चुनें।';


        //this.toastr.warning(msg);

        this.Swal2.Info(msgM + '<br/>' + msgMHi);
        result = false;
      }
    }

    return result;

  }
  //async calculatePercentages10thsubject() {


  //  var dataQua = this.request.QualificationViewDetails.filter(function (x: any) { return x.QualificationID == 10 })
  //  const marktype = dataQua[0].Marktype || 0;
  //  const mathMax = dataQua[0].MathsMaxMarks || 0;
  //  const mathObtained = dataQua[0].MathsObtMarks || 0;
  //    this.mathPercentage = (mathMax === 0)
  //      ? '0.00'
  //      : ((mathObtained / mathMax) * 100).toFixed(2);

  //  const scienceMax = dataQua[0].ScienceMaxMarks || 0;
  //  const scienceObtained = dataQua[0].ScienceObtMarks || 0;
  //    this.sciencePercentage = (scienceMax === 0)
  //      ? '0.00'
  //      : ((scienceObtained / scienceMax) * 100).toFixed(2);
  //  }

  async calculatePercentages10thsubject() {

    var dataQua = this.request.QualificationViewDetails.filter(function (x: any) { return x.QualificationID == 10 });
    const marktype = dataQua[0].Marktype || 0;
    const mathMax = dataQua[0].MathsMaxMarks || 0;
    const mathObtained = dataQua[0].MathsObtMarks || 0;
    let scienceMax = dataQua[0].ScienceMaxMarks || 0;
    let scienceObtained = dataQua[0].ScienceObtMarks || 0;

    if (marktype == '83') { // Calculation using Marks
      this.mathPercentage = (mathMax === 0)
        ? '0.00'
        : ((mathObtained / mathMax) * 100).toFixed(2);

      this.sciencePercentage = (scienceMax === 0)
        ? '0.00'
        : ((scienceObtained / scienceMax) * 100).toFixed(2);
    } else if (marktype == '84') { // Calculation using CGPA
      scienceMax = 10; // CGPA Max value
      scienceObtained = dataQua[0].ScienceObtMarks || 0; // CGPA Value

      this.mathPercentage = (mathObtained === 0)
        ? '0.00'
        : (mathObtained * 9.5).toFixed(2);

      this.sciencePercentage = (scienceObtained === 0)
        ? '0.00'
        : (scienceObtained * 9.5).toFixed(2);
    } else {
      this.mathPercentage = '0.00';
      this.sciencePercentage = '0.00';
    }
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

  async SaveFinalSubmit2() {

  }

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

}
