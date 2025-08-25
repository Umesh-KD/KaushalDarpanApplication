import { Component, OnInit } from '@angular/core';
import { PrincipalIssueCertificateModel } from '../../../Models/PrincipalIssueCertificateModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { AddStaffBasicDetailDataModel, StaffDetailsDataModel, StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';


@Component({
    selector: 'app-issue-certificate',
    templateUrl: './issue-certificate.component.html',
    styleUrls: ['./issue-certificate.component.css'],
    standalone: false
})
export class IssueCertificateComponent implements OnInit {

  request = new PrincipalIssueCertificateModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new StaffMasterSearchModel();
  public StaffMasterList: any = [];

  public TotalStaff: number = 0;
  public IsDownload: boolean = false;
  public IsApproved: boolean = false;
  staffDetailsFormData = new StaffDetailsDataModel();
  
  constructor(private reportService: ReportService, private loaderService: LoaderService, private toastrService: ToastrService, private Staffservice: StaffMasterService, private appsettingConfig: AppsettingService, private http: HttpClient) { }
  //Page Load
  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // sir details
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.request.Name = this.sSOLoginDataModel.DisplayName;
    this.request.Designation = this.sSOLoginDataModel.Designation;
    this.request.InstituteName = this.sSOLoginDataModel.InstituteName;

     this.GetAllData()

  }

  async DownloadCertificate() {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetPrincipalIssueCertificate(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastrService.error(data.ErrorMessage)
            //    data.ErrorMessage
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

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }


  async GetAllData() {
    
    

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      await this.Staffservice.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];
          this.TotalStaff = this.StaffMasterList.length;

          if (this.StaffMasterList.every((item: any) => item?.ABC === 'Approved')) {
            this.IsApproved = true;
            if (this.StaffMasterList.some((item: any) => item?.IsDownloadCertificate === true)) {
              this.IsDownload = true;
              this.IsApproved = false;
            } else {
              this.IsDownload = false;
              this.IsApproved = true;
            }


          } else {
            this.IsApproved = false;

            if (this.StaffMasterList.some((item: any) => item?.IsDownloadCertificate === true)) {
              this.IsDownload = true;
              this.IsApproved = false;
            } else {
              this.IsDownload = false;
              this.IsApproved = true;
            }

          }

          
          
          
          
          console.log(this.StaffMasterList)
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

  async Submit() {
    try {
      this.IsDownload = true;
      this.IsApproved = false;

      const StaffIDs = this.StaffMasterList.map((item: any) => item.StaffID).join(',');
      this.staffDetailsFormData.StaffIDs = StaffIDs;

      await this.Staffservice.IsDownloadCertificate(this.staffDetailsFormData).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        if (data.State === EnumStatus.Success) {
        }


      })

      
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
}
