import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CertificateSearchModel } from '../../../../Models/CertificateDataModel';
import { DownloadCertificateService } from '../../../../Services/CertificateDownload/download-certificate.service';

@Component({
    selector: 'app-download-provisional-certificate',
    templateUrl: './download-provisional-certificate.component.html',
    styleUrls: ['./download-provisional-certificate.component.css'],
    standalone: false
})
export class DownloadProvisionalCertificateComponent implements OnInit {
  public searchRequest = new CertificateSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public InstituteMasterList: any = [];
  public ProvisionalTypeList: any = [];
  public ProvisionalCertificateList: any = [];


  constructor(private commonMasterService: CommonFunctionService, private downloadCertificateService: DownloadCertificateService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2) {

  }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    /*await this.GetMasterData();*/
    this.loadDropdownData('Institute');
    this.loadDropdownData('ProvisionalType');

  }

  async GetAllProvisionalCertificateData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();
      await this.downloadCertificateService.GetAllProvisionalCertificateData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ProvisionalCertificateList = data.Data;
        console.log(this.ProvisionalCertificateList)
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

  // get all data
  async ClearSearchData() {
    this.searchRequest = new CertificateSearchModel()
    this.ProvisionalCertificateList = []
  }

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'Institute':
          this.InstituteMasterList = data['Data'];
          console.log(this.InstituteMasterList, "InstituteMasterList")
          break;
        case 'ProvisionalType':
          this.ProvisionalTypeList = data['Data'];
          console.log(this.ProvisionalTypeList, "ProvisionalType")
          break;
        default:
          break;
      }
    });
  }


  //async DownloadCertificate() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.reportService.GetPrincipalIssueCertificate(this.request)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        console.log(data);
  //        if (data.State == EnumStatus.Success) {
  //          this.DownloadFile(data.Data, 'file download');
  //        }
  //        else {
  //          this.toastrService.error(data.ErrorMessage)
  //          //    data.ErrorMessage
  //        }
  //      }, (error: any) => console.error(error)
  //      );
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

  //DownloadFile(FileName: string, DownloadfileName: any): void {

  //  const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
  //  // Fetch the file as a blob
  //  this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
  //    const downloadLink = document.createElement('a');
  //    const url = window.URL.createObjectURL(blob);
  //    downloadLink.href = url;
  //    downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
  //    downloadLink.click();
  //    // Clean up the object URL
  //    window.URL.revokeObjectURL(url);
  //  });
  //}
  //generateFileName(extension: string): string {
  //  const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
  //  return `file_${timestamp}.${extension}`;
  //}
}

