import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumEMProfileStatus } from '../../../Common/GlobalConstants';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { ITIAdminDashboardSearchModel } from '../../../Models/ITIAdminDashboardDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITIAdminDashboardServiceService } from '../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { DynamicUploadContentApprenticeshipListsModal, DynamicUploadContentListsModal } from '../../../Models/CampusDetailsWebDataModel';
import { Home2Service } from '../../../Services/Home2/home2.service';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-iti-ApprenticeshipDirectorNCVTDashboard',
  standalone: false,
  templateUrl: './iti-ApprenticeshipDirectorNCVTDashboard.component.html',
  styleUrl: './iti-ApprenticeshipDirectorNCVTDashboard.component.css'
})
export class ApprenticeshipDirectorNCVTDashboardComponent {

  public ApprenticeshipList: any[] = [];
  public ITIList: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public viewAdminDashboardList: StudentExamDetails[] = [];
  public ITIsWithNumberOfFormsList: any = [];
  public ITIsWithNumberOfFormsPriorityList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new ITIAdminDashboardSearchModel();
  public itiSearchRequest = new DynamicUploadContentApprenticeshipListsModal();
  public viewAdminDashboardListEnrollment: StudentExamDetails[] = [];
  public viewAdminDashboardListExaminationNCVT: StudentExamDetails[] = [];
  public viewAdminDashboardListOther: StudentExamDetails[] = [];
  public viewApplicationCount: StudentExamDetails[] = [];
  public DistrictMasterList: any = [];
  public DashBoardITIDispatchList: any[] = [];
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  constructor(private ITIAdminDashboardServiceService: ITIAdminDashboardServiceService, private home2Service: Home2Service,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private appsettingConfig: AppsettingService) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  ngOnInit() {
    if (this.sSOLoginDataModel.EmTypeId == 1) {
      if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed) {
        window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self")
      }
    }
    this.GetAllData();
    this.GetDynamicUploadContentNotificationApprenticeshipList();
  }


  async GetAllData() {
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    try {

      if (this.searchRequest && this.searchRequest.RoleID > 0) {
        await this.ITIAdminDashboardServiceService.GetApprenticeshipDirectorNCVTData(this.searchRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.viewAdminDashboardList = data['Data'];
            this.viewAdminDashboardListEnrollment = this.viewAdminDashboardList.filter(s => s.ListType === 'EnrollmentType');
            this.viewAdminDashboardListExaminationNCVT = this.viewAdminDashboardList.filter(s => s.ListType === 'ExaminationType');
            this.DashBoardITIDispatchList = this.viewAdminDashboardList.filter(s => s.ListType == 'ITIDispatch');
          }, (error: any) => console.error(error)
          );
      }


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

  async GetDynamicUploadContentNotificationITI() {
    try {
      
      this.itiSearchRequest.Key = 'DynamicUploadShortList';
      this.loaderService.requestStarted();
      await this.home2Service.GetDynamicUploadContentApprenticeship(this.itiSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ITIList = data.Data;

          console.log('this.ITIList ==>',this.ITIList)
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

  async GetDynamicUploadContentNotificationApprenticeshipList() {

    this.itiSearchRequest.RoleID = this.sSOLoginDataModel.RoleID
    try {
     
      this.itiSearchRequest.Key = 'DynamicUploadShortList';
      this.loaderService.requestStarted();
      await this.home2Service.GetDynamicUploadContentApprenticeship(this.itiSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ApprenticeshipList = data.Data;
          console.log('this.ApprenticeshipList ==>',this.ApprenticeshipList)
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
