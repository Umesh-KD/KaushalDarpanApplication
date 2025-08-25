import { Component, OnInit } from '@angular/core';
import { SSOLandingDataDataModel, SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { DataPagingListModel } from '../../Models/DataPagingListModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { GenerateAdmitCardSearchModel } from '../../Models/GenerateAdmitCardDataModel';
import { GetAdmitCardService } from '../../Services/GenerateAdmitCard/generateAdmitCard.service';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';
import { ReportService } from '../../Services/Report/report.service';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-generate-admit-card-bulk',
  templateUrl: './generate-admit-card-bulk.component.html',
  styleUrls: ['./generate-admit-card-bulk.component.css'],
  standalone: false
})
export class GenerateAdmitCardBulkComponent implements OnInit {

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
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
    this.GetSemesterName(this.searchRequest.SemesterID);
    this.GetAllData();
  }

  async GetAllData() {
    this.listDataPaging = []
    try {
      this.loaderService.requestStarted();

      await this.getAdmitCardService.GetGenerateAdmitCardDataBulk(this.searchRequest)
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
      row.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      await this.reportService.GetStudentAdmitCardBulk(row)
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

  DownloadFile(FileName: string, DownloadfileName: any): void
  {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName; // Replace with your URL
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.target = '_blank';
   // downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
    downloadLink.click();

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



