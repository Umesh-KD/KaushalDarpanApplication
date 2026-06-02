import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { StaffDashService } from '../../Services/StaffDashboard/staff-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffDashboardSearchModel } from '../../Models/StaffDashboardDataModel';
import { CollegeMasterService } from '../../Services/CollegeMaster/college-master.service';
import { EnumEMProfileStatus, EnumRole } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { StaffMasterSearchModel } from '../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../Services/StaffMaster/staff-master.service';
import { AdminDashboardSearchModel, EM_JDTEDashboardSearchModel } from '../../Models/AdminDashboardDataModel';
import { AdminDashboardDataService } from '../../Services/AdminDashboard/admin-dashboard-data.service';

@Component({
  selector: 'app-jdte-dashboard',
  templateUrl: './jdte-dashboard.component.html',
  styleUrls: ['./jdte-dashboard.component.css'],
  standalone: false
})
export class JDTEDashboardComponent {
  public viewPlacementDashboardList: any = [];
  public InventoryList: any = [];
  public Table_SearchText: string = "";
  public viewAdminDashboardList: any[] = [];
  public viewJDTEStaffDetailList: any[] = [];
  public viewJDTEReleiving: any[] = [];
  public viewAdminDashboardListOther: any[] = [];
  public viewAdminDashboardListLeave: any[] = [];
  public viewAdminDashboardAllotment: any[] = [];
  public StaffMasterList: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  // public searchRequest = new StaffDashboardSearchModel();
  public searchRequest = new EM_JDTEDashboardSearchModel();
  
  public staffSearchRequest = new StaffMasterSearchModel();

  isProfileComplete: boolean = false;
  constructor(
    private StaffDashService: StaffDashService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private collegeMasterService: CollegeMasterService,
    private sweetAlert2: SweetAlert2,
    private staffMasterService: StaffMasterService,
    private router: Router,
    private AdminDashDataService: AdminDashboardDataService,
  ) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // await this.CheckProfileStatus();
    if ((this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE || EnumRole.EM_JDTE)) {
      await this.CheckProfileStatus_SELF();

      if (this.StaffMasterList.length > 0) {
        let status = this.StaffMasterList[0].ProfileStatus;
        if (status == EnumEMProfileStatus.Pending || status == EnumEMProfileStatus.Completed || status == EnumEMProfileStatus.Revert || status==EnumEMProfileStatus.LockAndSubmit) {
          if(status == EnumEMProfileStatus.Revert)
          {
            this.sweetAlert2.Confirmation("Your Profile Reverted please Complete your profile Again?", async (result: any) => {
              this.router.navigateByUrl('/bter-em-add-staff-details');
            }, 'OK', false);
          }
          if(status == EnumEMProfileStatus.LockAndSubmit)
            {
              this.sweetAlert2.Confirmation("Your Profile is not appoved yet ?", async (result: any) => {
              }, 'OK', false);
            }
          else
          {
            this.sweetAlert2.Confirmation("Your Profile Is not completed please Complete your profile?", async (result: any) => {
              this.router.navigateByUrl('/bter-em-add-staff-details');
            }, 'OK', false);
          }
        }

      }
      await this.GetAllData();
    }

  }

  // async CheckProfileStatus() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.collegeMasterService.GetInstituteProfileStatus(this.sSOLoginDataModel.InstituteID)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         console.log(data);
  //         this.isProfileComplete = data['Data'][0]['IsProfileComplete'];
  //       }, (error: any) => console.error(error)
  //       );
  //   }
  //   catch (ex) {
  //     console.log(ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }
  async GetAllData() {
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.UserID=this.sSOLoginDataModel.UserID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    if (this.sSOLoginDataModel.RoleID == 2 || this.sSOLoginDataModel.RoleID == 12) {
      this.searchRequest.CommonID = 89;
    }
    else if (this.sSOLoginDataModel.RoleID == 17 || this.sSOLoginDataModel.RoleID == 18) {
      this.searchRequest.CommonID = 88;
    }
    else if (this.sSOLoginDataModel.RoleID == 7 || this.sSOLoginDataModel.RoleID == 13) {
      this.searchRequest.CommonID = 87;
    }
    // else if (this.sSOLoginDataModel.RoleID == 239) {
    //   this.searchRequest.CommonID = 90;
    // }
    else {
      this.searchRequest.CommonID = 0;
    }

    try {

      this.loaderService.requestStarted();
      await this.AdminDashDataService.GetEM_JDTEDashData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.viewAdminDashboardList = data['Data'];
          this.viewJDTEStaffDetailList = this.viewAdminDashboardList.filter(s => s.ListType === 'StaffDetail');
          this.viewJDTEReleiving = this.viewAdminDashboardList.filter(s => s.ListType === 'Transfer');
          this.viewAdminDashboardListOther = this.viewAdminDashboardList.filter(s => s.ListType === 'OtherType');
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

  async CheckProfileStatus_SELF() {
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
