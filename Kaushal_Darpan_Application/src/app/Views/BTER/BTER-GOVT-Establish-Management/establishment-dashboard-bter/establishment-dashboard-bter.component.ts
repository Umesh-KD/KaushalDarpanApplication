import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import Highcharts from 'highcharts';
import { EnumRole } from '../../../../Common/GlobalConstants';
import { ITIPrincipalDashboardServiceService } from '../../../../Services/ITI-Principal-Dashboard-Service/iti-principal-dashboard-service.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { AdminDashboardDataService } from '../../../../Services/AdminDashboard/admin-dashboard-data.service';
import { EM_StaffTrainingDashboardSearchModel } from '../../../../Models/AdminDashboardDataModel';
import { TeacherHigherEducationApplicationComponent } from '../../THTE/teacher-higher-education-application/teacher-higher-education-application.component';
import { TeacherHigherEducationApplicationService } from '../../../../Services/teacher-higher-education-application/teacher-higher-education-application.service';

@Component({
  selector: 'app-establishment-dashboard-bter',
  standalone: false,
  templateUrl: './establishment-dashboard-bter.component.html',
  styleUrl: './establishment-dashboard-bter.component.css'
})
export class EstablishmentDashboardBTERComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new EM_StaffTrainingDashboardSearchModel();

  public _EnumRole = EnumRole;
  public DashboardDataList: any[] = [];
  public EstablishmentDashboardTiles: any[] = [];
  public RelievingJoiningDashboardTiles: any[] = [];
  public STC_DashboardTiles: any[] = [];
  public HTE_DashboardTiles: any[] = [];

  Highcharts: typeof Highcharts = Highcharts;
  public PostTypeStaffChartOptions: Highcharts.Options | null = null;

  public TotalPostTypeStaffCount: number = 0;

  dashboardData: {
    Establishment: any[],
    RelievingJoining: any[],
    PostTypeStaff: any[]
  } = {
      Establishment: [],
      RelievingJoining: [],
      PostTypeStaff: [],
    };

  constructor(
    private loaderService: LoaderService,
    private AdminDashDataService: AdminDashboardDataService,
    private teacherHigherEducationApplicationService : TeacherHigherEducationApplicationService,
  ){}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetBTEREstablishmentDashboard();
    await this.GetStaffTrainingDashboardData();
    await this.HTE_DashboardTilesGet();
  }

  async GetBTEREstablishmentDashboard() {
    try {
      const request: any = {};
      request.UserID = this.sSOLoginDataModel.UserID;
      request.RoleID = this.sSOLoginDataModel.RoleID;
      request.InstituteID = this.sSOLoginDataModel.InstituteID;
      request.OfficeID = this.sSOLoginDataModel.OfficeID;

      await this.AdminDashDataService.GetBTEREstablishmentDashboard(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DashboardDataList = data.Data;
        this.dashboardData = {
          Establishment: [],
          RelievingJoining: [],
          PostTypeStaff: [],
        };

        this.DashboardDataList.forEach((item: any) => {
          const model = {
            id: item.ID,
            TotalText: item.TotalText,
            TotalTextHi: item.TotalTextHi,
            TotalCount: Number(item.TotalCount),
            URL: item.URL,
            SRC: item.SRC,
            Menu: item.Menu,
            Status: item.Status,
            ListType: item.ListType,
            bgClass: item.bgClass,
            bgClassIcon: item.bgClassIcon,
            Action: item.Action,
            bottomIcon: item.bottomIcon,
            countTextColor: item.countTextColor,
          };

          if (item.ListType == 'Establishment') {
            this.dashboardData.Establishment.push(model);
          }

          else if (item.ListType === 'RelievingJoining') {
            this.dashboardData.RelievingJoining.push(model);
          }
          
          // else if (item.ListType === 'PostTypeStaff') {
          //   this.dashboardData.PostTypeStaff.push(model);
          // }

        })
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetStaffTrainingDashboardData() {
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.UserID=this.sSOLoginDataModel.UserID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    try {
      this.loaderService.requestStarted();
      await this.AdminDashDataService.GetStaffTrainingDashboardData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.STC_DashboardTiles = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async HTE_DashboardTilesGet() {

    const request: any = {};
    request.UserID = this.sSOLoginDataModel.UserID;
    request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    request.EndTermID = this.sSOLoginDataModel.EndTermID;
    request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    request.RoleID = this.sSOLoginDataModel.RoleID;
    request.UserID=this.sSOLoginDataModel.UserID;
    request.InstituteID = this.sSOLoginDataModel.InstituteID;
    try {
      this.loaderService.requestStarted();
      await this.teacherHigherEducationApplicationService.HTE_DashboardTilesGet(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.HTE_DashboardTiles = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }
  
}
