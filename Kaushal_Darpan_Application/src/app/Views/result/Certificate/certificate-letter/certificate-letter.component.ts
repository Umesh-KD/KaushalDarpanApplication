import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CertificateLetterService } from '../../../../Services/CertificateLetter/certificate-letter.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { CertificateLetterDataModel, CertificateLetterSearchModel } from '../../../../Models/CertificateLetterDataModel';
import { ReportService } from '../../../../Services/Report/report.service';
import { EnumResultType, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { HttpClient } from '@angular/common/http';
import { CommonFunctionHelper } from '../../../../Common/commonFunctionHelper';
import { DownloadCertificateService } from '../../../../Services/CertificateDownload/download-certificate.service';
import { CertificateSearchModel } from '../../../../Models/CertificateDataModel';


@Component({
    selector: 'app-certificate-letter',
    templateUrl: './certificate-letter.component.html',
    styleUrls: ['./certificate-letter.component.css'],
    standalone: false
})
export class CertificateLetterComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new CertificateLetterDataModel()
  public searchRequest = new CertificateLetterSearchModel();
  public diplomaSearchReq = new CertificateSearchModel();
  
  public _EnumResultType = EnumResultType;

  public InstituteList: any = [];
  public ResultTypeList: any = [];
  public ReportlList: CertificateLetterSearchModel[] = [];
  public endTermFinYear: any = [];
  public Message: any = [];
  public ErrorMessage: any = [];

  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public pageType: string = '';

  constructor(
    private commonMasterService: CommonFunctionService,
    private certificateLetterService: CertificateLetterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private Swal2: SweetAlert2,
    public commonFunctionHelper: CommonFunctionHelper,
    public activatedRoute: ActivatedRoute,
    private downloadCertificateService :DownloadCertificateService,
    private router: Router,
  ) { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    debugger;
    const currentUrl = this.router.url.split('?')[0].split('#')[0];
    if (currentUrl.endsWith('/CertificateLetter')) {
      this.pageType = 'certificate_letter';
    } else if (currentUrl.endsWith('/diploma-forwarding-letter')) {
      this.pageType = 'diploma_forwarding_letter';
    }

    await this.GetInstituteListDDL();
    await this.GetExamTypeMasterDDL();
  }

  async GetInstituteListDDL() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = 1;
      await this.commonMasterService.InstituteMaster(this.searchRequest.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteList = data.Data;
          console.log(this.InstituteList)
        }, (error: any) => console.error(error))
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

  async GetExamTypeMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamResultType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ResultTypeList = data.Data;
          console.log(this.ResultTypeList)
        }, (error: any) => console.error(error))
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

  //----------------------------------------------- Certificate Letter Start-------------------------------------------------------->
  
  async DownloadData() {
    this.ReportlList = [];

    if ((this.searchRequest.InstituteID ?? 0) <= 0) {
      this.toastr.error("Please select Institute!");
      return;
    }

    if ((this.searchRequest.ExamTypeID ?? 0) <= 0) {
      this.toastr.error("Please select Result Type!");
      return;
    }

    if (
      ((this.searchRequest.ExamTypeID ?? 0) == EnumResultType.RwhResult || 
      (this.searchRequest.ExamTypeID ?? 0) == EnumResultType.RwhRevalEffected) && 
      (this.searchRequest.EffectiveFromEndTermId ?? 0) <= 0
    ) {
      this.toastr.error("Please select Effective From!");
      return;
    }

    try {
      this.loaderService.requestStarted();
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng

      await this.reportService.GetCertificateLetterReport_html(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
            this.commonFunctionHelper.downloadBase64OfPdf(data.Data, `certificate_letter_${timestamp}.pdf`);
          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning(data.Message);
          }
          else {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  DownloadFile(FileName: string): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  async GetEffectiveFinYear() {
    this.searchRequest.EffectiveFromEndTermId = 0;
    this.endTermFinYear = [];
    if (this.searchRequest.ExamTypeID == this._EnumResultType.RwhResult || this.searchRequest.ExamTypeID == this._EnumResultType.RwhRevalEffected) {
      try {
        await this.commonMasterService.GetEffectiveFinYear()
          .then((data: any) => {
            this.endTermFinYear = data['Data'] || [];
          }, (error: any) => console.error(error));
      }
      catch (Ex) {
        console.error(Ex);
      }
    }
  }

  //----------------------------------------------- Certificate Letter END-------------------------------------------------------->

  //----------------------------------------------- Diploma Forwarding Letter Start -------------------------------------------------------->

  async DownloadDiplomaForwardingLetter() {

    try {
      this.loaderService.requestStarted();
      this.diplomaSearchReq.EndTermID = this.sSOLoginDataModel.EndTermID
      this.diplomaSearchReq.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.diplomaSearchReq.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng

      await this.downloadCertificateService.DownloadDiplomaForwardingLetter(this.diplomaSearchReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
            this.commonFunctionHelper.downloadBase64OfPdf(data.Data, `diploma_forwarding_letter_${timestamp}.pdf`);
          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning(data.Message);
          }
          else {
            this.toastr.error(data.Message);
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    }
  }

  
  //----------------------------------------------- Diploma Forwarding Letter END -------------------------------------------------------->
}
