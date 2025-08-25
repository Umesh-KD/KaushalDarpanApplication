import { Component, OnInit, AfterViewInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import * as Highcharts from 'highcharts';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { CampusDetailsWebSearchModel, DynamicUploadContentListsModal } from '../../../Models/CampusDetailsWebDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { Home2Service } from '../../../Services/Home2/home2.service';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css'],
  standalone: false
})
export class Home2Component implements AfterViewInit {
  public GlobalConstants = GlobalConstants;
  public PostId = 0;
  public CampusPostList: any[] = [];
  public NotificationList: any[] = [];
  public DteList: any[] = [];
  public BTERList: any[] = [];
  public ITIList: any[] = [];
  public ApprenticeshipList: any[] = [];
  public NewsList: any[] = [];
  public searchRequest = new DynamicUploadContentListsModal();
  public sSOLoginDataModel = new SSOLoginDataModel();

  public Highcharts: typeof Highcharts = Highcharts;
  public AdmissionPerByAY: Highcharts.Chart | undefined;
  public AdmissionPerByMgmtType: Highcharts.Chart | undefined;
  public AdmissionPerByAdmType: Highcharts.Chart | undefined;
  public AdmissionByGender: Highcharts.Chart | undefined;
  public AdmissionPerByCategory: Highcharts.Chart | undefined;
  public AdmissionPerByDistrict: Highcharts.Chart | undefined;
  AdmissionPerbyDistrictA: Highcharts.Chart | undefined;
  AdmissionByBranch: Highcharts.Chart | undefined;
  AdmissionPerByInstitute: Highcharts.Chart | undefined;
  AdmissionPerbyDistrictB: Highcharts.Chart | undefined;
  AdmissionByBranchB: Highcharts.Chart | undefined;
  AdmissionPerByInstituteB: Highcharts.Chart | undefined;


  constructor(private commonMasterService: CommonFunctionService,
    private home2Service: Home2Service, private toastr: ToastrService,
    private loaderService: LoaderService, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private appsettingConfig: AppsettingService,) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel.DepartmentID = 1;
    
    await this.GetDynamicUploadContentNotificationBTER();
    await this.GetDynamicUploadContentNotificationDTE();
    await this.GetDynamicUploadContentNotificationITI();
    await this.GetDynamicUploadContentNews();
    await this.GetDynamicUploadContentNotificationApprenticeshipList();
    //await this.FilterBTREList('BTER');
    //await this.FilterDteList('DTE');
    //await this.FilterITIList('ITI');


  }


  async GetDynamicUploadContentNotificationBTER() {
    try {
      this.searchRequest.DynamicUploadTypeID = 1; // Only Notifications List For Home Page (DTE,BTER, ITI)
      this.searchRequest.DepartmentSubID = 241; 
      this.searchRequest.Key = 'DynamicUploadShortList';
      this.loaderService.requestStarted();
      await this.home2Service.GetDynamicUploadContent(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BTERList = data.Data;
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

  async GetDynamicUploadContentNotificationDTE() {
    try {
      this.searchRequest.DynamicUploadTypeID = 1; // Only Notifications List For Home Page (DTE,BTER, ITI)
      this.searchRequest.DepartmentSubID = 242; 
      this.searchRequest.Key = 'DynamicUploadShortList';
      this.loaderService.requestStarted();
      await this.home2Service.GetDynamicUploadContent(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DteList = data.Data;
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

  async GetDynamicUploadContentNotificationITI() {
    try {
      this.searchRequest.DynamicUploadTypeID = 5; // Only Notifications List For Home Page (DTE,BTER, ITI)
      this.searchRequest.DepartmentSubID = 243; 
      this.searchRequest.Key = 'DynamicUploadShortList';
      this.loaderService.requestStarted();
      await this.home2Service.GetDynamicUploadContent(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ITIList = data.Data;
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
  async GetDynamicUploadContentNotificationApprenticeshipList() {
    try {
      this.searchRequest.DynamicUploadTypeID = 6; // Only Notifications List For Home Page (DTE,BTER, ITI)
      this.searchRequest.DepartmentSubID = 243; 
      this.searchRequest.Key = 'DynamicUploadShortList';
      this.loaderService.requestStarted();
      await this.home2Service.GetDynamicUploadContent(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ApprenticeshipList = data.Data;
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

  async GetDynamicUploadContentNews() {
    try {
      this.searchRequest.DynamicUploadTypeID = 3; // Only News List For Home Page (DTE,BTER, ITI)
      this.searchRequest.DepartmentSubID = 0; // News for All Department
      this.searchRequest.Key = 'DynamicUploadShortList';
      this.loaderService.requestStarted();
      await this.home2Service.GetDynamicUploadContent(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.NewsList = data.Data;
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


  AdmissionPerByAYoptions: Highcharts.Options = {
    chart: {
      type: 'line',
      height: '200'
    },
    title: { text: '' },
    xAxis: {
      categories: ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26']
    },
    plotOptions: {
      line: {
        dataLabels: { enabled: true },
        enableMouseTracking: false
      }
    },
    series: [{
      name: 'Admission % by AY',
      data: [50000, 35000, 40000, 45000, 60000],
      color: "#ffdde4"
    }] as Highcharts.SeriesOptionsType[]
  };

  AdmissionPerByMgmtTypeoptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 200,
      events: {
        load: function () {
          const chart = this;
          const series = chart.series[0];
          const labelText = 'Total<br/><strong>2 877 820</strong>';

          // Add custom label if not already added
          if (!(chart as any).customLabel) {
            const label = chart.renderer.label(labelText, 0, 0)
              .css({
                color: '#000',
                textAlign: 'center'
              })
              .attr({
                align: 'center',
                zIndex: 5
              })
              .add();
            (chart as any).customLabel = label;
          }

          const label = (chart as any).customLabel;
          const center = (series as any).center;
          const x = center[0] + chart.plotLeft;
          const y = center[1] + chart.plotTop - (label.getBBox().height / 2);

          label.attr({ x, y });
          label.css({ fontSize: `${center[2] / 12}px` });
        },
        redraw: function () {
          const chart = this;
          const series = chart.series[0];
          const label = (chart as any).customLabel;

          if (label) {
            const center = (series as any).center;
            const x = center[0] + chart.plotLeft;
            const y = center[1] + chart.plotTop - (label.getBBox().height / 2);

            label.attr({ x, y });
            label.css({ fontSize: `${center[2] / 12}px` });
          }
        }
      }
    },
    accessibility: {
      point: { valueSuffix: '%' }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      pie: {
        innerSize: '75%',
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: '{point.name}'
          },
          {
            enabled: true,
            distance: -15,
            format: '{point.percentage:.0f}%',
            style: {
              fontSize: '0.9em'
            }
          }
        ]
      }
    },
    series: [{
      type: 'pie',
      name: 'Admission',
      data: [
        { name: 'Private', y: 23.9, color: "#ffdde4" },
        { name: 'Government', y: 12.6, color: "#7d1c2f" }
      ]
    }]
  };

  AdmissionPerByAdmTypeoptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 200,
      events: {
        load: function () {
          const chart = this;
          const series = chart.series[0];
          const labelText = 'Total<br/><strong>2 877 820</strong>';

          if (!(chart as any).customLabel) {
            const label = chart.renderer.label(labelText, 0, 0)
              .css({
                color: '#000',
                textAlign: 'center'
              })
              .attr({
                align: 'center',
                zIndex: 5
              })
              .add();
            (chart as any).customLabel = label;
          }

          const label = (chart as any).customLabel;
          const center = (series as any).center;
          const x = center[0] + chart.plotLeft;
          const y = center[1] + chart.plotTop - (label.getBBox().height / 2);

          label.attr({ x, y });
          label.css({ fontSize: `${center[2] / 12}px` });
        },
        redraw: function () {
          const chart = this;
          const series = chart.series[0];
          const label = (chart as any).customLabel;

          if (label) {
            const center = (series as any).center;
            const x = center[0] + chart.plotLeft;
            const y = center[1] + chart.plotTop - (label.getBBox().height / 2);

            label.attr({ x, y });
            label.css({ fontSize: `${center[2] / 12}px` });
          }
        }
      }
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        innerSize: '75%',
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: '{point.name}'
          },
          {
            enabled: true,
            distance: -15,
            format: '{point.percentage:.0f}%',
            style: {
              fontSize: '0.9em'
            }
          }
        ],
        showInLegend: true
      }
    },
    series: [{
      type: 'pie',
      name: 'Diploma',
      data: [
        {
          name: 'Non-Eng(Dip.)',
          y: 75,
          color: '#ffdde4'
        },
        {
          name: 'Eng(Diploma)',
          y: 25,
          color: '#7d1c2f'
        }
      ]
    }] as Highcharts.SeriesOptionsType[]
  };

  AdmissionByGenderoptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 200,
      events: {
        load: function () {
          const chart = this;
          const series = chart.series[0];
          const labelText = 'Total<br/><strong>2 877 820</strong>';

          if (!(chart as any).customLabel) {
            const label = chart.renderer.label(labelText, 0, 0)
              .css({
                color: '#000',
                textAlign: 'center'
              })
              .attr({
                align: 'center',
                zIndex: 5
              })
              .add();
            (chart as any).customLabel = label;
          }

          const label = (chart as any).customLabel;
          const center = (series as any).center;
          const x = center[0] + chart.plotLeft;
          const y = center[1] + chart.plotTop - (label.getBBox().height / 2);

          label.attr({ x, y });
          label.css({ fontSize: `${center[2] / 12}px` });
        },
        redraw: function () {
          const chart = this;
          const series = chart.series[0];
          const label = (chart as any).customLabel;

          if (label) {
            const center = (series as any).center;
            const x = center[0] + chart.plotLeft;
            const y = center[1] + chart.plotTop - (label.getBBox().height / 2);

            label.attr({ x, y });
            label.css({ fontSize: `${center[2] / 12}px` });
          }
        }
      }
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        borderRadius: 8,
        innerSize: '75%',
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: '{point.name}'
          },
          {
            enabled: true,
            distance: -15,
            format: '{point.percentage:.0f}%',
            style: {
              fontSize: '0.9em'
            }
          }
        ],
        showInLegend: true
      }
    },
    series: [{
      type: 'pie',
      name: 'Gender Wise',
      data: [
        {
          name: 'Male',
          y: 75,
          color: "#ffdde4"
        },
        {
          name: 'Female',
          y: 25,
          color: "#7d1c2f"
        }
      ]
    }] as Highcharts.SeriesOptionsType[]
  };

  AdmissionPerByCategoryoptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: '200'
    },
    xAxis: {
      categories: [
        'GEN', 'SC', 'OBC', 'ST', 'MBC', 'PH'
      ]
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [{
      name: 'Gategories',
      data: [38.88, 24.11, 22.52, 11.26, 2.22, 0],
      color: '#ffdde4'
    }] as Highcharts.SeriesOptionsType[]
  };

  AdmissionPerByDistrictoptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    xAxis: {
      categories: ['Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beaware', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Deeg', 'Dholpur', 'Didwalna-Kuchaman', 'Dudu', 'Dungarpur', 'Shri Ganganagar', 'Gangapur City', 'Hanumangarh', 'Jaipur', 'Jaipur(Rural) ', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Jodhpur(Rural)', 'Karauli', 'Kekri', 'Kherthal-Tijara', 'Kota', 'Kotputli-Behror', 'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumbar', 'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur'],
      crosshair: true,
      accessibility: {
        description: 'Countries'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Admission % By District'
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        name: 'Admission % By District',
        color: '#ffdde4',
        data: [20000, 30000, 40000, 10000, 20000, 30000, 50000, 60000, 60000, 40000, 50000, 60000, 70000, 50000, 20000, 30000, 40000, 60000, 50000, 50000, 40000, 40000, 90000, 60000, 50000, 40000, 40000, 40000, 40000, 30000, 20000, 50000, 40000, 60000, 50000, 70000, 58000, 55000, 12000, 60000, 40000, 70000, 80000, 90000, 50000, 40000, 30000, 20000, 50000, 60000]
      }
    ] as Highcharts.SeriesOptionsType[]
  };

  AdmissionPerbyDistrictAoptions: Highcharts.Options = {

    chart: {
      type: 'column'
    },

    xAxis: {
      categories: ['Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beaware', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Deeg', 'Dholpur', 'Didwalna-Kuchaman', 'Dudu', 'Dungarpur', 'Shri Ganganagar', 'Gangapur City', 'Hanumangarh', 'Jaipur', 'Jaipur(Rural) ', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Jodhpur(Rural)', 'Karauli', 'Kekri', 'Kherthal-Tijara', 'Kota', 'Kotputli-Behror', 'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumbar', 'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur'],
    },

    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: 'Count'
      }
    },

    tooltip: {
      format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
        'Total: {point.stackTotal}'
    },

    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },

    series: [{
      name: 'Private',
      color: '#ffdde4',
      data: [20000, 30000, 40000, 10000, 20000, 30000, 50000, 60000, 60000, 40000, 50000, 60000, 70000, 50000, 20000, 30000, 40000, 60000, 50000, 50000, 40000, 40000, 90000, 60000, 50000, 40000, 40000, 40000, 40000, 30000, 20000, 50000, 40000, 60000, 50000, 70000, 58000, 55000, 12000, 60000, 40000, 70000, 80000, 90000, 50000, 40000, 30000, 20000, 50000, 60000]
    }, {
      name: 'Gorventment',
      color: '#7d1c2f ',
      data: [20000, 30000, 40000, 10000, 20000, 30000, 50000, 60000, 60000, 40000, 50000, 60000, 70000, 50000, 20000, 30000, 40000, 60000, 50000, 50000, 40000, 40000, 90000, 60000, 50000, 40000, 40000, 40000, 40000, 30000, 20000, 50000, 40000, 60000, 50000, 70000, 58000, 55000, 12000, 60000, 40000, 70000, 80000, 90000, 50000, 40000, 30000, 20000, 50000, 60000]
    }] as Highcharts.SeriesOptionsType[]
  };

  AdmissionByBranchoptions: Highcharts.Options = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Ferry passengers by vehicle type 2024',
      align: 'left'
    },
    xAxis: {
      categories: ['CIVIL ENGINEERING', 'ELECTRICAL ENGINEERING', 'ELECTRONICS ENGINEERING', 'INSTRUMENTATION ENGINEERING', 'MECHANICAL(AUTOMOBILE) ENGINEERING', 'MECHANICAL ENGINEERING', 'PRINTING TECHNOLOGY', 'CHEMICAL ENGINEERING', 'ARCHITECTURE', 'COMPUTER SCIENCE & ENGINEERING', 'MECHANICAL(PRODUCTION) ENGINEERING', 'MECHANICAL(R.A.C.) ENGINEERING', 'ELECTRONICS(FIBER OPTICS COMM.) ENGINEERING', 'PLASTIC TECHNOLOGY', 'INFORMATION TECHNOLOGY', 'FD - FASHION DESIGNING', 'HM - HOTEL MANAGEMENT & CATERING TECHNOLOGY', 'CIVIL(CONSTRUCTION) ENGINEERING'
      ]
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [{
      name: 'Government',
      data: [74, 27, 52, 93, 70, 80, 85, 100, 72, 78, 85, 74, 47, 38, 28, 56, 78, 80],
      color: '#7d1c2f'
    }, {
      name: 'Private',
      data: [74, 27, 52, 93, 70, 80, 85, 100, 72, 78, 85, 74, 47, 38, 28, 56, 78, 100],
      color: '#ffdde4'
    }] as Highcharts.SeriesOptionsType[]
  };

  AdmissionPerByInstituteoptions: Highcharts.Options = {
    chart: {
      type: 'bar'
    },
    accessibility: {
      announceNewData: {
        enabled: true
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total percent market share'
      }

    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%'
        }
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: ' +
        '<b>{point.y:.2f}%</b> of total<br/>'
    },

    series: [
      {
        name: 'College Details',
        colorByPoint: true,
        data: [
          {
            name: 'Private College',
            color: '#ffdde4',
            y: 43.06
          },
          {
            name: 'Govt.Polytechnic College, Ajmer',
            color: '#7d1c2f',
            y: 43.06
          },
          {
            name: 'Govt.Polytechnic College, Alwar',
            color: '#7d1c2f',
            y: 33.06
          },
          {
            name: 'Govt.Polytechnic College, Banswara',
            color: '#7d1c2f',
            y: 23.06
          },
          {
            name: 'Govt.Polytechnic College, Barmer',
            color: '#7d1c2f',
            y: 73.06
          },
          {
            name: 'Govt.Polytechnic College, Bharatpur',
            color: '#7d1c2f',
            y: 53.06
          },
          {
            name: 'Govt.Polytechnic College, Bikaner',
            color: '#7d1c2f',
            y: 43.06
          },
          {
            name: 'Govt.Polytechnic College, Chittorgarh',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Khaitan Polytechnic College, Jaipur',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Polytechnic College, Jodhpur',
            color: '#7d1c2f',
            y: 23.06
          },
          {
            name: 'Govt.Polytechnic College, Kota',
            color: '#7d1c2f',
            y: 13.06
          },
          {
            name: 'Govt.Polytechnic College, Pali',
            color: '#7d1c2f',
            y: 83.06
          },
          {
            name: 'Birla Technical Training Institute, Pilani',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Polytechnic College, Sawaimadhopur',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Ch.Maluram Bhambhu Polytechnic College, Shri Ganganagar',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Polytechnic College, Sirohi',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Vidya Bhawan Polytechnic College, Udaipur',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Mahila Polytechnic College, Ajmer',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Mahila Polytechnic College, Bikaner',
            color: '#7d1c2f',
            y: 63.06
          }
        ]
      }
    ] as Highcharts.SeriesOptionsType[],

  };

  AdmissionPerbyDistrictBoptions: Highcharts.Options = {

    chart: {
      type: 'column'
    },

    xAxis: {
      categories: ['Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beaware', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Deeg', 'Dholpur', 'Didwalna-Kuchaman', 'Dudu', 'Dungarpur', 'Shri Ganganagar', 'Gangapur City', 'Hanumangarh', 'Jaipur', 'Jaipur(Rural) ', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Jodhpur(Rural)', 'Karauli', 'Kekri', 'Kherthal-Tijara', 'Kota', 'Kotputli-Behror', 'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumbar', 'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur'],
    },

    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: 'Count'
      }
    },

    tooltip: {
      format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
        'Total: {point.stackTotal}'
    },

    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },

    series: [{
      name: 'Private',
      color: '#ffdde4',
      data: [20000, 30000, 40000, 10000, 20000, 30000, 50000, 60000, 60000, 40000, 50000, 60000, 70000, 50000, 20000, 30000, 40000, 60000, 50000, 50000, 40000, 40000, 90000, 60000, 50000, 40000, 40000, 40000, 40000, 30000, 20000, 50000, 40000, 60000, 50000, 70000, 58000, 55000, 12000, 60000, 40000, 70000, 80000, 90000, 50000, 40000, 30000, 20000, 50000, 60000]
    }, {
      name: 'Gorventment',
      color: '#7d1c2f ',
      data: [20000, 30000, 40000, 10000, 20000, 30000, 50000, 60000, 60000, 40000, 50000, 60000, 70000, 50000, 20000, 30000, 40000, 60000, 50000, 50000, 40000, 40000, 90000, 60000, 50000, 40000, 40000, 40000, 40000, 30000, 20000, 50000, 40000, 60000, 50000, 70000, 58000, 55000, 12000, 60000, 40000, 70000, 80000, 90000, 50000, 40000, 30000, 20000, 50000, 60000]
    }] as Highcharts.SeriesOptionsType[]
  };

  AdmissionByBranchBoptions: Highcharts.Options = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Ferry passengers by vehicle type 2024',
      align: 'left'
    },
    xAxis: {
      categories: ['CIVIL ENGINEERING', 'ELECTRICAL ENGINEERING', 'ELECTRONICS ENGINEERING', 'INSTRUMENTATION ENGINEERING', 'MECHANICAL(AUTOMOBILE) ENGINEERING', 'MECHANICAL ENGINEERING', 'PRINTING TECHNOLOGY', 'CHEMICAL ENGINEERING', 'ARCHITECTURE', 'COMPUTER SCIENCE & ENGINEERING', 'MECHANICAL(PRODUCTION) ENGINEERING', 'MECHANICAL(R.A.C.) ENGINEERING', 'ELECTRONICS(FIBER OPTICS COMM.) ENGINEERING', 'PLASTIC TECHNOLOGY', 'INFORMATION TECHNOLOGY', 'FD - FASHION DESIGNING', 'HM - HOTEL MANAGEMENT & CATERING TECHNOLOGY', 'CIVIL(CONSTRUCTION) ENGINEERING'
      ]
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [{
      name: 'Government',
      data: [74, 27, 52, 93, 70, 80, 85, 100, 72, 78, 85, 74, 47, 38, 28, 56, 78, 80],
      color: '#7d1c2f'
    }, {
      name: 'Private',
      data: [74, 27, 52, 93, 70, 80, 85, 100, 72, 78, 85, 74, 47, 38, 28, 56, 78, 100],
      color: '#ffdde4'
    }] as Highcharts.SeriesOptionsType[]
  };

  AdmissionPerByInstituteBoptions: Highcharts.Options = {
    chart: {
      type: 'bar'
    },
    accessibility: {
      announceNewData: {
        enabled: true
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total percent market share'
      }

    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%'
        }
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: ' +
        '<b>{point.y:.2f}%</b> of total<br/>'
    },

    series: [
      {
        name: 'College Details',
        colorByPoint: true,
        data: [
          {
            name: 'Private College',
            color: '#ffdde4',
            y: 43.06
          },
          {
            name: 'Govt.Polytechnic College, Ajmer',
            color: '#7d1c2f',
            y: 43.06
          },
          {
            name: 'Govt.Polytechnic College, Alwar',
            color: '#7d1c2f',
            y: 33.06
          },
          {
            name: 'Govt.Polytechnic College, Banswara',
            color: '#7d1c2f',
            y: 23.06
          },
          {
            name: 'Govt.Polytechnic College, Barmer',
            color: '#7d1c2f',
            y: 73.06
          },
          {
            name: 'Govt.Polytechnic College, Bharatpur',
            color: '#7d1c2f',
            y: 53.06
          },
          {
            name: 'Govt.Polytechnic College, Bikaner',
            color: '#7d1c2f',
            y: 43.06
          },
          {
            name: 'Govt.Polytechnic College, Chittorgarh',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Khaitan Polytechnic College, Jaipur',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Polytechnic College, Jodhpur',
            color: '#7d1c2f',
            y: 23.06
          },
          {
            name: 'Govt.Polytechnic College, Kota',
            color: '#7d1c2f',
            y: 13.06
          },
          {
            name: 'Govt.Polytechnic College, Pali',
            color: '#7d1c2f',
            y: 83.06
          },
          {
            name: 'Birla Technical Training Institute, Pilani',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Polytechnic College, Sawaimadhopur',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Ch.Maluram Bhambhu Polytechnic College, Shri Ganganagar',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Polytechnic College, Sirohi',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Vidya Bhawan Polytechnic College, Udaipur',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Mahila Polytechnic College, Ajmer',
            color: '#7d1c2f',
            y: 63.06
          },
          {
            name: 'Govt.Mahila Polytechnic College, Bikaner',
            color: '#7d1c2f',
            y: 63.06
          }
        ]
      }
    ] as Highcharts.SeriesOptionsType[],

  };


  ngAfterViewInit(): void {
   // this.initializeCharts();
  }

  ngOnDestroy(): void {
   // this.destroyCharts();
  }

  initializeCharts(): void {
    const ayElement = document.querySelector("#AdmissionPerByAY");
    if (ayElement) {
      this.AdmissionPerByAY = Highcharts.chart(ayElement as HTMLElement, this.AdmissionPerByAYoptions);
    }
    const mgmtTypeElement = document.querySelector("#AdmissionPerByMgmtType");
    if (mgmtTypeElement) {
      this.AdmissionPerByMgmtType = Highcharts.chart(mgmtTypeElement as HTMLElement, this.AdmissionPerByMgmtTypeoptions);
    }
    const mgmtTypeElement1 = document.querySelector("#AdmissionPerByAdmType");
    if (mgmtTypeElement1) {
      this.AdmissionPerByAdmType = Highcharts.chart(mgmtTypeElement1 as HTMLElement, this.AdmissionPerByAdmTypeoptions);
    }
    const mgmtTypeElement2 = document.querySelector("#AdmissionByGender");
    if (mgmtTypeElement2) {
      this.AdmissionByGender = Highcharts.chart(mgmtTypeElement2 as HTMLElement, this.AdmissionByGenderoptions);
    }
    const mgmtTypeElement3 = document.querySelector("#AdmissionPerByCategory");
    if (mgmtTypeElement3) {
      this.AdmissionPerByCategory = Highcharts.chart(mgmtTypeElement3 as HTMLElement, this.AdmissionPerByCategoryoptions);
    }
    const mgmtTypeElement4 = document.querySelector("#AdmissionPerByDistrict");
    if (mgmtTypeElement4) {
      this.AdmissionPerByDistrict = Highcharts.chart(mgmtTypeElement4 as HTMLElement, this.AdmissionPerByDistrictoptions);
    }
    const mgmtTypeElement5 = document.querySelector("#AdmissionPerbyDistrictA");
    if (mgmtTypeElement5) {
      this.AdmissionPerbyDistrictA = Highcharts.chart(mgmtTypeElement5 as HTMLElement, this.AdmissionPerbyDistrictAoptions);
    }
    const mgmtTypeElement6 = document.querySelector("#AdmissionByBranch");
    if (mgmtTypeElement6) {
      this.AdmissionByBranch = Highcharts.chart(mgmtTypeElement6 as HTMLElement, this.AdmissionByBranchoptions);
    }
    const mgmtTypeElement7 = document.querySelector("#AdmissionPerByInstitute");
    if (mgmtTypeElement7) {
      this.AdmissionPerByInstitute = Highcharts.chart(mgmtTypeElement7 as HTMLElement, this.AdmissionPerByInstituteoptions);
    }
    const mgmtTypeElement8 = document.querySelector("#AdmissionPerbyDistrictB");
    if (mgmtTypeElement8) {
      this.AdmissionPerbyDistrictB = Highcharts.chart(mgmtTypeElement8 as HTMLElement, this.AdmissionPerbyDistrictBoptions);
    }
    const mgmtTypeElement9 = document.querySelector("#AdmissionByBranchB");
    if (mgmtTypeElement9) {
      this.AdmissionByBranchB = Highcharts.chart(mgmtTypeElement9 as HTMLElement, this.AdmissionByBranchBoptions);
    }
    const mgmtTypeElement10 = document.querySelector("#AdmissionPerByInstitute");
    if (mgmtTypeElement10) {
      this.AdmissionPerByInstitute = Highcharts.chart(mgmtTypeElement10 as HTMLElement, this.AdmissionPerByInstituteoptions);
    }
  }

  destroyCharts(): void {
    if (this.AdmissionPerByAY) {
      this.AdmissionPerByAY.destroy();
    }
    if (this.AdmissionPerByMgmtType) {
      this.AdmissionPerByMgmtType.destroy();
    }
    if (this.AdmissionPerByAdmType) {
      this.AdmissionPerByAdmType.destroy();
    }
    if (this.AdmissionByGender) {
      this.AdmissionByGender.destroy();
    }
    if (this.AdmissionPerByCategory) {
      this.AdmissionPerByCategory.destroy();
    }
    if (this.AdmissionPerByDistrict) {
      this.AdmissionPerByDistrict.destroy();
    }
    if (this.AdmissionPerbyDistrictA) {
      this.AdmissionPerbyDistrictA.destroy();
    }
    if (this.AdmissionByBranch) {
      this.AdmissionByBranch.destroy();
    }
    if (this.AdmissionPerByInstitute) {
      this.AdmissionPerByInstitute.destroy();
    }
    if (this.AdmissionPerbyDistrictB) {
      this.AdmissionPerbyDistrictB.destroy();
    }
    if (this.AdmissionByBranchB) {
      this.AdmissionByBranchB.destroy();
    }
    if (this.AdmissionPerByInstitute) {
      this.AdmissionPerByInstitute.destroy();
    }
  }

}
