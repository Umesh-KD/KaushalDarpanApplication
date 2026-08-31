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
import { MenuFreezeService } from '../../Services/menu-freeze/menu-freeze.service';
import { AdminDashboardDataService } from '../../Services/AdminDashboard/admin-dashboard-data.service';
import { EM_JDTEDashboardSearchModel } from '../../Models/AdminDashboardDataModel';

@Component({
  selector: 'app-principle-dashboard',
  templateUrl: './principle-dashboard.component.html',
  styleUrls: ['./principle-dashboard.component.css'],
  standalone: false
})
export class PrincipleDashboardComponent {
  public viewPlacementDashboardList: any = [];
  public InventoryList: any = [];
  public Table_SearchText: string = "";
  public viewAdminDashboardList: any[] = [];
  public viewJDTEStaffDetailList: any[] = [];
  public viewJDTEReleiving: any[] = [];
  public viewAdminDashboardListEnrollment: any[] = [];
  public viewAdminDashboardListExamination: any[] = [];
  public viewAdminDashboardListOther: any[] = [];
  public viewAdminDashboardListLeave: any[] = [];
  public viewAdminDashboardAllotment: any[] = [];
  public StaffMasterList: any[] = [];
  public RevaluationTilesList: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public searchRequest = new StaffDashboardSearchModel();
  public search=new EM_JDTEDashboardSearchModel();
  public staffSearchRequest = new StaffMasterSearchModel();

  isProfileComplete: boolean = false;
  constructor(
    private StaffDashService: StaffDashService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private collegeMasterService: CollegeMasterService,
    private sweetAlert2: SweetAlert2,
    private staffMasterService: StaffMasterService,
    private menuFreeze: MenuFreezeService,
    private router: Router,
    private AdminDashDataService: AdminDashboardDataService,
  ) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.CheckProfileStatus();
debugger
    if ((this.sSOLoginDataModel.RoleID == EnumRole.Principal || EnumRole.PrincipalNon)) {
      await this.CheckProfileStatus_SELF();

      if (this.StaffMasterList.length > 0) {
        debugger
        let status = this.StaffMasterList[0].ProfileStatus;
        if (status == EnumEMProfileStatus.Pending || status == EnumEMProfileStatus.Completed || status == EnumEMProfileStatus.Revert) {
          this.menuFreeze.freezeMenus();
          if(status == EnumEMProfileStatus.Revert)
          {
            this.sweetAlert2.Confirmation("Your Profile Reverted please Complete your profile Again?", async (result: any) => {
              // window.open("/bter-em-add-staff-details", "_Self")
              this.router.navigateByUrl('/bter-em-add-staff-details');
            }, 'OK', false);
          }
          else
          {
            this.sweetAlert2.Confirmation("Your Profile Is not completed please Complete your profile?", async (result: any) => {
              // window.open("/bter-em-add-staff-details", "_Self")
              this.router.navigateByUrl('/bter-em-add-staff-details');
            }, 'OK', false);
          }

        }
        else {
          
          await this.CheckProfileStatus();
          if (this.isProfileComplete == false) {
            this.sweetAlert2.Confirmation("College Profile Is not completed please Complete college profile?", async (result: any) => {
              window.open("/updatecollegemaster/" + this.sSOLoginDataModel.InstituteID, "_Self")
            }, 'OK', false);

          }
        }
      }
      await this.GetAllData();
      await this.GetEMAllData();
    }

  }

  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      await this.collegeMasterService.GetInstituteProfileStatus(this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.isProfileComplete = data['Data'][0]['IsProfileComplete'];
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
  async GetAllData() {
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID


    console.log(this.searchRequest)

    try {

      this.loaderService.requestStarted();
      await this.StaffDashService.GetPrincipleDash(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.viewPlacementDashboardList = data['Data'];

          console.log(this.viewPlacementDashboardList);

          // Filter based on ListType 'EnrollmentType'
          this.viewAdminDashboardListEnrollment = this.viewPlacementDashboardList.filter((s: { ListType: string; }) => s.ListType === 'EnrollmentType');
          // Filter based on ListType 'ExaminationType'
          this.viewAdminDashboardListExamination = this.viewPlacementDashboardList.filter((s: { ListType: string; }) => s.ListType === 'ExaminationType');
          // Filter based on ListType 'OtherType'
          this.viewAdminDashboardListOther = this.viewPlacementDashboardList.filter((s: { ListType: string; }) => s.ListType === 'OtherType');
          this.viewAdminDashboardListLeave = this.viewPlacementDashboardList.filter((s: { ListType: string; }) => s.ListType === 'Leave');
          this.viewAdminDashboardAllotment = this.viewPlacementDashboardList.filter((s: { ListType: string; }) => s.ListType == 'Allotment');

          this.InventoryList = this.viewPlacementDashboardList.filter((e: any) => e.ListType == 'inventory')
          this.RevaluationTilesList = this.viewPlacementDashboardList.filter((e: any) => e.ListType == 'Revaluation')

          console.log(this.viewPlacementDashboardList);
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


  async GetEMAllData() {
    debugger;
    this.search.ModifyBy = this.sSOLoginDataModel.UserID;
    this.search.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.search.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.search.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.search.RoleID = this.sSOLoginDataModel.RoleID;
    this.search.UserID=this.sSOLoginDataModel.UserID;
    // this.searchRequest.IsYearly;
    // this.sSOLoginDataModel.ExamScheme = this.searchRequest.IsYearly;
    // this.sSOLoginDataModel.ExamScheme = this.searchRequest.IsYearly;
    this.search.FinancialYearID = this.sSOLoginDataModel.FinancialYearID

    if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon ) {
      this.search.CommonID = 89;
    }
    else if (this.sSOLoginDataModel.RoleID == EnumRole.DTE || this.sSOLoginDataModel.RoleID == EnumRole.DTENON || this.sSOLoginDataModel.RoleID == EnumRole.DIRECTOR) {
      this.search.CommonID = 88;
    }
    else if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      this.search.CommonID = 87;
    }
    // else if (this.sSOLoginDataModel.RoleID == 239) {
    //   this.searchRequest.CommonID = 90;
    // }
    else {
      this.search.CommonID = 0;
    }

    try {

      this.loaderService.requestStarted();
      debugger;
      await this.AdminDashDataService.GetEM_JDTEDashData(this.search)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.viewAdminDashboardList = data['Data'];

          console.log(this.viewAdminDashboardList,"viewAdminDashboardList")

          // Filter based on ListType 'EnrollmentType'
          this.viewJDTEStaffDetailList = this.viewAdminDashboardList.filter(s => s.ListType === 'StaffDetail');
          // Filter based on ListType 'ExaminationType'
          this.viewJDTEReleiving = this.viewAdminDashboardList.filter(s => s.ListType === 'Releiving');
          // Filter based on ListType 'OtherType'
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
