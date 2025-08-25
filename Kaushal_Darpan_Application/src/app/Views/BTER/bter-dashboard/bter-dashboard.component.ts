import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { EnumRole } from '../../../Common/GlobalConstants';
import { AdminDashboardSearchModel } from '../../../Models/AdminDashboardDataModel';
import { StudentExamDetails, DashboardCardModel } from '../../../Models/DashboardCardModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AdminDashboardDataService } from '../../../Services/AdminDashboard/admin-dashboard-data.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-bter-dashboard',
  templateUrl: './bter-dashboard.component.html',
  styleUrl: './bter-dashboard.component.css',
  standalone: false
})
export class BterDashboardComponent {
  readonly dialog = inject(MatDialog);
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
  public Table_SearchText: string = "";
  public searchRequest = new AdminDashboardSearchModel();
  private userDataSubscription!: Subscription;
  constructor(
    private AdminDashDataService: AdminDashboardDataService,
    private loaderService: LoaderService,
    private commonFunctionService: CommonFunctionService) {

  }

  ngOnInit() {
    debugger;
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.sSOLoginDataModel != null) {
      this.GetAllData();
    }
  }

  async GetAllData() {
    debugger;
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.IsYearly;
    this.sSOLoginDataModel.ExamScheme = this.searchRequest.IsYearly;
    this.sSOLoginDataModel.ExamScheme = this.searchRequest.IsYearly;
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
    else {
      this.searchRequest.CommonID = 0;
    }

    try {

      this.loaderService.requestStarted();
      await this.AdminDashDataService.GetAdminDashData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.viewAdminDashboardList = data['Data'];

          console.log(this.viewAdminDashboardList,"viewAdminDashboardList")

          // Filter based on ListType 'EnrollmentType'
          this.viewAdminDashboardListEnrollment = this.viewAdminDashboardList.filter(s => s.ListType === 'EnrollmentType');
          // Filter based on ListType 'ExaminationType'
          this.viewAdminDashboardListExamination = this.viewAdminDashboardList.filter(s => s.ListType === 'ExaminationType');
          // Filter based on ListType 'OtherType'
          this.viewAdminDashboardListOther = this.viewAdminDashboardList.filter(s => s.ListType === 'OtherType');

          this.viewAdminDashboardListCitizenSuggestion = this.viewAdminDashboardList.filter(s => s.ListType === 'CitizenSuggestion');
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

