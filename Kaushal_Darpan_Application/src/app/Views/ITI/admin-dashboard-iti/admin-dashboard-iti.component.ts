import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumRole, GlobalConstants, EnumEMProfileStatus } from '../../../Common/GlobalConstants';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { async } from 'rxjs';
import { ITIAdminDashboardServiceService } from '../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITIAdminDashboardProfileModel, ITIAdminDashboardSearchModel } from '../../../Models/ITIAdminDashboardDataModel';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
  selector: 'app-admin-dashboard-iti',
  templateUrl: './admin-dashboard-iti.component.html',
  styleUrls: ['./admin-dashboard-iti.component.css'],
  standalone: false
})
export class AdminDashboardITIComponent implements OnInit
{
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public viewAdminDashboardList: StudentExamDetails[] = [];
  public ITIsWithNumberOfFormsList: any = [];
  public ITIsWithNumberOfFormsPriorityList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new ITIAdminDashboardSearchModel();
  public searchRequest1 = new ITIAdminDashboardProfileModel();
  public viewAdminDashboardListEnrollment: StudentExamDetails[] = [];
  public viewAdminDashboardListExamination: StudentExamDetails[] = [];
  public viewAdminDashboardListOther: StudentExamDetails[] = [];

  public viewApplicationCount: StudentExamDetails[] = [];

  public viewOptionFormCount: StudentExamDetails[] = [];

  public viewDirectApplicationCount: StudentExamDetails[] = [];


  public isprofile: number = 0;
  public DistrictMasterList: any = [];
  public DashBoardITIDispatchList: any[] = [];
  public Allotment1List: any[] = [];
  public Allotment2List: any[] = [];

  constructor(private ITIAdminDashboardServiceService: ITIAdminDashboardServiceService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private sweetAlert2: SweetAlert2) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
  }

  //Data Load
  async ngOnInit() {

    if ((this.sSOLoginDataModel.RoleID == EnumRole.DTETraing || this.sSOLoginDataModel.RoleID == EnumRole.ITIADMINISTRATIVEOFFICER || this.sSOLoginDataModel.RoleID == EnumRole.ITIZonalOfficer))
    {
      if (this.sSOLoginDataModel.EmTypeId == 1) {

        if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert)
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

      //this.loaderService.requestStarted();
      //await this.ITIAdminDashboardServiceService.GetAdminDashData(this.searchRequest)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.viewAdminDashboardList = data['Data'];
      //    console.log(this.viewAdminDashboardList, "DashBoo");
      //  }, (error: any) => console.error(error)
      //);

      if (this.searchRequest && this.searchRequest.RoleID > 0) {
        await this.ITIAdminDashboardServiceService.GetAdminDashData(this.searchRequest)
          .then((data: any) => {
            debugger
            data = JSON.parse(JSON.stringify(data));
            debugger
            this.viewAdminDashboardList = data['Data'];
           
            this.viewApplicationCount = this.viewAdminDashboardList.filter(s => s.ListType == 'ApplicationCount');
            this.viewDirectApplicationCount = this.viewAdminDashboardList.filter(s => s.ListType == 'DirectApplicationCount');

            this.viewOptionFormCount = this.viewAdminDashboardList.filter(s => s.ListType == 'OPTION FORM');
           

            // Filter based on ListType 'EnrollmentType'
            this.viewAdminDashboardListEnrollment = this.viewAdminDashboardList.filter(s => s.ListType === 'EnrollmentType');
            // Filter based on ListType 'ExaminationType'
            this.viewAdminDashboardListExamination = this.viewAdminDashboardList.filter(s => s.ListType === 'ExaminationType');
            // Filter based on ListType 'OtherType'
            this.viewAdminDashboardListOther = this.viewAdminDashboardList.filter(s => s.ListType === 'OtherType');

            this.DashBoardITIDispatchList = this.viewAdminDashboardList.filter(s => s.ListType == 'ITIDispatch');
            this.Allotment1List = this.viewAdminDashboardList.filter(s => s.ListType == 'Allotment1Type');
            this.Allotment2List = this.viewAdminDashboardList.filter(s => s.ListType == 'Allotment2Type');

            //console.log(this.viewAdminDashboardList, "DashBoo");
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

  async ITIsWithNumberOfForms() {
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
