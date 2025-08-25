import { Component } from '@angular/core';
import { SecretaryJDDashboardDataModel } from '../../../Models/SecretaryJDDashboardDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITIDashboardService } from '../../../Services/ITI/ITI-Dashboard-Service/iti-dashboard.service';

@Component({
  selector: 'app-iti-secretary-jd-dashboard',
  standalone: false,
  templateUrl: './iti-secretary-jd-dashboard.component.html',
  styleUrl: './iti-secretary-jd-dashboard.component.css'
})
export class ITISecretaryJDDashboardComponent {
  public sSOLoginDataModel = new SSOLoginDataModel()
  public SecretaryJDDashboardList: any = []

  constructor(
    private loaderService: LoaderService,
    private dashService: ITIDashboardService,
  ) {}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetDashboardCount();
  }

  async GetDashboardCount() {
    let obj = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      RoleID: this.sSOLoginDataModel.RoleID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
    }
    try {
      this.loaderService.requestStarted();
      await this.dashService.GetSecretaryJDDashData(obj)
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
