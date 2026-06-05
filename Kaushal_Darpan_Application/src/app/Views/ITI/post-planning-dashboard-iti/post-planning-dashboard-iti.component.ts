import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITIAdminDashboardServiceService } from '../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { PostPlanningDashboardSearchModel } from '../../../Models/ITIAdminDashboardDataModel';

@Component({
  selector: 'app-post-planning-dashboard-iti',
  standalone: false,
  templateUrl: './post-planning-dashboard-iti.component.html',
  styleUrl: './post-planning-dashboard-iti.component.css'
})
export class PostPlanningDashboardITIComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();

  public PostPlanningDashboardTableList: any[] = [];
  public PostPlanningDashboardTiles: any[] = [];
  public PostPlanningTilesList: any[] = [];
  public EstablishmentTilesList: any[] = [];

  constructor(
    private loaderService: LoaderService,
    private adminDashboardService: ITIAdminDashboardServiceService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetPostPlanningDashboardTilesData();
    await this.GetPostPlanningDashboardTableData();
  }

  async GetPostPlanningDashboardTableData() {
    try {
      const searchRequest = new PostPlanningDashboardSearchModel();
      this.loaderService.requestStarted();
      searchRequest.UserID = this.sSOLoginDataModel.UserID;
      searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      searchRequest.OfficeID = this.sSOLoginDataModel.OfficeID;
      searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;

      await this.adminDashboardService.GetPostPlanningDashboardTableData(searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostPlanningDashboardTableList = data['Data'];
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
  async GetPostPlanningDashboardTilesData() {
    try {
      const searchRequest = new PostPlanningDashboardSearchModel();
      this.loaderService.requestStarted();
      searchRequest.UserID = this.sSOLoginDataModel.UserID;
      searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;

      await this.adminDashboardService.GetPostPlanningDashboardTilesData(searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostPlanningDashboardTiles = data['Data'];
          this.PostPlanningTilesList = this.PostPlanningDashboardTiles.filter((x: any) => x.ListType == "PostPlanning")
          this.EstablishmentTilesList = this.PostPlanningDashboardTiles.filter((x: any) => x.ListType == "Establishment")
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
}
