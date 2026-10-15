import { Component, OnInit } from '@angular/core';
import {
  Chart, ChartConfiguration, ChartOptions,
  LinearScale, CategoryScale, BarController, BarElement, LineController, LineElement,
  PointElement, ArcElement, DoughnutController, Tooltip, Legend, Filler
} from 'chart.js';
import { AdminDashboardDataService } from '../../Services/AdminDashboard/admin-dashboard-data.service';

Chart.register(
  LinearScale, CategoryScale, BarController, BarElement, LineController, LineElement,
  PointElement, ArcElement, DoughnutController, Tooltip, Legend, Filler
);

type Row = Record<string, any>;
type LegendItem = { label: string; color: string };

const TEAL = '#00897b';
const BLUE = '#176087';
const PALETTE = ['#176087', '#00897b', '#e67e22', '#d4ac0d', '#102a43', '#8e44ad', '#16a085', '#c0392b'];

const num = (v: unknown): number => Number(v) || 0;

/** Minimum pixel width per bar/label so the chart scrolls horizontally when data grows. */
const PX_PER_ITEM = { institute: 30, pass: 44, vacancy: 80, enrolment: 24 };

/** Shared bar options; each chart only passes what differs. */
function barOptions(yTitle: string, overrides: { yMax?: number; tooltip?: any; legend?: boolean; rotate?: number } = {}): ChartOptions<'bar'> {
  const { yMax, tooltip, legend = false, rotate = 45 } = overrides;
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: legend, position: 'bottom' }, tooltip },
    scales: {
      x: {
        grid: { display: false },
        ticks: { autoSkip: false, maxRotation: rotate, minRotation: 0 }
      },
      y: {
        beginAtZero: true,
        ...(yMax ? { max: yMax, ticks: { stepSize: 20, callback: (v) => `${v}%` } } : { ticks: { precision: 0 } }),
        title: { display: true, text: yTitle }
      }
    }
  };
}

@Component({
  selector: 'app-analytic-dashboard',
  standalone: false,
  templateUrl: './analytic-dashboard.component.html',
  styleUrl: './analytic-dashboard.component.css'
})
export class AnalyticDashboardComponent implements OnInit {
  UpperTilesData: Row[] = [];

  // Dynamic min-widths (px) for horizontally scrollable charts
  instituteWidth = 0;
  passWidth = 0;
  vacancyWidth = 0;
  enrolmentWidth = 0;

  genderLegend: LegendItem[] = [];
  categoryLegend: LegendItem[] = [];

  // ---------- Chart data ----------
  instituteChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  genderChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  categoryChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  passChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  vacancyChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  // ---------- Chart options ----------
  instituteChartOptions = barOptions('Number of Institutions', {
    tooltip: { callbacks: { label: (c: any) => `Institutions: ${c.parsed.y}` } }
  });

  passChartOptions = barOptions('Pass Percentage (%)', {
    yMax: 100,
    rotate: 35,
    tooltip: { callbacks: { label: (c: any) => `Pass Percentage: ${c.parsed.y}%` } }
  });

  vacancyChartOptions = barOptions('Number of Posts', {
    legend: true,
    rotate: 45,
    tooltip: { mode: 'index', intersect: false }
  });

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: 'Total Students' } },
      x: { title: { display: true, text: 'Academic Year' } }
    }
  };

  // Legend is rendered in HTML (Tailwind) so the layout stays responsive
  doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { display: false } }
  };

  constructor(private dashboardService: AdminDashboardDataService) {}

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  private async loadDashboard(): Promise<void> {
    try {
      const res: any = await this.dashboardService.GetExecutiveDashboard_StateLevel_Web({});
      const d = res?.Data ?? {};

      this.UpperTilesData = d['Table'] ?? [];
      this.buildInstituteChart(d['Table1'] ?? []);
      this.buildPassChart(d['Table2'] ?? []);
      this.buildVacancyChart(d['Table3'] ?? []);
      this.buildEnrollmentChart(d['Table4'] ?? []);
      this.buildCategoryChart(d['Table5'] ?? []);
      this.buildGenderChart(d['Table6'] ?? []);
    } catch (err) {
      console.error('Failed to load analytic dashboard', err);
    }
  }

  private buildInstituteChart(rows: Row[]): void {
    this.instituteChartData = {
      labels: rows.map(r => r['DistrictName']),
      datasets: [{
        label: 'Institutions',
        data: rows.map(r => num(r['InstituteCount'])),
        backgroundColor: '#008F83',
        hoverBackgroundColor: '#00796B',
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 14
      }]
    };
    this.instituteWidth = rows.length * PX_PER_ITEM.institute;
  }

  private buildPassChart(rows: Row[]): void {
    this.passChartData = {
      labels: rows.map(r => r['StreamCode']),
      datasets: [{
        label: 'Pass Percentage',
        data: rows.map(r => num(r['PassPercentage'])),
        backgroundColor: TEAL,
        borderRadius: 4,
        maxBarThickness: 20
      }]
    };
    this.passWidth = rows.length * PX_PER_ITEM.pass;
  }

  private buildVacancyChart(rows: Row[]): void {
    this.vacancyChartData = {
      labels: rows.map(r => r['PostName']),
      datasets: [{
        label: 'Total Vacancy',
        data: rows.map(r => num(r['TotalVacancy'])),
        backgroundColor: BLUE,
        borderRadius: 4,
        maxBarThickness: 20
      }]
    };
    this.vacancyWidth = rows.length * PX_PER_ITEM.vacancy;
  }

  private buildEnrollmentChart(rows: Row[]): void {
    this.lineChartData = {
      labels: rows.map(r => r['AcademicYear']),
      datasets: [{
        label: 'Total Students',
        data: rows.map(r => num(r['TotalStudents'])),
        borderColor: TEAL,
        backgroundColor: 'rgba(0, 137, 123, 0.1)',
        fill: true,
        tension: 0.1,
        pointBackgroundColor: TEAL,
        pointRadius: 4
      }]
    };
    this.enrolmentWidth = rows.length * PX_PER_ITEM.enrolment;
  }

  private buildGenderChart(rows: Row[]): void {
    const labels = rows.map(r => `${r['GenderName']} (${r['Percentage']}%)`);
    this.genderChartData = {
      labels,
      datasets: [{ data: rows.map(r => num(r['Percentage'])), backgroundColor: PALETTE }]
    };
    this.genderLegend = labels.map((label, i) => ({ label, color: PALETTE[i % PALETTE.length] }));
  }

  private buildCategoryChart(rows: Row[]): void {
    const labels = rows.map(r => r['CategoryName']);
    this.categoryChartData = {
      labels,
      datasets: [{ data: rows.map(r => num(r['Percentage'])), backgroundColor: PALETTE }]
    };
    this.categoryLegend = labels.map((label, i) => ({ label, color: PALETTE[i % PALETTE.length] }));
  }
}
