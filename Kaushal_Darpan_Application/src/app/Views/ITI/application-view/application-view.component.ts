import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants, EnumStatus, EnumDepartment } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { ItiApplicationSearchmodel } from '../../../Models/ItiApplicationPreviewDataModel';
import { PreviewApplicationModel } from '../../../Models/PreviewApplicationformModel';
import { ItiApplicationFormService } from '../../../Services/ItiApplicationForm/iti-application-form.service';
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { AppsettingService } from '../../../Common/appsetting.service';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-application-view',
  standalone: false,
  templateUrl: './application-view.component.html',
  styleUrl: './application-view.component.css'
})
export class ViewApplicationComponent {
  @ViewChild('modal_ViewApplication') modal_ViewApplication: any;
  public sSOLoginDataModel = new SSOLoginDataModel();
  closeResult: string | undefined;
  @Input() MobileNo!: any;
  @Output() onVerified = new EventEmitter<void>();
  private modalRef: any;

  public _enumDepartment = EnumDepartment;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  // public MobileNo: number = 0;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public ApplicationID: number = 0;
  public SSOID: string = "";
  public searchrequest = new ItiApplicationSearchmodel()
  public request = new PreviewApplicationModel();
  public Options8thLevel: any = []
  public Options10thLevel: any = []
  public Options12thLevel: any = []
  public documentDetails: DocumentDetailsModel[] = []
  public filteredDocumentDetails: any = []
  public TransactionDataList: any = []

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
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private sMSMailService: SMSMailService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private ItiApplicationFormService: ItiApplicationFormService,
    private appsettingConfig: AppsettingService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private http: HttpClient,
  ) {}

  async ngOnInit() { 


    this.searchrequest.DepartmentID = EnumDepartment.ITI;
   

  
      
    


  }

  formatMobileNo(mobile: string): string {
    if (mobile && mobile.length > 4) {
      // Mask the middle part and show the last 4 digits
      const masked = '********' + mobile.slice(-2);
      return masked;
    }
    return mobile;
  }

  CloseOTPModal() {
    if (this.modalRef) {
      this.modalRef.close(); 
    }
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

  async OpenViewApplicationPopup() {
    

    this.searchrequest.ApplicationID = this.ApplicationID;
    this.request.ApplicationID = this.ApplicationID;
    await this.GetById();

    this.ViewPopup(this.modal_ViewApplication);
      
    
  }

  async GetById() {
    
    this.Options10thLevel = []
    this.Options12thLevel = []
    this.Options8thLevel = []
 
    this.searchrequest.SSOID = this.SSOID
    this.searchrequest.RoleID = 28;
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
            //if (this.request.IsFinalPay == true && this.request.IsfinalSubmit == EnumApplicationFromStatus.FinalSave) {
            //  this.router.navigate(['/Itipreviewform'], {
            //    queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
            //  });
            //}
            this.request.OptionalViewDatas.map((option: any) => {
              if (option.TradeLevel == 8) {
                this.Options8thLevel.push(option)
              } else if (option.TradeLevel == 10) {
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
            //this.ShowHideButtons(this.request.IsfinalSubmit, this.request.IsFinalPay);
            //if (this.request.PendingDataModel?.length > 0) { this.IsShowIncompleteData = true }
            //else { this.IsShowIncompleteData = false }
          }

          if (this.request?.DocumentDetailList) {
            this.documentDetails = this.request.DocumentDetailList;
            this.filteredDocumentDetails = this.documentDetails.filter((x) => x.GroupNo === 1);
          } else {
            this.documentDetails = [];
            this.filteredDocumentDetails = [];
          }

          this.request.OptionalViewDatas = data['Data']['OptionsViewData'];

          this.TransactionDataList = data['Data']['EmitraTransactionsModelList'];

          console.log(this.TransactionDataList);


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


  // async ViewOTPPopup(content: any) { 

  //   this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  async ViewPopup(content: any) {
    this.modalRef = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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


  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      await this.sMSMailService.SendMessage(this.MobileNo, "OTP")
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

  // VerifyOTP() :boolean {
  //   if (this.OTP === this.GeneratedOTP || GlobalConstants.DefaultOTP)
  //      {
  //     this.toastr.success('OTP Verified');
  //     this.activeModal.close();
  //     return true;
  //     this.onVerified.emit(); // Notify parent
  //   } else {
  //     this.toastr.error('Invalid OTP');
  //       return false;
  //   }
  // }

  VerifyOTP() {
    if (this.OTP === this.GeneratedOTP || this.OTP === GlobalConstants.DefaultOTP) {
      this.toastr.success('OTP Verified');
      this.activeModal.close();
      this.onVerified.emit(); 
      this.OTP = "";
      if (this.modalRef) {
        this.modalRef.close(); 
      }
    } else {
      this.toastr.error('Invalid OTP');
    }
  }


  @ViewChild('appMenu', { static: false }) menuElementRef!: ElementRef;
  //async openPdfModal(url: string): Promise<void> {

  //  const el = document.getElementById('app-menu');
  //  if (el) {
  //    el.classList.add('DocShowers'); // or any class you want
  //  }


  //  const ext = url.split('.').pop()?.toLowerCase();
  //  this.isPdf = ext === 'pdf';
  //  this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');

  //  this.safePdfUrl = null;
  //  this.imageSrc = '';
  //  this.pdfUrl = url;
  //  this.isError = false;

  //  try {
  //    const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
  //    if (blob) {
  //      const blobUrl = URL.createObjectURL(blob);
  //      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  //      this.imageSrc = blobUrl;
  //    } else {
  //      throw new Error('Blob is undefined');
  //    }
  //  } catch (error) {
  //    console.error('File load failed, using dummy image.', error);
  //    this.isPdf = false;
  //    this.isImage = true;
  //    this.safePdfUrl = null;
  //    this.imageSrc = 'assets/images/dummyImg.jpg';
  //    this.isError = true;
  //  }

  //  this.showPdfModal = true;
  //}


  async openPdfModal(url: string): Promise<void> {

      const el = document.getElementById('app-menu');
      if (el) {
        el.classList.add('DocShowers'); // or any class you want
      }

    const ext = url.split('.').pop()?.toLowerCase() || '';
    this.isPdf = ext === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);

    this.safePdfUrl = null;
    this.imageSrc = '';
    this.pdfUrl = url;
    this.isError = false;

    try {
      if (this.isPdf) {
        // Fetch PDF as Blob
        const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
        if (!blob) throw new Error('Blob is undefined');
        const blobUrl = URL.createObjectURL(blob);
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      } else if (this.isImage) {
        // For images, no need to fetch blob — use URL directly
        this.imageSrc = url;
      } else {
        throw new Error('Unsupported file type');
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

}
