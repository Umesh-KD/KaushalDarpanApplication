import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, Renderer2, ElementRef, inject, ViewChild  } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
import { Counselling_OptionFormDataModel, CounsellingApplicationPreviewDataModel, CounsellingApplicationSearchModel, InstituteListDataModel_Coun } from '../../../../Models/CounsellingApplicationFormDataModel';
import { CounsellingApplicationFormService } from '../../../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { Counselling_DocumentDetailsModel } from '../../../../Models/DocumentDetailsModel';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  public finalSubmitReq = new CounsellingApplicationSearchModel();
  public insOptionReq = new InstituteListDataModel_Coun();

  public documentDetails: Counselling_DocumentDetailsModel[] = []
  public DocumentList: Counselling_DocumentDetailsModel[] = []
  public filteredDocumentDetails: any = []
  public InstituteOptionList: any = []
public instituteDetails: InstituteListDataModel_Coun[] = []
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  _EnumRole = EnumRole;

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
  IsTermAndCondition: boolean = false;
  showFinalButton: boolean = true;

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  public currentDate = new Date();
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
 onCheckboxClick(event: Event) {
    console.log('Checkbox clicked!', this.IsTermAndCondition);
    
  }
  async GetById() {
    try {
      this.loaderService.requestStarted();
      await this.counsellingApplicationFormService.PreviewData_ByID_Counselling(this.searchReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data)); 
          
          if(data.State === EnumStatus.Success) {
            this.request.CandidateID = data['Data']['CandidateID']
            if (data['Data'] != null) {
              this.request = data['Data']
              this.request.OptionViewData = data['Data']['OptionViewData']
              this.request.DocumentDetailList = data['Data']['DocumentDetailList']
              this.request.PendingDataModel = data['Data']['PendingDataModel']
              this.request.InstituteDetailList = data['Data']['InstituteDetailList']
              console.log("this.request.InstituteDetailList"+this.request.InstituteDetailList);
              
              if(this.request.InstituteDetailList && this.request.InstituteDetailList.length > 0) {
                this.instituteDetails= this.request.InstituteDetailList;
              }
              if(this.request.PendingDataModel && this.request.PendingDataModel.length > 0) {
                this.IsShowIncompleteData = true;
              }

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

  async FinalSubmit() {
    if (this.request && this.request.PendingDataModel && this.request.PendingDataModel.length > 0) {
      this.toastr.error("Please submit all pending data.");
      return;
    }
    

    this.Swal2.Confirmation(`Are you sure you want to Submit Application? Once You Submit Application then you can't make any changes in Personal Details and Document Details.`,
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          this.loaderService.requestStarted();
          this.finalSubmitReq.CandidateId = this.CandidateID
          this.finalSubmitReq.ModifyBy = this.sSOLoginDataModel.UserID

          try {
            await this.counsellingApplicationFormService.ApplicationFinalSubmit_Counselling(this.finalSubmitReq)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State === EnumStatus.Success) {
                  this.toastr.success(data.Message);
                  await this.GetById();
                } else if (data.State === EnumStatus.Warning) {
                  this.toastr.warning(data.Message);
                } else {
                  this.toastr.error(data.ErrorMessage);
                }
              }, error => console.error(error));
          } catch (error) {
            console.error(error);
          }
        }
      });
    }

  async GetInstituteOptionList_Counselling(item: any) {
    try {
      this.insOptionReq.CandidateID = this.CandidateID
      this.insOptionReq.OptionID = item.OptionID
      await this.counsellingApplicationFormService.GetInstituteOptionList_Counselling(this.insOptionReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.InstituteOptionList = data.Data
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message)
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async ViewDetails(content: any, item: any) {
    
    await this.GetInstituteOptionList_Counselling(item)
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.insOptionReq = new InstituteListDataModel_Coun()
  }

  Changetab(index: number) {
    this.formSubmitSuccess.emit(true)
    this.tabChange.emit(index)
  } 

downloadPDF2() {
  const element = document.getElementById('PreviewPDF');

  if (!element) {
    this.toastr.error('Preview section not found!');
    return;
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10; // mm


  html2canvas(element, {
    scale: 3,         // Better clarity
    useCORS: true,
    allowTaint: true,
    logging: false
  }).then((canvas) => {

    const imgData = canvas.toDataURL('image/png');

    // Calculating A4 width scale
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Application_Preview.pdf`);
  });
}


async PreviewViewDetails(content: any) {
    //  await this.GetById();
    // await this.GetInstituteOptionList_Counselling(item)
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
  }

}
