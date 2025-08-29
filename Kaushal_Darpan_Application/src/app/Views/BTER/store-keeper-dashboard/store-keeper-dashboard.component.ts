import { Component } from '@angular/core';
import { StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ExaminerDashboardSearchModel } from '../../../Models/ExaminerCodeLoginModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ExaminerService } from '../../../Services/Examiner/examiner.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { RequestBaseModel } from '../../../Models/RequestBaseModel';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { EnumDepartment, EnumStatus, GlobalConstants, EnumRole, EnumEMProfileStatus } from '../../../Common/GlobalConstants';
@Component({
  selector: 'app-store-keeper-dashboard',
  standalone: false,
  templateUrl: './store-keeper-dashboard.component.html',
  styleUrl: './store-keeper-dashboard.component.css'
})
export class StoreKeeperDashboardComponent {
  public viewPlacementDashboardList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new StaffMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public StaffMasterList: any = [];
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public StoreKeeperRequest = new ExaminerDashboardSearchModel();
  public searchRequest1 = new StaffMasterSearchModel();
  public SecretaryJDDashboardList: any = []
  constructor(
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private examinerService: ExaminerService,
    private sweetAlert2: SweetAlert2,
    private staffMasterService: StaffMasterService,
  ) {

  }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();


    await this.CheckProfileStatus();
    if ((this.sSOLoginDataModel.RoleID == EnumRole.StoreKeeper)) {

      let status = this.StaffMasterList[0].ProfileStatus;
      if (status == this._EnumEMProfileStatus.Pending || status == this._EnumEMProfileStatus.Completed || status == this._EnumEMProfileStatus.Revert) {
        this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
          if (this.sSOLoginDataModel.DepartmentID == 1) {
            if (this.sSOLoginDataModel.EmTypeId == 2) {
              window.open("/additiprivatestaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self")
            }
            else if (this.sSOLoginDataModel.EmTypeId == 1) {
              debugger

              if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed) {
                window.open("/bter-em-add-staff-details", "_Self")
              }

            }

            else {
              window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self")
            }
          }


        }, 'OK', false);
      }

      else if (status == this._EnumEMProfileStatus.Completed || this._EnumEMProfileStatus.Revert) {
        if (this.sSOLoginDataModel.EmTypeId == 1) {

          if (this.sSOLoginDataModel.ProfileID == 0 || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert) {
            window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self")
          }

        }
      }



    }

  }
  async GetAllData() {
    debugger
    this.StoreKeeperRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.StoreKeeperRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.StoreKeeperRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.StoreKeeperRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.StoreKeeperRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.StoreKeeperRequest.UserID = this.sSOLoginDataModel.UserID;

    try {
      this.loaderService.requestStarted();
      await this.examinerService.StoreKeeperDashboard(this.StoreKeeperRequest)
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
  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest1.Action = '_checkProfileStatus'
      this.searchRequest1.SSOID = this.sSOLoginDataModel.SSOID;
      this.searchRequest1.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest1.CourseTypeId = this.sSOLoginDataModel.Eng_NonEng;

      await this.staffMasterService.GetAllData(this.searchRequest1)
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
