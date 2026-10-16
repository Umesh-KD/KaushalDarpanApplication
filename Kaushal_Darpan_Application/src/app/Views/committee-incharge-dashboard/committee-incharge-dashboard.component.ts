import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { EnumRole } from '../../Common/GlobalConstants';
import { AdminDashboardSearchModel } from '../../Models/AdminDashboardDataModel';
import { StudentExamDetails, DashboardCardModel } from '../../Models/DashboardCardModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { AdminDashboardDataService } from '../../Services/AdminDashboard/admin-dashboard-data.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-committee-incharge-dashboard',
  standalone: false,
  templateUrl: './committee-incharge-dashboard.component.html',
  styleUrl: './committee-incharge-dashboard.component.css'
})
export class CommitteeInchargeDashboardComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public viewAdminDashboardList: StudentExamDetails[] = [];
  public viewAdminDashboardListEnrollment: StudentExamDetails[] = [];
  public viewAdminDashboardListExamination: StudentExamDetails[] = [];
  public viewAdminDashboardListOther: StudentExamDetails[] = [];
  public viewAdminDashboardListCitizenSuggestion: StudentExamDetails[] = [];
  public RevaluationTilesList: StudentExamDetails[] = [];
  public marqueList: any[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new AdminDashboardSearchModel();

  marqueeMessage: string = '';
  constructor(
    private AdminDashDataService: AdminDashboardDataService,
    private loaderService: LoaderService,
    private commonFunctionService: CommonFunctionService) {

  }

  ngOnInit() {
    //debugger;
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.sSOLoginDataModel != null) {
      this.GetAllData();
    }
  }

  async GetAllData() {
    //debugger;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.IsYearly;
    this.sSOLoginDataModel.ExamScheme = this.searchRequest.IsYearly;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID


    try {

      this.loaderService.requestStarted();
      //debugger;
      await this.AdminDashDataService.GetCommitteeInchargeDashData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.viewAdminDashboardList = data['Data'];
          this.viewAdminDashboardList= this.viewAdminDashboardList.filter(s => s.ListType === 'tile');
          //this.marqueeMessage = data['Data'][3]?.TotalText;
          this.marqueList = data['Data'].filter((s: any) => s.ListType === 'marque')
          this.marqueeMessage = this.marqueList[0].TotalText;

          console.log(this.viewAdminDashboardList, "viewAdminDashboardList")

          //// Filter based on ListType 'EnrollmentType'
          //this.viewAdminDashboardListEnrollment = this.viewAdminDashboardList.filter(s => s.ListType === 'EnrollmentType');
          //// Filter based on ListType 'ExaminationType'
          //this.viewAdminDashboardListExamination = this.viewAdminDashboardList.filter(s => s.ListType === 'ExaminationType');
          //// Filter based on ListType 'OtherType'
          //this.viewAdminDashboardListOther = this.viewAdminDashboardList.filter(s => s.ListType === 'OtherType');

          //this.viewAdminDashboardListCitizenSuggestion = this.viewAdminDashboardList.filter(s => s.ListType === 'CitizenSuggestion');

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
