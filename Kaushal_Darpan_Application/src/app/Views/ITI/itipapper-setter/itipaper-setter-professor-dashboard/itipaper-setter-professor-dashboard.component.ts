import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITIPapperSetterService } from '../../../../Services/ITI/ITIPapperSetter/itipapper-setter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumEMProfileStatus } from '../../../../Common/GlobalConstants';

@Component({
  selector: 'app-itipaper-setter-professor-dashboard',
  standalone: false,
  templateUrl: './itipaper-setter-professor-dashboard.component.html',
  styleUrl: './itipaper-setter-professor-dashboard.component.css'
})
export class ITIPaperSetterProfessorDashboardComponent {
  public sSOLoginDataModel = new SSOLoginDataModel()
  public ProfessorDashboardCountList: any = []
  public _EnumEMProfileStatus = EnumEMProfileStatus;

  constructor(
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private PapperSetterService: ITIPapperSetterService,
    private appsettingConfig: AppsettingService,
    private routers: Router,

  ) { }

  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllData(this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.SSOID);
    if (this.sSOLoginDataModel.EmTypeId == 1) {
      if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed) {
        window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self")
      }
    }

    /*_EnumRole.ITIProfessor_SCVT*/

  }

  async GetAllData(userid: number, EndTermID: number, RoleID: number, SSOID : string) {
    try {
      this.loaderService.requestStarted();
      await this.PapperSetterService.ProfessorDashboardCount(userid, EndTermID, RoleID, SSOID,"").then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
        this.ProfessorDashboardCountList = data['Data'];
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
