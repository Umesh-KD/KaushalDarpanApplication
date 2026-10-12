import { Component } from '@angular/core';
import { AnalyticDashboardService } from '../../Services/AnalyticDashboard/analytic-dashboard.service';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import {
  Chart,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend
} from 'chart.js';
import { AdminDashboardDataService } from '../../Services/AdminDashboard/admin-dashboard-data.service';

Chart.register(
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-analytic-dashboard',
  standalone: false,
  templateUrl: './analytic-dashboard.component.html',
  styleUrl: './analytic-dashboard.component.css'
})
export class AnalyticDashboardComponent {
  dashboardData: any = null;

  UpperTilesData: any[] = []
  InstituteDistributionList: any[] = []
  BranchPassPerList: any[] = []
  VacancyList: any[] = []
  EnrollmentYearStudentList: any[] = []
  StudentCategoryList: any[] = []
  GenderRationList: any[] = []

  public maxInstituteCount = 0;

  // --- Line Chart: Enrolment Year Wise ---
  public lineChartData: ChartConfiguration<'line'>['data'] = {
  labels: [],
  datasets: [
    {
      data: [],
      label: 'Enrolment Year Wise',
      borderColor: '#00897b',
      backgroundColor: 'rgba(0, 137, 123, 0.1)',
      fill: true,
      tension: 0.1,
      pointBackgroundColor: '#00897b',
      pointRadius: 4
    }
  ]
};
  public lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      },
      title: {
        display: true,
        text: 'Total Students'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Academic Year'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};
 
  // --- Doughnut Chart 1: Student Category Distribution ---
private studentCategoryColors: string[] = [
  '#176087',
  '#00897b',
  '#e67e22',
  '#d4ac0d',
  '#102a43',
  '#8e44ad',
  '#16a085',
  '#c0392b'
];

public studentCategoryData: ChartConfiguration<'doughnut'>['data'] = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: this.studentCategoryColors
    }
  ]
};
 
  // --- Doughnut Chart 2: Gender Ratio ---
  public genderRatioData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#176087', '#e67e22', '#00897b']
    }]
  };
 
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { position: 'right' }
    }
  };

  // 1. Branch-wise Pass Percentage Chart
  public branchPassPercentageData: ChartConfiguration<'bar'>['data'] = {
  labels: [],
  datasets: [
    {
      label: 'Pass Percentage',
      data: [],
      backgroundColor: '#00897b',
      borderRadius: 5,
      barThickness: 24
    }
  ]
};

  public branchPassPercentageOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'x',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) =>
          `Pass Percentage: ${context.parsed.y}%`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
        callback: (value) => `${value}%`
      },
      title: {
        display: true,
        text: 'Pass Percentage (%)'
      }
    },
    x: {
      ticks: {
        autoSkip: false,
        maxRotation: 35,
        minRotation: 0
      }
    }
  }
};

  // 2. Vacancy Position Chart
  public vacancyPositionData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Total Vacancy',
        data: [],
        backgroundColor: '#176087',
        borderRadius: 4
      },
    ]
  };

  public vacancyPositionOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        stacked: false,
        ticks: {
          autoSkip: false,
          maxRotation: 30,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        },
        title: {
          display: true,
          text: 'Number of Posts'
        }
      }
    }
  };

 
  constructor(
    private analyticDashboardService: AnalyticDashboardService,
    private AdminDashboardDataService: AdminDashboardDataService,
  ) {}
 
  async ngOnInit() {
    await this.GetAnalyticDashboard();
    
  }

  async GetAnalyticDashboard() {
    const searchRequest: any = {}
    await this.AdminDashboardDataService.GetExecutiveDashboard_StateLevel_Web(searchRequest).then((data: any) => {
      this.dashboardData = data.Data;
      this.UpperTilesData=data.Data["Table"]
      this.InstituteDistributionList=data.Data["Table1"]
      this.BranchPassPerList=data.Data["Table2"]
      this.VacancyList=data.Data["Table3"]
      this.EnrollmentYearStudentList=data.Data["Table4"]
      this.StudentCategoryList=data.Data["Table5"]
      this.GenderRationList=data.Data["Table6"]

      this.setGenderRatioChartData();
      this.setVacancyChartData();
      this.setEnrollmentChartData();
      this.setBranchPassPercentageChartData();
      this.setInstituteDistributionChart();
      this.setStudentCategoryChartData();
    })
  }

  setVacancyChartData(): void {
    if (!this.VacancyList?.length) {
      this.vacancyPositionData = {
        labels: [],
        datasets: [{
          label: 'Total Vacancy',
          data: [],
          backgroundColor: '#176087',
          borderRadius: 4
        }]
      };
      return;
    }

    this.vacancyPositionData = {
      labels: this.VacancyList.map(
        (item: any) => item.PostName
      ),
      datasets: [{
        label: 'Total Vacancy',
        data: this.VacancyList.map(
          (item: any) => Number(item.TotalVacancy) || 0
        ),
        backgroundColor: '#176087',
        borderRadius: 4
      }]
    };
  }

  setGenderRatioChartData(): void {
    if (!this.GenderRationList?.length) {
      this.genderRatioData = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: []
        }]
      };
      return;
    }

    this.genderRatioData = {
      labels: this.GenderRationList.map(
        (item: any) => `${item.GenderName} (${item.Percentage}%)`
      ),
      datasets: [{
        data: this.GenderRationList.map(
          (item: any) => Number(item.Percentage) || 0
        ),
        backgroundColor: ['#176087', '#00897b', '#e67e22']
      }]
    };
  }

  setEnrollmentChartData(): void {
  if (!this.EnrollmentYearStudentList?.length) {
    this.lineChartData = {
      labels: [],
      datasets: [{
        data: [],
        label: 'Enrolment Year Wise',
        borderColor: '#00897b',
        backgroundColor: 'rgba(0, 137, 123, 0.1)',
        fill: true,
        tension: 0.1,
        pointBackgroundColor: '#00897b',
        pointRadius: 4
      }]
    };
    return;
  }

  this.lineChartData = {
    labels: this.EnrollmentYearStudentList.map(
      (item: any) => item.AcademicYear
    ),
    datasets: [{
      data: this.EnrollmentYearStudentList.map(
        (item: any) => Number(item.TotalStudents) || 0
      ),
      label: 'Total Students',
      borderColor: '#00897b',
      backgroundColor: 'rgba(0, 137, 123, 0.1)',
      fill: true,
      tension: 0.1,
      pointBackgroundColor: '#00897b',
      pointRadius: 4
    }]
  };
}

setBranchPassPercentageChartData(): void {
  if (!this.BranchPassPerList?.length) {
    this.branchPassPercentageData = {
      labels: [],
      datasets: [
        {
          label: 'Pass Percentage',
          data: [],
          backgroundColor: '#00897b',
          borderRadius: 5,
          barThickness: 24
        }
      ]
    };
    return;
  }

  this.branchPassPercentageData = {
    labels: this.BranchPassPerList.map(
      (item: any) => item.StreamCode
    ),
    datasets: [
      {
        label: 'Pass Percentage',
        data: this.BranchPassPerList.map(
          (item: any) => Number(item.PassPercentage) || 0
        ),
        backgroundColor: '#00897b',
        borderRadius: 5,
        barThickness: 24
      }
    ]
  };
}

setStudentCategoryChartData(): void {
  if (!this.StudentCategoryList?.length) {
    this.studentCategoryData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: []
        }
      ]
    };
    return;
  }

  this.studentCategoryData = {
  labels: this.StudentCategoryList.map(
    (item: any) => item.CategoryName
  ),
  datasets: [
    {
      data: this.StudentCategoryList.map(
        (item: any) => Number(item.Percentage) || 0
      ),
      backgroundColor: this.studentCategoryColors
    }
  ]
};
}

setInstituteDistributionChart(): void {
  if (!this.InstituteDistributionList?.length) {
    this.maxInstituteCount = 0;
    return;
  }

  this.maxInstituteCount = Math.max(
    ...this.InstituteDistributionList.map(
      (item: any) => Number(item.InstituteCount) || 0
    )
  );
}
}