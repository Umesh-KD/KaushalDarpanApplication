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
  public viewApplicationCount: any[] = [];

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
      const searchRequest: any = []
      this.loaderService.requestStarted();
      await this.ITIAdminDashboardServiceService.GetITIEstablishmentDashboard(searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DashboardDataList = data['Data'];
          this.viewApplicationCount = this.DashboardDataList.filter(s => s.ListType == 'ApplicationCount');
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
