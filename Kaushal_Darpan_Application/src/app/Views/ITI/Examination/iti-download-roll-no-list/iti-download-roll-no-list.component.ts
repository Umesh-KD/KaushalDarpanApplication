import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { DownloadnRollNoModel } from '../../../../Models/GenerateRollDataModels';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { GetAdmitCardService } from '../../../../Services/GenerateAdmitCard/generateAdmitCard.service';
import { GetRollService } from '../../../../Services/GenerateRoll/generate-roll.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { ITIGenerateDownloadRollNoListService } from '../../../../Services/ITI-Download-Generate-Roll-No/itigenerate-download-roll-no-list.service';

@Component({
  selector: 'app-iti-download-roll-no-list',
  standalone: false,
  
  templateUrl: './iti-download-roll-no-list.component.html',
  styleUrl: './iti-download-roll-no-list.component.css'
})


export class ITIDownloadRollNoListComponent implements OnInit {
  sSOLoginDataModel = new SSOLoginDataModel();
  searchRequest = new DownloadnRollNoModel();
  listDownloadnRollNoModel: DownloadnRollNoModel[] = [];
  //page load event

  SemesterName: string = '';

  constructor(private iTIGenerateDownloadRollNoListService: ITIGenerateDownloadRollNoListService, private loaderService: LoaderService, private getAdmitCardService: GetAdmitCardService, private activatedRoute: ActivatedRoute, private reportService: ReportService, private toastrService: ToastrService, private appsettingConfig: AppsettingService, private http: HttpClient) { }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.SemesterID = Number(this.activatedRoute.snapshot.queryParamMap.get('semid') ?? 0);
    this.searchRequest.InstituteID = Number(this.activatedRoute.snapshot.queryParamMap.get('instID') ?? 0);
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.GetSemesterName(this.searchRequest.SemesterID);
    this.GetAllData();
  }

  async GetAllData() {
    this.listDownloadnRollNoModel = []
    try {
      this.loaderService.requestStarted();
      await this.iTIGenerateDownloadRollNoListService.GetGenerateRollDataForPrint(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.listDownloadnRollNoModel = data['Data'];
            console.log(this.listDownloadnRollNoModel, "PaginData")
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
  async downloadData(request: DownloadnRollNoModel[]) {
    try {
      this.loaderService.requestStarted();
      await this.reportService.DownloadITIStudentRollNumber(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "Data");
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
        this.SemesterName = "1st Year";
        break;
      case (2):
        this.SemesterName = "2nd Year";
        break;
      case (3):
        this.SemesterName = "Third Semester";
        break;
      case (4):
        this.SemesterName = "Fourth Semester ";
        break;
      case (5):
        this.SemesterName = "Fifth Semester";
        break;
      case (6):
        this.SemesterName = "Sixth Semester";
        break;
      case (7):
        this.SemesterName = "Sixth Semester Special ";
        break;
      default:

    }

    return this.SemesterName;
  }

}
