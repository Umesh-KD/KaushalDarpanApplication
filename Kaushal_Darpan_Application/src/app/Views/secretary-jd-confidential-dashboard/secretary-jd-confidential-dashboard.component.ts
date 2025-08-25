import { Component } from '@angular/core';
import { JDConfidentialDashboardDataModel } from '../../Models/SecretaryJDDashboardDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { SecretaryJDDashboardService } from '../../Services/Secretary-JD-Dashboard/secretary-jd-dashboard.service';
import { StaffMasterSearchModel } from '../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../Services/StaffMaster/staff-master.service';
import { EnumEMProfileStatus, EnumRole } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';

@Component({
  selector: 'app-secretary-jd-confidential-dashboard',
  standalone: false,
  templateUrl: './secretary-jd-confidential-dashboard.component.html',
  styleUrl: './secretary-jd-confidential-dashboard.component.css'
})
export class SecretaryJdConfidentialDashboardComponent {
  public searchRequest = new JDConfidentialDashboardDataModel()
  public sSOLoginDataModel = new SSOLoginDataModel()
  public staffSearchRequest = new StaffMasterSearchModel();
  public DashboardCountList: any = []
  public StaffMasterList: any = []

  constructor(
    private loaderService: LoaderService,
    private SecretaryJDDashboardService: SecretaryJDDashboardService,
    private staffMasterService: StaffMasterService,
    private sweetAlert2: SweetAlert2,
  ) {}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetDashboardCount();

    if(this.sSOLoginDataModel.RoleID == EnumRole.JDConfidential_Eng || this.sSOLoginDataModel.RoleID == EnumRole.JDConfidential_NonEng) {
      await this.CheckProfileStatus();
      if (this.StaffMasterList.length > 0) {
        let status = this.StaffMasterList[0].ProfileStatus;
        if (status == EnumEMProfileStatus.Pending) {
          
          this.sweetAlert2.Confirmation("Your Profile Is not completed please Complete your profile?", async (result: any) => {
              window.open("/bter-em-add-staff-details", "_Self")
              }, 'OK', false);
        }
      }
    }
  }

  async GetDashboardCount() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.RoleId = this.sSOLoginDataModel.RoleID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    try {
      this.loaderService.requestStarted();
      await this.SecretaryJDDashboardService.GetJDConfidentialDashboardCount(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DashboardCountList = data['Data'];
          console.log(this.DashboardCountList, 'ListData');
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

  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      this.staffSearchRequest.Action = '_checkProfileStatus'
      this.staffSearchRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.staffSearchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.staffSearchRequest.CourseTypeId = this.sSOLoginDataModel.Eng_NonEng;

      await this.staffMasterService.GetAllData(this.staffSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];
          console.log("CheckProfileStatus", this.StaffMasterList)
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
