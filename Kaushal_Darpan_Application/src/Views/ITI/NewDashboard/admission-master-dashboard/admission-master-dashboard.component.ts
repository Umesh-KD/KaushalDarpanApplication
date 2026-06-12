import { Component, OnInit } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ITIAdminDashboardServiceService } from '../../../../app/Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { LoaderService } from '../../../../app/Services/Loader/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admission-master-dashboard',
  standalone: false,
  templateUrl: './admission-master-dashboard.component.html',
  styleUrl: './admission-master-dashboard.component.css'
})
export class AdmissionMasterDashboardComponent implements OnInit
{

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

  constructor(
    private _ITIAdminDashboardServiceService: ITIAdminDashboardServiceService,
    private loaderService: LoaderService,
    private router: Router

  )
  {

  }

  async ngOnInit(): Promise<void>
  {
    this.loadPieChart();
    this.FillBarChart();
    await this.GetAllData();


 
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

          const datas = data.Data.Table[0];
          this.governmentITI = datas.GovernmentITI;
          this.privateITI = datas.PrivateITI;
          this.TotalITI = datas.TotalITI;
          this.AffiliatedInstitutes = datas.AffiliatedInstitutes;




          this._barChartData = data.Data.Table1;

          //intake details
          const intake = data.Data.Table2[0];
          this.Engineering = intake.Engineering;
          this.NonEngineering = intake.NonEngineering;
          this.TotalActiveIntake = intake.Total;

          //intake details
          const Trades = data.Data.Table3[0];
          this.EngineeringTrades = Trades.EngineeringTrades;
          this.NonEngineering = Trades.NonEngineeringTrades;
          this.TotalTrades = Trades.TotalTrades;

          this._pieChartData = data.Data.Table4;





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
        text: 'District Institutional Split'
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
          text: ''
        }
      },

      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },

      series: [
        {
          type: 'column',
          name: 'Government ITIs',
          data: governmentData
        } as Highcharts.SeriesColumnOptions, 
        {
          type: 'column',
          name: 'Private ITIs',
          data: privateData
        } as Highcharts.SeriesColumnOptions,
      ],

      credits: {
        enabled: false
      }
    
    };
    this.updateFlag = true;
    console.log(this.chartOptions);
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
                this.onPieSliceClick(event.point);
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
     this.router.navigate(['/iti-bank-guarantee-list']);
  }

}

