import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EnumRole } from '../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { NavigationEnd, Router } from '@angular/router';
import { AdminDashboardSearchModel, AdminDashboardIssueTrackerSearchModel } from '../../Models/AdminDashboardDataModel';
import { AdminDashboardDataService } from '../../Services/AdminDashboard/admin-dashboard-data.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { StudentExamDetails, DashboardCardModel } from '../../Models/DashboardCardModel';


@Component({
  selector: 'app-dashboard-issue-tracker',
  templateUrl: './dashboard-issue-tracker.component.html',
  styleUrls: ['./dashboard-issue-tracker.component.css'],
  standalone: false
})
export class dashboardIssueTrackerComponent implements OnInit {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;
  public searchRequest = new AdminDashboardIssueTrackerSearchModel();
  public viewAdminDashboardList: StudentExamDetails[] = [];
  public viewAdminDashboardListEnrollment: StudentExamDetails[] = [];
  public viewAdminDashboardListExamination: StudentExamDetails[] = [];
  public viewAdminDashboardListOther: StudentExamDetails[] = [];
  public viewAdminDashboardListCitizenSuggestion: StudentExamDetails[] = [];


  constructor(
    private routers: Router,
    private cdr: ChangeDetectorRef,
    private AdminDashDataService: AdminDashboardDataService,
    private loaderService: LoaderService,
    private commonFunctionService: CommonFunctionService) {
 

  }
async  ngOnInit() {
    debugger;
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData()

  }


  async GetAllData() {
    debugger;
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.IsYearly;
    //this.sSOLoginDataModel.ExamScheme = this.searchRequest.IsYearly;
    //this.sSOLoginDataModel.ExamScheme = this.searchRequest.IsYearly;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
  


    if (this.sSOLoginDataModel.RoleID == 1 || this.sSOLoginDataModel.RoleID == 1) {
      this.searchRequest.CommonID = 1;
    }
    else if (this.sSOLoginDataModel.RoleID == 2 || this.sSOLoginDataModel.RoleID == 2) {
     this.searchRequest.CommonID = 88;
    }
    else if (this.sSOLoginDataModel.RoleID == 49 || this.sSOLoginDataModel.RoleID == 49) {
      this.searchRequest.CommonID = 87;
    }
    //else {
    //  this.searchRequest.CommonID = 0;}
   

    try {
      debugger;
      this.loaderService.requestStarted();
      await this.AdminDashDataService.GetAdminDashData(this.searchRequest)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger
          this.viewAdminDashboardList = data['Data'];
          console.log(this.viewAdminDashboardList)

          // Filter based on ListType 'EnrollmentType'
          //this.viewAdminDashboardListEnrollment = this.viewAdminDashboardList.filter(s => s.ListType === 'EnrollmentType');
          //// Filter based on ListType 'ExaminationType'
          //this.viewAdminDashboardListExamination = this.viewAdminDashboardList.filter(s => s.ListType === 'ExaminationType');
          //// Filter based on ListType 'OtherType'
          //this.viewAdminDashboardListOther = this.viewAdminDashboardList.filter(s => s.ListType === 'OtherType');

          //this.viewAdminDashboardListCitizenSuggestion = this.viewAdminDashboardList.filter(s => s.ListType === 'CitizenSuggestion');

          //this.viewAdminDashboardListExamination = this.viewAdminDashboardList.filter(s => s.ListType === 'IssueTrackerType');
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
