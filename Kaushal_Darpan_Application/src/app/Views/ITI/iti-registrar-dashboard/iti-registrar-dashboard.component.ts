import { Component } from '@angular/core';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
import { ITIDashboardService } from '../../../Services/ITI/ITI-Dashboard-Service/iti-dashboard.service';
@Component({
  selector: 'app-iti-registrar-dashboard',
  standalone: false,
  templateUrl: './iti-registrar-dashboard.component.html',
  styleUrl: './iti-registrar-dashboard.component.css'
})
export class ITIRegistrarDashboardComponent {
  public viewPlacementDashboardList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new StaffMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public StaffMasterList: any = [];
  public SecretaryJDDashboardList: any = []
  constructor(
    private loaderService: LoaderService,
    private dashService: ITIDashboardService
  ) {  }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();

  }
  async GetAllData() {

    let obj = {
      DepartmentID : this.sSOLoginDataModel.DepartmentID,
      EndTermID : this.sSOLoginDataModel.EndTermID,
      RoleID : this.sSOLoginDataModel.RoleID,
      Eng_NonEng : this.sSOLoginDataModel.Eng_NonEng,
    }
   
    try {


      this.loaderService.requestStarted();
      await this.dashService.GetRegistrarDashData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.viewPlacementDashboardList = data['Data'];
          console.log(this.viewPlacementDashboardList, 'ListData');
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
