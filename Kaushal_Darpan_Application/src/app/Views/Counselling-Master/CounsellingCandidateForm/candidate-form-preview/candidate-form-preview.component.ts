import { HttpClient } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
import { EncryptionService } from '../../../ITI/idffund-details/idffund-details.component';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { Counselling_OptionFormDataModel, CounsellingApplicationPreviewDataModel } from '../../../../Models/CounsellingApplicationFormDataModel';

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

  public CandidateID: number = 0
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
    private renderer: Renderer2
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CandidateID = 1   //this.sSOLoginDataModel.ApplicationID;
    
    let id = this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0";
    //this.ApplicationID = Number(this.encryptionService.decryptData(id))
    if (this.CandidateID > 0) {
      this.searchReq.CandidateID = this.CandidateID;
      this.request.CandidateID = this.CandidateID;
      // await this.GetById();
      // await this.GetDateDataList();
    }
  }
}
