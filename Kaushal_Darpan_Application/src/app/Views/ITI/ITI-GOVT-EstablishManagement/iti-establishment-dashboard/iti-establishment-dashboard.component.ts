import { Component } from '@angular/core';
import { EnumRole } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ITIAdminDashboardServiceService } from '../../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { ITIPrincipalDashboardServiceService } from '../../../../Services/ITI-Principal-Dashboard-Service/iti-principal-dashboard-service.service';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-iti-establishment-dashboard',
  standalone: false,
  templateUrl: './iti-establishment-dashboard.component.html',
  styleUrl: './iti-establishment-dashboard.component.css'
})
export class ITIEstablishmentDashboardComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;
  public DashboardDataList: any[] = [];
  public EstablishmentDashboardTiles: any[] = [];
  public RelievingJoiningDashboardTiles: any[] = [];

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
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private ITIAdminDashboardServiceService: ITIPrincipalDashboardServiceService,
  ){}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetAllData()
  }

  async GetAllData()  {
    try {
      const searchRequest: any = {};
      this.loaderService.requestStarted();
      searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      searchRequest.USerID = this.sSOLoginDataModel.UserID;

      await this.ITIAdminDashboardServiceService.GetITIEstablishmentDashboard(searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DashboardDataList = data['Data'];

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
            
            else if (item.ListType === 'PostTypeStaff') {
              this.dashboardData.PostTypeStaff.push(model);
            }

          })
          this.getTotalPostTypeStaff();
          this.PostTypeStaffChartOptions = this.buildPieChart(this.dashboardData.PostTypeStaff);
          
          
          // this.EstablishmentDashboardTiles = this.DashboardDataList.filter(s => s.ListType == 'Establishment');
          // this.RelievingJoiningDashboardTiles = this.DashboardDataList.filter(s => s.ListType == 'RelievingJoining');
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

  PostTypeStaffPercentage(count: number): string {

    const total = this.dashboardData.PostTypeStaff
      .reduce((s, i) => s + (i.TotalCount || 0), 0);
    if (total === 0) {
      return '0%';
    }
    return Math.round((count / total) * 100) + '%';
  }

  getTotalPostTypeStaff() {
    this.TotalPostTypeStaffCount = this.dashboardData?.PostTypeStaff?.reduce((s, i) => s + (i.TotalCount || 0), 0);
  }

  getTotalPost(): number {
    return this.dashboardData.PostTypeStaff?.reduce(
      (sum, x) => sum + (+x.TotalCount || 0),
      0
    ) || 0;
  }

  buildPieChart(data: any[]): Highcharts.Options | null {
    if (!data?.length) return null;

    const colors = ['#0d6efd', '#6c757d', '#198754', '#ffc107'];

    const total = data.reduce(
      (sum, item) => sum + (item.TotalCount || 0),
      0
    );

    const seriesData = total === 0
      ? [{
        name: 'No Data',
        y: 1,
        color: '#e5e7eb'
      }]
      : data.map((item, i) => ({
        name: item.TotalText,
        y: Number(item.TotalCount) || 0,
        color: colors[i % colors.length]
      }));

    return {
      chart: {
        type: 'pie',
        height: 260,
        backgroundColor: 'transparent',
        margin: [10, 10, 10, 10]
      },

      // title: { text: '' },
      title: {
        text: this.getTotalPost().toLocaleString(),
        verticalAlign: 'middle',
        y: 25,
        style: {
          fontSize: '34px',
          fontWeight: '700'
        }
      },

      credits: {
        enabled: false
      },

      subtitle: {
        // text: 'TOTAL SEATS',
        verticalAlign: 'middle',
        y: -15,
        style: {
          fontSize: '12px',
          color: '#64748b'
        }
      },

      legend: {
        enabled: false
      },

      tooltip: {
        pointFormat: total === 0
          ? 'No data available'
          : '<b>{point.name}</b>: {point.y} ({point.percentage:.0f}%)'
      },

      plotOptions: {
        pie: {
          innerSize: '55%',
          borderWidth: 3,
          borderColor: '#ffffff',

          dataLabels: {
            enabled: total > 0,
            format: '{point.name}: {point.y}',
            style: {
              fontSize: '11px',
              fontWeight: '500',
              textOutline: 'none'
            }
          }
        }
      },

      series: [{
        type: 'pie',
        name: 'Requests',
        data: seriesData
      }]
    };
  }
}
