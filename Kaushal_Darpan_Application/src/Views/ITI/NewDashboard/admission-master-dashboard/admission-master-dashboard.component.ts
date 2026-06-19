import { Component, OnInit } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ITIAdminDashboardServiceService } from '../../../../app/Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { LoaderService } from '../../../../app/Services/Loader/loader.service';
import { Router } from '@angular/router';
import { ItiTradeService } from '../../../../app/Services/iti-trade/iti-trade.service';
import { SSOLoginDataModel } from '../../../../app/Models/SSOLoginDataModel';
import { EnumStatus } from '../../../../app/Common/GlobalConstants';

@Component({
  selector: 'app-admission-master-dashboard',
  standalone: false,
  templateUrl: './admission-master-dashboard.component.html',
  styleUrl: './admission-master-dashboard.component.css'
})
export class AdmissionMasterDashboardComponent implements OnInit
{
  sSOLoginDataModel = new SSOLoginDataModel();
  public _barChartData: any[] = [];
  public _pieChartData: any[] = [];


  public governmentITI: any;
  public privateITI: any;
  public TotalITI: any;

  public Engineering: any;
  public NonEngineering: any;
  public TotalActiveIntake: any;


  public EngineeringTrades: any;
  public NonEngineeringTrades: any;
  public TotalTrades: any;




  public AffiliatedInstitutes: any;
  
  public affiliatedInstitutes: any;

  updateFlag = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  pieChartOptions: Highcharts.Options = {};

    public DashboardCountList: any = []

  public planningChartData: any[] = [];
planningChartOptions: Highcharts.Options = {};
updatePlanningFlag = false;
  constructor(
    private _ITIAdminDashboardServiceService: ITIAdminDashboardServiceService,
    private loaderService: LoaderService,
    private router: Router,
    private itiTradeService: ItiTradeService

  )
  {

  }

  async ngOnInit(): Promise<void>
  {
    this.loadPieChart();
    this.FillBarChart();
    this.loadPlanningChart();
    await this.GetAllData();
    await this.GetDTEDashboard();
  }

  async GetAllData()
  {
    debugger
    var d =
    {
      ActionName: 'DashboardCounts'
    };
    try
    {

      await this._ITIAdminDashboardServiceService.GetAdmissionMasterDashboard(d)
        .then((data: any) =>
        {
          data = JSON.parse(JSON.stringify(data));
          const datas = data?.Data?.Table?.[0] || {};

          this.governmentITI = datas.GovernmentITI || 0;
          this.privateITI = datas.PrivateITI || 0;
          this.TotalITI = datas.TotalITI || 0;
          this.AffiliatedInstitutes = datas.AffiliatedInstitutes || 0;

          // Bar Chart Data
          this._barChartData = data?.Data?.Table1 || [];

          // Intake Details
          const intake = data?.Data?.Table2?.[0] || {};

          this.Engineering = intake.Engineering || 0;
          this.NonEngineering = intake.NonEngineering || 0;
          this.TotalActiveIntake = intake.Total || 0;

          // Trade Details
          const trades = data?.Data?.Table3?.[0] || {};

          this.EngineeringTrades = trades.EngineeringTrades || 0;
          this.NonEngineeringTrades = trades.NonEngineeringTrades || 0;
          this.TotalTrades = trades.TotalTrades || 0;

          // Pie Chart Data
          this._pieChartData = data?.Data?.Table4 || [];



          this.DashboardCountList = data?.Data?.Table5 || [];






          console.log(this._barChartData, "_barChartData");

 
          this.FillBarChart();

          this.loadPieChart
            ();
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




  FillBarChart()
  {

    const categories = this._barChartData.map((x: any) => x.DistrictName);
    const governmentData = this._barChartData.map((x: any) => Number(x.GovernmentITI));
    const privateData = this._barChartData.map((x: any) => Number(x.PrivateITI));


    this.chartOptions = {
      chart: {
        type: 'column'
      },

      title: {
        text: 'District Wise Institutions'
      },

      xAxis: {
        categories: categories,
        title: {
          text: 'District'
        }
      },

      yAxis: {
        min: 0,
        title: {
          text: 'No of ITIs'
        }
      },

      plotOptions: {
        column: {
          grouping: true,
          pointPadding: 0.1,
          borderWidth: 0
        }
      },

      series: [
        {
          type: 'column',
          name: 'Government ITIs',
          data: governmentData
        },
        {
          type: 'column',
          name: 'Private ITIs',
          data: privateData
        }
      ],

      credits: {
        enabled: false
      }
    };



    this.updateFlag = true;
 
  }



  loadPieChart(): void {
    debugger;

    this.pieChartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Bank Guarantee Status'
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> ({point.percentage:.1f}%)'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}'
          },
          point: {
            events: {
              click: (event) => {
                console.log('Clicked slice:', event.point.name);
                console.log('Value:', event.point.y);

                // Call your method
                this.onPieSliceClick(event.point.name);
              }
            }
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Applications',
          data: this._pieChartData
        }
      ]
    };
  }

  onPieSliceClick(point: any)
  {
    let status = 0;
    debugger;
    if (point == 'Active')
    {
      status = 1;
    }
    else if (point == 'Due') {
      status = 3;
    }
    else if (point == 'Returned')
    {
      status = 2;
    }
    else {
      status = 0;
    }



    this.router.navigate(
      ['/iti-bank-guarantee-list'],
      {
        queryParams: {
          status: status
        }
      }
    );

  }

  async GetDTEDashboard() {
  const d = {
    FinancialYearID: this.sSOLoginDataModel.FinancialYearID
  };

  try {
    this.loaderService.requestStarted();

 


          this.planningChartData = this.DashboardCountList
            .filter((f: any) => f.TileType === 'Planing')
            .map((x: any) => ({
              name: x.TradeName,
              y: Number(x.TradeCount),
              routeValue: x.RouteValue
            }));

          console.log('Planning Chart Data', this.planningChartData);

          this.loadPlanningChart();
        

      

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

loadPlanningChart(): void {

  console.log('loadPlanningChart called');
console.log( 'chart data in load planning',this.planningChartData);
  this.planningChartOptions = {
    chart: {
      type: 'pie'
    },

    title: {
      text: 'Planning Status'
    },

    tooltip: {
      pointFormat: '<b>{point.y}</b> ({point.percentage:.1f}%)'
    },

    plotOptions: {
      pie: {
        innerSize: '60%',   // Makes it Donut
        allowPointSelect: true,
        cursor: 'pointer',

        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y}'
        },

        point: {
          events: {
            click: (event: any) => {

              const routeValue = event.point.options.routeValue;

              this.router.navigate(
                ['/ItiPlanningList'],
                {
                  queryParams: {
                    status: routeValue
                  }
                }
              );
            }
          }
        }
      }
    },

    series: [
      {
        type: 'pie',
        name: 'Planning',
        data: this.planningChartData
      }
    ],

    credits: {
      enabled: false
    }
  };
    console.log('planning chart options',this.planningChartOptions);
debugger
  this.updatePlanningFlag = true;
}


}

