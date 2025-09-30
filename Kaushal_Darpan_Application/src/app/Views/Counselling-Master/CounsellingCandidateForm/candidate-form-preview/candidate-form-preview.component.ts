import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { DateConfigService } from '../../../../Services/DateConfiguration/date-configuration.service';
import { EmitraPaymentService } from '../../../../Services/EmitraPayment/emitra-payment.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { Counselling_OptionFormDataModel, CounsellingApplicationPreviewDataModel } from '../../../../Models/CounsellingApplicationFormDataModel';
import { CounsellingApplicationFormService } from '../../../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { Counselling_DocumentDetailsModel } from '../../../../Models/DocumentDetailsModel';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-candidate-form-preview',
  standalone: false,
  templateUrl: './candidate-form-preview.component.html',
  styleUrl: './candidate-form-preview.component.css'
})
export class CandidateFormPreviewComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchReq = new Counselling_OptionFormDataModel();
  public request = new CounsellingApplicationPreviewDataModel();

  public documentDetails: Counselling_DocumentDetailsModel[] = []
  public DocumentList: Counselling_DocumentDetailsModel[] = []
  public filteredDocumentDetails: any = []

  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() formSubmitSuccess = new EventEmitter<boolean>();

  public CandidateID: number = 0;
  public IsShowIncompleteData: boolean = false;
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
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
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
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private counsellingApplicationFormService: CounsellingApplicationFormService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.CandidateID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"))
    
    let id = this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0";
    //this.ApplicationID = Number(this.encryptionService.decryptData(id))
    if (this.CandidateID > 0) {
      this.searchReq.CandidateID = this.CandidateID;
      this.request.CandidateID = this.CandidateID;
      await this.GetById();
      // await this.GetDateDataList();
    }
  }

  async GetById() {
    try {
      this.loaderService.requestStarted();
      await this.counsellingApplicationFormService.PreviewData_ByID_Counselling(this.searchReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data)); 
          debugger
          if(data.State === EnumStatus.Success) {
            this.request.CandidateID = data['Data']['CandidateID']
            if (data['Data'] != null) {
              this.request = data['Data']
              this.request.OptionViewData = data['Data']['OptionViewData']
              this.request.DocumentDetailList = data['Data']['DocumentDetailList']
              this.request.PendingDataModel = data['Data']['PendingDataModel']

              if (this.request?.DocumentDetailList) {
                this.documentDetails = this.request.DocumentDetailList;
            
                this.request.DocumentDetailList = this.request.DocumentDetailList.map((doc: any) => ({
                  ...doc,
                  DisplayColumnNameEn: doc.DisplayColumnNameEn.replace(/^Upload /i, '') // Remove "upload the "
                }));
                this.filteredDocumentDetails = this.documentDetails.filter((x) => x.GroupNo === 1);
              } else {
                this.documentDetails = [];
                this.filteredDocumentDetails = [];
              }
            }
          }
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
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
}
