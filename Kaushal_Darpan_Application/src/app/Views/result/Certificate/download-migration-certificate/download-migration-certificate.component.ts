import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumExamTypeIDChangeAction, EnumRole } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CertificateDataModel, CertificateSearchModel } from '../../../../Models/CertificateDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { DownloadCertificateService } from '../../../../Services/CertificateDownload/download-certificate.service';

@Component({
    selector: 'app-download-migration-certificate',
    templateUrl: './download-migration-certificate.component.html',
    styleUrls: ['./download-migration-certificate.component.css'],
    standalone: false
})
export class DownloadMigrationCertificateComponent implements OnInit {
  public searchRequest = new CertificateSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  /*public request = new MigrationCertificateDataModel;*/
  public ExamTypeList: any = [];
  public InstituteMasterList: any = [];
  public EndTermList: any = [];
  public MigrationTypeList: any = [];
  public MigrationCertificateList: any = [];


  constructor(private commonMasterService: CommonFunctionService, private downloadCertificateService: DownloadCertificateService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2) {

  }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    /*await this.GetMasterData();*/
    this.loadDropdownData('ResultExamType');
    this.loadDropdownData('Institute');
    this.loadDropdownData('EndTerm');
    this.loadDropdownData('MigrationType');

  }

  async GetAllMigrationCertificateData() {
    try {
      
      console.log(this.searchRequest.ExamTypeID,"detass")
      if (this.searchRequest.ExamTypeID == 78) { this.searchRequest.ExamTypeID = EnumExamTypeIDChangeAction.MainExam }
      else if (this.searchRequest.ExamTypeID == 127) { this.searchRequest.ExamTypeID = EnumExamTypeIDChangeAction.RevalExam }
      else if (this.searchRequest.ExamTypeID == 128) { this.searchRequest.ExamTypeID = EnumExamTypeIDChangeAction.UFMExam }
      else if (this.searchRequest.ExamTypeID == 129) { this.searchRequest.ExamTypeID = EnumExamTypeIDChangeAction.RWHExam }
      else if (this.searchRequest.ExamTypeID == 77) { this.searchRequest.ExamTypeID = EnumExamTypeIDChangeAction.Special }
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      
      this.loaderService.requestStarted();
      await this.downloadCertificateService.GetAllMigrationCertificateData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.MigrationCertificateList = data.Data;
        console.log(this.MigrationCertificateList)
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
    this.MigrationCertificateList =[]
  }

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'Institute':
          this.InstituteMasterList = data['Data'];
          console.log(this.InstituteMasterList,"InstituteMasterList")
          break;
        case 'EndTerm':
          this.EndTermList = data['Data'].filter((x: any) => x.ID == this.sSOLoginDataModel.EndTermID);
          console.log(this.EndTermList, "EndTermList")
          break;
        case 'ResultExamType':
          this.ExamTypeList = data['Data'];
          console.log(this.ExamTypeList, "ExamTypeList")
          break;
        case 'MigrationType':
          this.MigrationTypeList = data['Data'];
          console.log(this.MigrationTypeList, "MigrationType")
          break;
        default:
          break;
      }
    });
  }


  //getExamTypeID(Name: string): number {
  //  switch (Name) {
  //    case 'Main Exam':
  //      return 0;  
  //    case 'Reval Exam':
  //      return 1; 
  //    case 'UFM Exam':
  //      return 1;  
  //    case 'RWH Exam':
  //      return 1;
  //    default:
  //    return 0;

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
