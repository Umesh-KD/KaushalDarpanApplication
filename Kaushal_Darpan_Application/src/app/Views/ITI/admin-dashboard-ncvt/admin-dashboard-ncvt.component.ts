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

@Component({
  selector: 'app-admin-dashboard-ncvt',
  standalone: false,
  templateUrl: './admin-dashboard-ncvt.component.html',
  styleUrl: './admin-dashboard-ncvt.component.css'
})
export class AdminDashboardNcvtComponent {

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

  public viewAdminDashboardListEnrollment: StudentExamDetails[] = [];
  public viewAdminDashboardListExaminationNCVT: StudentExamDetails[] = [];
  public viewAdminDashboardListOther: StudentExamDetails[] = [];
  public viewApplicationCount: StudentExamDetails[] = [];
  public DistrictMasterList: any = [];
  public DashBoardITIDispatchList: any[] = [];
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  constructor(private ITIAdminDashboardServiceService: ITIAdminDashboardServiceService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  //Data Load
  ngOnInit() {
    if (this.sSOLoginDataModel.EmTypeId == 1) {
      if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed) {
        window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self")
      }
    }
    this.GetAllData();
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
        await this.ITIAdminDashboardServiceService.GetAdminDashNCVTData(this.searchRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.viewAdminDashboardList = data['Data'];
            // Filter based on ListType 'EnrollmentType'
            this.viewAdminDashboardListEnrollment = this.viewAdminDashboardList.filter(s => s.ListType === 'EnrollmentType');
            // Filter based on ListType 'ExaminationType'
            this.viewAdminDashboardListExaminationNCVT = this.viewAdminDashboardList.filter(s => s.ListType === 'ExaminationType');
            this.DashBoardITIDispatchList = this.viewAdminDashboardList.filter(s => s.ListType == 'ITIDispatch');
            //console.log(this.viewAdminDashboardListEnrollment, "EnrollmentType");
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


}
