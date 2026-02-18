import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CertificateLetterService } from '../../../../Services/CertificateLetter/certificate-letter.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { CertificateLetterDataModel, CertificateLetterSearchModel } from '../../../../Models/CertificateLetterDataModel';
import { ReportService } from '../../../../Services/Report/report.service';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-certificate-letter',
    templateUrl: './certificate-letter.component.html',
    styleUrls: ['./certificate-letter.component.css'],
    standalone: false
})
export class CertificateLetterComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new CertificateLetterDataModel()
  public searchRequest = new CertificateLetterSearchModel();
  public InstituteList: any = [];
  public ResultTypeList: any = [];
  public ReportlList: CertificateLetterSearchModel[] = [];

  constructor(
    private commonMasterService: CommonFunctionService,
    private certificateLetterService: CertificateLetterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private Swal2: SweetAlert2) {
  }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetInstituteListDDL();
    await this.GetExamTypeMasterDDL();
    this.DownloadData();


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

  //async GetExamTypeMasterDDL() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetCommonMasterData('ResultExamType')
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.ExamTypeList = data.Data;
  //        console.log(this.ExamTypeList)
  //      }, (error: any) => console.error(error))
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


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


  async DownloadData() {
    this.ReportlList = [];
    try {
      this.loaderService.requestStarted();
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
      //this.searchRequest.InstituteID = this.sSOLoginDataModel.Eng_NonEng
      //this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
      await this.reportService.GetReportsData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.DownloadFile(data.Data);
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


}
