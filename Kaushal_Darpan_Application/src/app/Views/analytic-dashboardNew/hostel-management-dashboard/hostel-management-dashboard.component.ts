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

  @ViewChild('feeCanvas')
  feeCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('collegeCanvas')
  collegeCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('complaintCanvas')
  complaintCanvas!: ElementRef<HTMLCanvasElement>;

  selectedRole = 'university';
  selectedCollege = 'all';

  occupancyChart?: Chart;
  feeChart?: Chart;
  collegeChart?: Chart;
  complaintChart?: Chart;

  readonly months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
    private cdr: ChangeDetectorRef
  ) { }

  get dashboard(): DashboardData {
    return this.datasets[this.selectedCollege] ?? this.datasets['all'];
  }

  get occupancyPercentage(): number {
    const data = this.dashboard;

    return data.capacity
      ? Math.round((data.occupied / data.capacity) * 100)
      : 0;
  }

  get tableRows(): Array<College & {
    occupancy: number;
    status: string;
    statusClass: string;
  }> {
    return this.dashboard.colleges.map(college => {
      const occupancy = college.capacity
        ? Math.round((college.occupied / college.capacity) * 100)
        : 0;

      let status = 'Attention';
      let statusClass = 'danger';

      if (occupancy >= 90 && college.fee >= 90) {
        status = 'Good';
        statusClass = 'good';
      } else if (occupancy >= 75) {
        status = 'Needs Review';
        statusClass = 'warning';
      }

      return {
        ...college,
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

  onCollegeChange(): void {
    this.updateCharts();
  }

  onRoleChange(): void {
    this.selectedCollege =
      this.selectedRole === 'college' ? 'engineering' : 'all';

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
          labels: ['Occupied', 'Vacant'],
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
        type: 'line',
        data: {
          labels: this.months,
          datasets: [
            {
              label: 'Billed',
              data: [],
              borderColor: '#94a3b8',
              backgroundColor: '#94a3b8',
              tension: 0.25,
              pointRadius: 2,
              borderWidth: 2
            },
            {
              label: 'Collected',
              data: [],
              borderColor: '#059669',
              backgroundColor: '#059669',
              tension: 0.25,
              pointRadius: 2,
              borderWidth: 2
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
              ticks: { maxTicksLimit: 6 }
            }
          }
        } as ChartConfiguration<'line'>['options']
      }
    );

    this.collegeChart = new Chart(
      this.collegeCanvas.nativeElement,
      {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Occupancy %',
            data: [],
            backgroundColor: '#3b82f6',
            borderRadius: 3,
            barThickness: 20
          }]
        },
        options: {
          ...commonOptions,
          indexAxis: 'y',
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              ticks: {
                maxTicksLimit: 6,
                callback: value => `${value}%`
              }
            }
          }
        } as ChartConfiguration<'bar'>['options']
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
      this.occupancyChart.data.datasets[0].data = [...data.occupancy];
      this.occupancyChart.update('none');
    }

    if (this.feeChart) {
      this.feeChart.data.datasets[0].data = [...data.feeBilled];
      this.feeChart.data.datasets[1].data = [...data.feeCollected];
      this.feeChart.update('none');
    }

    if (this.collegeChart) {
      this.collegeChart.data.labels = data.colleges.map(c => c.name);
      this.collegeChart.data.datasets[0].data = data.colleges.map(c =>
        Math.min(
          100,
          Math.round((c.occupied / c.capacity) * 100)
        )
      );
      this.collegeChart.update('none');
    }

    if (this.complaintChart) {
      this.complaintChart.data.datasets[0].data = [
        ...data.complaintStatus
      ];
      this.complaintChart.update('none');
    }

    this.cdr.markForCheck();
  }

  trackByCollege(index: number, college: College): string {
    return college.name;
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







 
