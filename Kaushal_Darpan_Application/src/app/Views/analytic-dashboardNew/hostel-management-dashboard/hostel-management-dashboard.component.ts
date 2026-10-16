import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ITIAdminDashboardServiceService } from '../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { AdminDashboardDataService } from '../../../Services/AdminDashboard/admin-dashboard-data.service';
import { EnumRole } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

Chart.register(...registerables);

interface College {
  name: string;
  capacity: number;
  occupied: number;
  fee: number;
  complaints: number;
}

interface DashboardData {
  capacity: number;
  occupied: number;
  feeRate: number;
  openComplaints: number;
  occupancy: number[];
  feeBilled: number[];
  feeCollected: number[];
  colleges: College[];
  complaintStatus: number[];
}


@Component({
  selector: 'app-hostel-management-dashboard',
  standalone: false,
  templateUrl: './hostel-management-dashboard.component.html',
  styleUrl: './hostel-management-dashboard.component.css'
})


export class HostelManagementDashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('occupancyCanvas')
  occupancyCanvas!: ElementRef<HTMLCanvasElement>;
  public dashboardData:any[]=[]
  @ViewChild('feeCanvas')
  feeCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('collegeCanvas')
  collegeCanvas!: ElementRef<HTMLCanvasElement>;
  public complaintData: any[] = [];
  @ViewChild('complaintCanvas')
  complaintCanvas!: ElementRef<HTMLCanvasElement>;
  public sSOLoginDataModel = new SSOLoginDataModel();
  selectedRole = 'university';
  selectedCollege = 0
  public feeTrend: any[] = [];
  public statusData: any[] = [];
  occupancyChart?: Chart;
  public collegeData: any[] = [];
  public InstituteMasterList: any[] = [];
  feeChart?: Chart;
  collegeChart?: Chart;
  complaintChart?: Chart;
  public kpi = { capacity: 0, occupied: 0, feePending: 0, openComplaints: 0 };
  readonly months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  readonly kpiColor: Record<string, string> = {
    TotalBedCapacity: 'blue',
    TotalBedOccupied: 'green',
    TotalFeePending: '',
    OpenComplain: 'orange'
  };

  readonly kpiNote: Record<string, string> = {
    TotalBedCapacity: 'Total seats across all rooms',
    TotalBedOccupied: '',                       // shows occupancy % from the template
    TotalFeePending: 'Awaiting payment',
    OpenComplain: 'Awaiting resolution'
  };
  readonly datasets: Record<string, DashboardData> = {
    all: {
      capacity: 12500,
      occupied: 10875,
      feeRate: 92,
      openComplaints: 146,
      occupancy: [10875, 1625],
      feeBilled: [90, 125, 145, 160, 165, 175],
      feeCollected: [72, 110, 135, 148, 155, 168],
      colleges: [
        {
          name: 'Engineering College',
          capacity: 4000,
          occupied: 3680,
          fee: 94,
          complaints: 42
        },
        {
          name: 'Medical College',
          capacity: 2500,
          occupied: 2200,
          fee: 96,
          complaints: 24
        },
        {
          name: 'Arts & Science College',
          capacity: 3000,
          occupied: 2280,
          fee: 86,
          complaints: 51
        },
        {
          name: 'Management College',
          capacity: 1500,
          occupied: 1035,
          fee: 89,
          complaints: 18
        },
        {
          name: 'Science College',
          capacity: 1500,
          occupied: 1380,
          fee: 91,
          complaints: 11
        }
      ],
      complaintStatus: [146, 62, 210, 18]
    },

    engineering: {
      capacity: 4000,
      occupied: 3680,
      feeRate: 94,
      openComplaints: 42,
      occupancy: [3680, 320],
      feeBilled: [30, 40, 45, 48, 50, 55],
      feeCollected: [26, 36, 43, 45, 48, 52],
      colleges: [
        {
          name: 'Engineering College',
          capacity: 4000,
          occupied: 3680,
          fee: 94,
          complaints: 42
        }
      ],
      complaintStatus: [42, 16, 72, 5]
    },

    medical: {
      capacity: 2500,
      occupied: 2200,
      feeRate: 96,
      openComplaints: 24,
      occupancy: [2200, 300],
      feeBilled: [20, 28, 32, 35, 37, 40],
      feeCollected: [18, 27, 31, 34, 36, 39],
      colleges: [
        {
          name: 'Medical College',
          capacity: 2500,
          occupied: 2200,
          fee: 96,
          complaints: 24
        }
      ],
      complaintStatus: [24, 8, 41, 2]
    },

    arts: {
      capacity: 3000,
      occupied: 2280,
      feeRate: 86,
      openComplaints: 51,
      occupancy: [2280, 720],
      feeBilled: [22, 30, 36, 39, 40, 42],
      feeCollected: [16, 24, 30, 34, 34, 36],
      colleges: [
        {
          name: 'Arts & Science College',
          capacity: 3000,
          occupied: 2280,
          fee: 86,
          complaints: 51
        }
      ],
      complaintStatus: [51, 23, 65, 9]
    }
  };

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private dashboardservice: AdminDashboardDataService,
    private commonMasterService: CommonFunctionService
  ) { }


  async ngOnInit() {

      this.sSOLoginDataModel = JSON.parse(localStorage.getItem('SSOLoginUser') || 'null');

    if (this.sSOLoginDataModel.RoleID == 7) {
      this.selectedRole ='college'
    }
    this.selectedCollege = this.sSOLoginDataModel.InstituteID
      // load the date config first, then the dashboard data (or run together with Promise.all)
  
    await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, 0)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

       
          this.InstituteMasterList = data['Data'];
          //this.request.InstituteID = 0
        
      }, (error: any) => console.error(error));
        this.getdashdata()
    

}

  async getdashdata() {
    try {
      const obj = {
        RoleID: this.sSOLoginDataModel.RoleID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        InstituteID: this.selectedCollege,
        UserID: this.sSOLoginDataModel.UserID,
        FinancialYearID: this.sSOLoginDataModel.FinancialYearID
      };

      const data: any = await this.dashboardservice.GetBterHostelHouseDashboard(obj);

      // works for DataSet ({ Table: [...] }) and for a plain DataTable (array)
      const rows: any[] = data?.Data?.Table ?? (Array.isArray(data?.Data) ? data.Data : []);
      this.dashboardData = rows;

      this.statusData = data?.Data?.Table2 ?? [];
      this.complaintData = data?.Data?.Table3 ?? [];
      this.collegeData = data?.Data?.Table4 ?? [];
      const val = (type: string) =>
        Number(rows.find(r => r.ListType === type)?.TotalCount ?? 0);

      this.kpi = {
        capacity: val('TotalBedCapacity'),
        occupied: val('TotalBedOccupied'),
        feePending: val('TotalFeePending'),
        openComplaints: val('OpenComplain')
      };
      this.feeTrend = data?.Data?.Table1 ?? [];
      this.updateCharts();          // refresh the doughnut with real values
      this.cdr.markForCheck();
    } catch (ex) {
      console.log(ex);
    }
  }
  get dashboard(): DashboardData {
    return this.datasets[this.selectedCollege] ?? this.datasets['all'];
  }

  get occupancyPercentage(): number {
    return this.kpi.capacity
      ? Math.round((this.kpi.occupied / this.kpi.capacity) * 100)
      : 0;
  }

  get tableRows(): Array<{
    name: string; capacity: number; occupied: number;
    occupancy: number; status: string; statusClass: string;
  }> {
    return this.collegeData.map(r => {
      const occupancy = Number(r.OccupancyPercent);

      let status = 'Attention';
      let statusClass = 'danger';
      if (occupancy >= 90) { status = 'Good'; statusClass = 'good'; }
      else if (occupancy >= 75) { status = 'Needs Review'; statusClass = 'warning'; }

      return {
        name: r.CollegeName,
        capacity: Number(r.TotalSeats),
        occupied: Number(r.StudentsOccupied),
        occupancy,
        status,
        statusClass
      };
    });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initializeCharts();
      this.updateCharts();
    });
  }
  get statusChartHeight(): number {
    return Math.max(300, this.statusData.length * 34);
  }
  onCollegeChange(): void {
    this.getdashdata()
    this.updateCharts();
  }
  private statusColor(name: string): string {
    const n = (name || '').toLowerCase();
    if (/reject|withdraw|deallocat|objection/.test(n)) return '#ef4444';
    if (/alloted|approved|published final/.test(n)) return '#10b981';
    if (/applied|uploaded|provisional/.test(n)) return '#3b82f6';
    return '#f59e0b';
  }

  // draws the number at the end of each bar (also shows 0)
  private readonly valueLabels = {
    id: 'valueLabels',
    afterDatasetsDraw: (chart: any) => {
      const ctx = chart.ctx;
      ctx.save();
      ctx.font = '600 12px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.textBaseline = 'middle';
      chart.getDatasetMeta(0).data.forEach((bar: any, i: number) => {
        ctx.fillText(String(chart.data.datasets[0].data[i] ?? 0), bar.x + 6, bar.y);
      });
      ctx.restore();
    }
  };
  onRoleChange(): void {
    this.selectedCollege =
      this.selectedRole === 'college' ? 1 : 0;
    this.getdashdata()
    this.cdr.markForCheck();
    this.updateCharts();
  }

  private initializeCharts(): void {
    // Avoid creating duplicate Chart.js instances.
    this.destroyCharts();

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      resizeDelay: 100,
      devicePixelRatio: 1,
      events: ['mousemove', 'click', 'touchstart', 'touchmove'],
      plugins: {
        legend: {
          labels: {
            boxWidth: 12,
            padding: 12
          }
        }
      }
    };

    this.occupancyChart = new Chart(
      this.occupancyCanvas.nativeElement,
      {
        type: 'doughnut',
        data: {
          labels: ['Students Occupied', 'Seats Vacant'],
          datasets: [{
            data: [0, 0],
            backgroundColor: ['#2563eb', '#e2e8f0'],
            borderWidth: 0,
            hoverOffset: 3
          }]
        },
        options: {
          ...commonOptions,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, padding: 12 }
            }
          }
        }
      } as ChartConfiguration<'doughnut'>
    );

    this.feeChart = new Chart(
      this.feeCanvas.nativeElement,
      {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Total Seats',
              data: [],
              backgroundColor: '#94a3b8',
              borderRadius: 3
            },
            {
              label: 'Students Occupied',
              data: [],
              backgroundColor: '#2563eb',
              borderRadius: 3
            }
          ]
        },
        options: {
          ...commonOptions,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, padding: 12 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { maxTicksLimit: 6, precision: 0 }
            }
          }
        } as ChartConfiguration<'bar'>['options']
      }
    );

    this.collegeChart = new Chart(
      this.collegeCanvas.nativeElement,
      {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Students',
            data: [],
            backgroundColor: [],
            borderRadius: 4,
            maxBarThickness: 18
          }]
        },
        options: {
          ...commonOptions,
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: {
              beginAtZero: true,
              grace: '10%',
              grid: { color: '#eef2f7' },
              ticks: { maxTicksLimit: 6, precision: 0 }
            },
            y: {
              grid: { display: false },
              ticks: { autoSkip: false, font: { size: 12 } }   // show every status name
            }
          }
        } as ChartConfiguration<'bar'>['options'],
        plugins: [this.valueLabels]
      }
    );

    this.complaintChart = new Chart(
      this.complaintCanvas.nativeElement,
      {
        type: 'bar',
        data: {
          labels: ['Open', 'In Progress', 'Resolved', 'Escalated'],
          datasets: [{
            label: 'Complaints',
            data: [],
            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
            borderRadius: 3,
            barThickness: 28
          }]
        },
        options: {
          ...commonOptions,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { maxTicksLimit: 6 }
            }
          }
        } as ChartConfiguration<'bar'>['options']
      }
    );
  }

  private updateCharts(): void {
    const data = this.dashboard;

    if (this.occupancyChart) {
      this.occupancyChart.data.datasets[0].data = [
        this.kpi.occupied,
        Math.max(this.kpi.capacity - this.kpi.occupied, 0)
      ];
      this.occupancyChart.update('none');
    }

    if (this.feeChart) {
      this.feeChart.data.labels = this.feeTrend.map(r => r.HostelName);
      this.feeChart.data.datasets[0].data = this.feeTrend.map(r => Number(r.TotalSeats));
      this.feeChart.data.datasets[1].data = this.feeTrend.map(r => Number(r.StudentsOccupied));
      this.feeChart.update('none');
    }

    if (this.collegeChart) {
      this.collegeChart.data.labels = this.statusData.map(r => r.StatusName);
      this.collegeChart.data.datasets[0].data = this.statusData.map(r => Number(r.TotalStudents));
      (this.collegeChart.data.datasets[0] as any).backgroundColor =
        this.statusData.map(r => this.statusColor(r.StatusName));
      this.collegeChart.update('none');
      this.collegeChart.resize();      // needed because the card height changes with the data
    }

    if (this.complaintChart) {
      this.complaintChart.data.labels = this.complaintData.map(r => r.StatusName);
      this.complaintChart.data.datasets[0].data = this.complaintData.map(r => Number(r.TotalComplaints));
      this.complaintChart.update('none');
    }

    this.cdr.markForCheck();
  }

  trackByCollege(index: number, row: any): string {
    return row.name;
  }

  private destroyCharts(): void {
    this.occupancyChart?.destroy();
    this.feeChart?.destroy();
    this.collegeChart?.destroy();
    this.complaintChart?.destroy();

    this.occupancyChart = undefined;
    this.feeChart = undefined;
    this.collegeChart = undefined;
    this.complaintChart = undefined;
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }



}







 
