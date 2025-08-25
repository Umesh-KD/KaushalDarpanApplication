import { Component } from '@angular/core';
import { SecretaryJDDashboardDataModel } from '../../Models/SecretaryJDDashboardDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { SecretaryJDDashboardService } from '../../Services/Secretary-JD-Dashboard/secretary-jd-dashboard.service';

@Component({
  selector: 'app-secretary-jd-dashboard',
  standalone: false,
  templateUrl: './secretary-jd-dashboard.component.html',
  styleUrl: './secretary-jd-dashboard.component.css'
})
export class SecretaryJDDashboardComponent {
  public searchRequest = new SecretaryJDDashboardDataModel()
  public sSOLoginDataModel = new SSOLoginDataModel()
  public SecretaryJDDashboardList: any = []

  constructor(
    private loaderService: LoaderService,
    private SecretaryJDDashboardService: SecretaryJDDashboardService,
  ) {}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetDashboardCount();
  }

  async GetDashboardCount() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.RoleId = this.sSOLoginDataModel.RoleID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    try {
      this.loaderService.requestStarted();
      await this.SecretaryJDDashboardService.GetDashboardCount(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SecretaryJDDashboardList = data['Data'];
          console.log(this.SecretaryJDDashboardList, 'ListData');
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
