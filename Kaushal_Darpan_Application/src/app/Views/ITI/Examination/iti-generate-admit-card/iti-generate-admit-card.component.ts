import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { DataPagingListModel } from '../../../../Models/DataPagingListModel';
import { GenerateAdmitCardSearchModel } from '../../../../Models/GenerateAdmitCardDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { GetAdmitCardService } from '../../../../Services/GenerateAdmitCard/generateAdmitCard.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ReportService } from '../../../../Services/Report/report.service';

@Component({
  selector: 'app-iti-generate-admit-card',
  standalone: false,
  
  templateUrl: './iti-generate-admit-card.component.html',
  styleUrl: './iti-generate-admit-card.component.css'
})

export class ITIGenerateAdmitCardComponent implements OnInit {

  sSOLoginDataModel = new SSOLoginDataModel();
  public listDataPaging: DataPagingListModel[] = []
  public searchRequest = new GenerateAdmitCardSearchModel();

  public SemesterName: string = '';
  constructor(private loaderService: LoaderService, private getAdmitCardService: GetAdmitCardService, private activatedRoute: ActivatedRoute, private reportService: ReportService, private toastrService: ToastrService, private appsettingConfig: AppsettingService, private http: HttpClient) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.SemesterID = Number(this.activatedRoute.snapshot.queryParamMap.get('semid') ?? 0);
    this.searchRequest.InstituteID = Number(this.activatedRoute.snapshot.queryParamMap.get('instID') ?? 0);
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.GetSemesterName(this.searchRequest.SemesterID);
    this.GetAllData();
  }

  async GetAllData() {
    this.listDataPaging = []
    try {
      this.loaderService.requestStarted();

      await this.getAdmitCardService.ITIGetGenerateAdmitCardDataBulk(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.listDataPaging = data['Data'];
            console.log(this.listDataPaging, "PaginData")
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



  async DownloadAdmitCard(row: DataPagingListModel) {
    ;
    try {
      this.loaderService.requestStarted();
      row.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.reportService.GetITIStudentAdmitCardBulk(row)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
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
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
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


  public GetSemesterName(semesterId: number): string {
    switch (semesterId) {
      case (1):
        this.SemesterName = "First Semester Admit Card";
        break;
      case (2):
        this.SemesterName = "Second Semester Admit Card";
        break;
      case (3):
        this.SemesterName = "Third Semester Admit Card";
        break;
      case (4):
        this.SemesterName = "Fourth Semester Admit Card";
        break;
      case (5):
        this.SemesterName = "Fifth Semester Admit Card";
        break;
      case (6):
        this.SemesterName = "Sixth Semester Admit Card";
        break;
      case (7):
        this.SemesterName = "Sixth Semester Special Admit Card";
        break;

      default:

    }

    return this.SemesterName;
  }
}
