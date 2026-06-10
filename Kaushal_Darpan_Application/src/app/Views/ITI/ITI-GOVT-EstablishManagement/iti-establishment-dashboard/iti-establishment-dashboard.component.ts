import { Component } from '@angular/core';
import { EnumRole } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ITIAdminDashboardServiceService } from '../../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { ITIPrincipalDashboardServiceService } from '../../../../Services/ITI-Principal-Dashboard-Service/iti-principal-dashboard-service.service';

@Component({
  selector: 'app-iti-establishment-dashboard',
  standalone: false,
  templateUrl: './iti-establishment-dashboard.component.html',
  styleUrl: './iti-establishment-dashboard.component.css'
})
export class ITIEstablishmentDashboardComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;
  public DashboardDataList: any[] = [];
  public EstablishmentDashboardTiles: any[] = [];
  public RelievingJoiningDashboardTiles: any[] = [];

  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private ITIAdminDashboardServiceService: ITIPrincipalDashboardServiceService,
  ){}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetAllData()
  }

  async GetAllData()  {
    try {
      const searchRequest: any = {};
      this.loaderService.requestStarted();
      searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      searchRequest.USerID = this.sSOLoginDataModel.UserID;

      await this.ITIAdminDashboardServiceService.GetITIEstablishmentDashboard(searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DashboardDataList = data['Data'];
          this.EstablishmentDashboardTiles = this.DashboardDataList.filter(s => s.ListType == 'Establishment');
          this.RelievingJoiningDashboardTiles = this.DashboardDataList.filter(s => s.ListType == 'RelievingJoining');
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
