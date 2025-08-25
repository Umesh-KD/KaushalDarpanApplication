import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';

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
import { BTEREstablishManagementService } from '../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { HODDashboardSearchModel } from '../../Models/ITIGovtEMStaffMasterDataModel';

@Component({
  selector: 'app-BTER-HOD-Dashboard',
  templateUrl: './BTER-HOD-Dashboard.component.html',
  styleUrls: ['./BTER-HOD-Dashboard.component.css'],
  standalone: false
})
export class BTERHODDashboardComponent {
  public viewPlacementDashboardList: any = [];
  public InventoryList: any = [];
  public Table_SearchText: string = "";
  public viewAdminDashboardListEnrollment: any[] = [];
  public viewAdminDashboardListExamination: any[] = [];
  public viewAdminDashboardListOther: any[] = [];
  public viewAdminDashboardListLeave: any[] = [];
  public viewAdminDashboardAllotment: any[] = [];

  public viewAdminDashboardListHODDash: any[] = [];

  public StaffMasterList: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public searchRequest = new HODDashboardSearchModel();
  public staffSearchRequest = new StaffMasterSearchModel();

  isProfileComplete: boolean = false;
  constructor(
    private bterEstablishManagementService: BTEREstablishManagementService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private collegeMasterService: CollegeMasterService,
    private sweetAlert2: SweetAlert2,
    private staffMasterService: StaffMasterService,
  ) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.CheckProfileStatus();

    if ((this.sSOLoginDataModel.RoleID == EnumRole.HOD_Eng || EnumRole.HOD_NonEng)) {
      await this.CheckProfileStatus_SELF();

      if (this.StaffMasterList.length > 0) {
        let status = this.StaffMasterList[0].ProfileStatus;
        if (status == EnumEMProfileStatus.Pending || status == EnumEMProfileStatus.Completed || status == EnumEMProfileStatus.Revert) {
          this.sweetAlert2.Confirmation("Your Profile Is not completed please Complete your profile?", async (result: any) => {
            window.open("/bter-em-add-staff-details", "_Self")
          }, 'OK', false);
        }        
      }
      await this.GetAllData();
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
      await this.bterEstablishManagementService.GetHODDash(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.viewPlacementDashboardList = data['Data'];

          console.log(this.viewPlacementDashboardList);
          this.viewAdminDashboardListHODDash = this.viewPlacementDashboardList.filter((s: { ListType: string; }) => s.ListType === 'HODDash');
          // Filter based on ListType 'EnrollmentType'
          //this.viewAdminDashboardListEnrollment = this.viewPlacementDashboardList.filter((s: { ListType: string; }) => s.ListType === 'EnrollmentType');
          //// Filter based on ListType 'ExaminationType'
          //this.viewAdminDashboardListExamination = this.viewPlacementDashboardList.filter((s: { ListType: string; }) => s.ListType === 'ExaminationType');
          
          //// Filter based on ListType 'OtherType'
          //this.viewAdminDashboardListOther = this.viewPlacementDashboardList.filter((s: { ListType: string; }) => s.ListType === 'OtherType');
          //this.viewAdminDashboardListLeave = this.viewPlacementDashboardList.filter((s: { ListType: string; }) => s.ListType === 'Leave');
          //this.viewAdminDashboardAllotment = this.viewPlacementDashboardList.filter((s: { ListType: string; }) => s.ListType == 'Allotment');

          //this.InventoryList = this.viewPlacementDashboardList.filter((e: any) => e.ListType == 'inventory')

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
