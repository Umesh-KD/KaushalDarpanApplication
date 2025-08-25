import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import ApexCharts from 'apexcharts';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this.chart.render();
  }
  chart: any;
  options = {
    series: [{
      name: 'Number Of Examinations',
      data: [1, 2]
    }],
    annotations: {
      points: [{
        x: 'Bananas',
        seriesIndex: 0,
        label: {
          borderColor: '#775DD0',
          offsetY: 0,
          style: {
            color: '#fff',
            background: '#775DD0',
          },
          text: 'Bananas are good',
        }
      }]
    },
    chart: {
      height: 350,
      width: 550,  // Added width here
      type: 'bar',
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '50%',
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 0
    },
    grid: {
      row: {
        colors: ['#fff', '#f2f2f2']
      }
    },
    xaxis: {
      labels: {
        rotate: -45
      },
      categories: ['Apples', 'Oranges'],
      tickPlacement: 'on'
    },
    yaxis: {
      title: {
        text: 'Number Of Examinations',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "horizontal",
        shadeIntensity: 0.25,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100]
      },
    }
  };

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {
      text: 'My First Highchart'
    },
    series: [{
      data: [1, 2, 3, 4, 5],
      type: 'line'
    }]
  };

  ngOnInit() {
    // Initialize the chart once the component is initialized
    const chartElement = document.querySelector("#chart");
    this.chart = new ApexCharts(chartElement, this.options);
    
  }

  

  ngOnDestroy() {
    // Clean up the chart when the component is destroyed
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
