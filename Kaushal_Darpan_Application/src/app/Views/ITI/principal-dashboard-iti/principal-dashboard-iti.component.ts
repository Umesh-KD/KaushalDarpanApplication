import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumEMProfileStatus, EnumRole, GlobalConstants } from '../../../Common/GlobalConstants';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { async } from 'rxjs';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITIAdminDashboardServiceService } from '../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { ITIPrincipalDashboardServiceService } from '../../../Services/ITI-Principal-Dashboard-Service/iti-principal-dashboard-service.service';
import { ITIPricipalDashboardSearchModel } from '../../../Models/ITIPrincipalDashboardDataModel';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { ITIAdminDashboardProfileModel } from '../../../Models/ITIAdminDashboardDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-principal-dashboard-iti',
  templateUrl: './principal-dashboard-iti.component.html',
  styleUrls: ['./principal-dashboard-iti.component.css'],
  standalone: false
})


export class PrincipalDashboardITIComponent implements OnInit
{
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public viewAdminDashboardList: StudentExamDetails[] = [];
  public ITIsWithNumberOfFormsList: any = [];
  public ITIsWithNumberOfFormsPriorityList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new ITIPricipalDashboardSearchModel();
  public viewAdminDashboardListEnrollment: StudentExamDetails[] = [];
  public viewAdminDashboardListExamination: StudentExamDetails[] = [];
  public viewAdminDashboardListOther: StudentExamDetails[] = [];
  public viewAdminDashboardAllot: any[] = [];
  public searchRequest1 = new ITIAdminDashboardProfileModel();
  public viewApplicationCount: StudentExamDetails[] = [];
  public DistrictMasterList: any = [];
  public isprofile: number = 0;
  public isfeeLoaced: number = 0;
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  constructor(private ITIAdminDashboardServiceService: ITIPrincipalDashboardServiceService, private ITIAdminDashboardService: ITIAdminDashboardServiceService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private encryptionService: EncryptionService,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private sweetAlert2: SweetAlert2) {
    this.sSOLoginDataModel = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');
  }

  //Data Load
  async ngOnInit() {
    if ((this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || EnumRole.Principal_NCVT)) {
      await this.CheckProfileStatus();

      if (this.sSOLoginDataModel.EmTypeId == 1) {

        if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed)
          window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self")

      }

      if (this.isprofile == 0) {
        this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
          window.open("/ITIUpdateCollegeProfile?id=" + this.encryptionService.encryptData(this.sSOLoginDataModel.InstituteID), "_Self")
        }, 'OK', false);

      } else if (this.isfeeLoaced==0) {
        this.sweetAlert2.Confirmation("Your Trade fee is not locked. Please lock your college trade fee?", async (result: any) => {
          window.open("/iti-fees-peryear-list", "_Self");
        }, 'OK', false);
      }
      else {
        await this.GetAllData()
      }
    }
  
  }

  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();  
      await this.ITIAdminDashboardService.GetProfileStatus(this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.isprofile = data['Data'][0]['IsProfile'];
          this.isfeeLoaced = data['Data'][0]['isFeeLocked'];
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


  async GetAllData()
  {
    

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    try {
      this.loaderService.requestStarted();
      await this.ITIAdminDashboardServiceService.GetITIPrincipalDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.viewAdminDashboardList = data['Data'];
          this.viewApplicationCount = this.viewAdminDashboardList.filter(s => s.ListType == 'ApplicationCount');
          this.viewAdminDashboardAllot = this.viewAdminDashboardList.filter(s => s.ListType == 'AllotmentType');
          // Filter based on ListType 'EnrollmentType'
          this.viewAdminDashboardListEnrollment = this.viewAdminDashboardList.filter(s => s.ListType === 'EnrollmentType');
          // Filter based on ListType 'ExaminationType'
          this.viewAdminDashboardListExamination = this.viewAdminDashboardList.filter(s => s.ListType === 'ExaminationType');
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

  async ITIsWithNumberOfForms()
  {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {

      this.loaderService.requestStarted();
      await this.ITIAdminDashboardServiceService.ITIsWithNumberOfForms(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ITIsWithNumberOfFormsList = data['Data'];
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
  async ITIsWithNumberOfFormsPriority() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {

      this.loaderService.requestStarted();
      await this.ITIAdminDashboardServiceService.ITIsWithNumberOfFormsPriorityList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ITIsWithNumberOfFormsPriorityList = data['Data'];

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
