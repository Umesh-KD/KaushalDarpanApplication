import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import Highcharts from 'highcharts';
import { EnumRole } from '../../../../Common/GlobalConstants';
import { ITIPrincipalDashboardServiceService } from '../../../../Services/ITI-Principal-Dashboard-Service/iti-principal-dashboard-service.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { AdminDashboardDataService } from '../../../../Services/AdminDashboard/admin-dashboard-data.service';

@Component({
  selector: 'app-establishment-dashboard-bter',
  standalone: false,
  templateUrl: './establishment-dashboard-bter.component.html',
  styleUrl: './establishment-dashboard-bter.component.css'
})
export class EstablishmentDashboardBTERComponent {
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
    private loaderService: LoaderService,
    private AdminDashDataService: AdminDashboardDataService,
  ){}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetBTEREstablishmentDashboard();
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
        this.dashboardData = data.Data;

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
        // this.getTotalPostTypeStaff();
        this.PostTypeStaffChartOptions = this.buildPieChart(this.dashboardData.PostTypeStaff);
      })
    } catch (error) {
      console.error(error);
    }
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
        // text: this.getTotalPost().toLocaleString(),
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
