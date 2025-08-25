import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { DataPagingListModel } from '../../../Models/DataPagingListModel';
import { GenerateAdmitCardSearchModel } from '../../../Models/GenerateAdmitCardDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { GetAdmitCardService } from '../../../Services/GenerateAdmitCard/generateAdmitCard.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { DownloadnRollNoModel } from '../../../Models/GenerateRollDataModels';
import { ITITimeTableService } from '../../../Services/ITI/ITITimeTable/ititime-table.service';
import { ITITimeTableSearchModel } from '../../../Models/ITI/ITITimeTableModels';
import { SweetAlert2 } from '../../../Common/SweetAlert2'

@Component({
  selector: 'app-iti-admitcard-and-roll-no-bulk-generate',
  standalone: false,
  templateUrl: './iti-admitcard-and-roll-no-bulk-generate.component.html',
  styleUrl: './iti-admitcard-and-roll-no-bulk-generate.component.css'
})
export class ITIAdmitcardAndRollNoBulkGenerateComponent {

  constructor(private loaderService: LoaderService, private getAdmitCardService: GetAdmitCardService, private activatedRoute: ActivatedRoute,
    private reportService: ReportService, private toastrService: ToastrService, private appsettingConfig: AppsettingService, private ITITimeTableService: ITITimeTableService,
    private swat: SweetAlert2,
    private http: HttpClient) { }
  sSOLoginDataModel = new SSOLoginDataModel();
  public ITITimeTableList: any = [];
  public SSOLoginDataModel = new SSOLoginDataModel()
  public GenerateAdmitCardsearchRequest = new GenerateAdmitCardSearchModel();
  public GenerateRollNosearchRequest = new DownloadnRollNoModel();
  public searchRequest = new ITITimeTableSearchModel();
  public Status: number = 0



  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetITITimeTableList()
  }

  async GenerateITIAdmitCard() {
    debugger
    if (this.Status != 14) {
      this.swat.Warning("Please Publish the Time Table first")
      return
    }
    try {
       //this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      this.loaderService.requestStarted();
      this.GenerateAdmitCardsearchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.GenerateAdmitCardsearchRequest.DepartmentID = 2
      this.GenerateRollNosearchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      await this.reportService.GetITIStudentAdmitCardBulk_CollegeWise(this.GenerateAdmitCardsearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.loaderService.requestEnded();
            const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + data.Data;
            try {
              window.open(fileUrl, '_blank');
             // setTimeout(function () { window.location.reload(); }, 200)
            }
            catch (ex) {
              console.log(ex)
              this.loaderService.requestEnded();
            }
          }
          else {
            this.toastrService.error(data.ErrorMessage)
            //    data.ErrorMessage
            this.loaderService.requestEnded();
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

  async GenerateITIRollNumberList() {
    ;
    try {
      this.loaderService.requestStarted();
      this.GenerateRollNosearchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.GenerateRollNosearchRequest.DepartmentID = 2
      this.GenerateRollNosearchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      await this.reportService.DownloadITIStudentRollNumberBulk_CollegeWise(this.GenerateRollNosearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.loaderService.requestEnded();
            const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + data.Data;
            try {
              window.open(fileUrl, '_blank');
              //setTimeout(function () { window.location.reload(); }, 200)
            }
            catch (ex) {
              console.log(ex)
              this.loaderService.requestEnded();
            }

          }
          else {
            this.toastrService.error(data.ErrorMessage)
            this.loaderService.requestEnded();
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



  async GetITITimeTableList() {

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng


    try {
      if (this.sSOLoginDataModel.RoleID == 7) {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      }
      this.loaderService.requestStarted();
      await this.ITITimeTableService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
         // this.ITITimeTableList = data['Data'];
          //this.SearchTimeTableList = [...data['Data']];
          this.Status = data['Data'][0]['Status']


          console.log("TimeTableList", this.ITITimeTableList)
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
