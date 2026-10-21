import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as d3 from 'd3';
import { Chart, registerables, Plugin } from 'chart.js';
Chart.register(...registerables);

import { ToastrService } from 'ngx-toastr';
import { DteTradeEquipmentsMappingService } from '../../Services/DTEInventory/DTETradeEquipmentsMapping/dtetrade-equipments-mapping.service';
import { DTEEquipmentsMasterService } from '../../Services/DTEInventory/DTEEquipmentsMaster/dteequipments-master.service';
import { DTEItemCategoriesMasterService } from '../../Services/DTEInventory/DTEItemCategoriesMaster/dteItemcategories-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { InventoryDashDynamicDataModel } from '../../Models/DTEInventory/DTETradeEquipmentsMappingData';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';

export interface Category { 
  ItemCategoryID: number;
  CategoryName: string; 
}

export interface MonthlyRequestData {
  MonthNumber: number;
  MonthName: string;
  TotalIssued: number;
}

export interface DonutItem {
  Label: string;
  TotalCount: number;
}

export interface StatusMixItem {
  StatusName: string;
  TotalCount: number;
}

export interface CategoryEquipmentBarItem {
  CategoryName: string;
  EquipmentCount: number;
}

export interface InventoryRequest {
  request_id: string;
  request_date: string;
  department: string;
  item: string;
  category: string;
  quantity: string;
  unit: string;
  status: 'Issued' | 'Approved' | 'Pending' | 'Rejected';
}

export interface ChartPermissions {
  kpiTiles: boolean;
  categoryEquipmentBar: boolean;
  categoryDonut: boolean;
  equipmentDonut: boolean;
  monthlyIssued: boolean;
  requestStatus: boolean;
  topRequestedItems: boolean;
}

@Component({
  selector: 'app-inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.css'],
  standalone: false
})
export class InventoryDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartMonthly') chartMonthlyRef!: ElementRef<HTMLDivElement>;
  @ViewChild('chartStatus') chartStatusRef!: ElementRef<HTMLDivElement>;
  @ViewChild('chartTop') chartTopRef!: ElementRef<HTMLDivElement>;
  
  @ViewChild('categoryDonutCanvas') categoryDonutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('equipmentDonutCanvas') equipmentDonutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryEquipmentBarCanvas') categoryEquipmentBarCanvas!: ElementRef<HTMLCanvasElement>;

  private categoryChartInstance: Chart<'doughnut'> | null = null;
  private equipmentChartInstance: Chart<'doughnut'> | null = null;
  private categoryEquipmentBarInstance: Chart<'bar'> | null = null;
  private resizeTimer: any;

  // Strongly typed SSO Data Model instance
  public sSOLoginDataModel = new SSOLoginDataModel();

  // Initialized strictly to false
  canView: ChartPermissions = {
    kpiTiles: false,
    categoryEquipmentBar: false,
    categoryDonut: false,
    equipmentDonut: false,
    monthlyIssued: false,
    requestStatus: false,
    topRequestedItems: false
  };

  categories: Category[] = [];
  selectedCategoryId: number = 0;
  selectedCategoryName: string = 'All categories';

  monthlyData: MonthlyRequestData[] = [];
  categoryDonutData: DonutItem[] = [];
  equipmentDonutData: DonutItem[] = [];
  statusMixData: StatusMixItem[] = [];
  categoryEquipmentBarData: CategoryEquipmentBarItem[] = [];

  kpi: any = {
    categoryScope: 'All categories',
    categories: 0,
    items: 0,
    requests: 0,
    units_requested: 0,
    approved: 0,
    rejected: 0
  };

  requests: InventoryRequest[] = [
    { request_id: 'REQ-001', request_date: '2026-05-02', department: 'IT', item: 'fan', category: 'Electrical', quantity: '10', unit: 'cm', status: 'Issued' },
    { request_id: 'REQ-002', request_date: '2026-05-04', department: 'Admin', item: 'table', category: 'electronics', quantity: '6', unit: 'cm', status: 'Rejected' },
    { request_id: 'REQ-003', request_date: '2026-05-09', department: 'Academics', item: 'Monitor', category: 'furniture', quantity: '3', unit: 'inch', status: 'Issued' }
  ];

  donutColors: string[] = [
    '#176982', '#028090', '#F26419', '#F6AE2D', 
    '#33658A', '#86BBD8', '#2F4858', '#E71D36', '#7209B7'
  ];

  colors = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)'];
  statusColors: Record<string, string> = {
    Issued: '#2f6fdd',
    Approved: '#1f9d8a',
    Request: '#e0a21b',
    Rejected: '#d2453a'
  };

  constructor(
    private toastr: ToastrService,
    private tradeEquipmentsMappingService: DteTradeEquipmentsMappingService,
    private equipmentsService: DTEEquipmentsMasterService,
    private itemCategoriesService: DTEItemCategoriesMasterService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private commonFunctionService: CommonFunctionService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    const rawSSOUser = localStorage.getItem('SSOLoginUser');
    if (rawSSOUser) {
      try {
        this.sSOLoginDataModel = await JSON.parse(String(rawSSOUser));
      } catch (e) {
        console.error('Failed to parse SSOLoginUser', e);
      }
    }

    await this.loadCategoryList();
    await this.loadAllDashboardData();
  }

  ngAfterViewInit(): void {
    if (this.categoryDonutData.length > 0 || this.equipmentDonutData.length > 0 || this.categoryEquipmentBarData.length > 0) {
      this.renderAllCharts();
    }
  }

  ngOnDestroy(): void {
    if (this.categoryChartInstance) this.categoryChartInstance.destroy();
    if (this.equipmentChartInstance) this.equipmentChartInstance.destroy();
    if (this.categoryEquipmentBarInstance) this.categoryEquipmentBarInstance.destroy();
  }

  private getInstituteId(): number {
    return Number(this.sSOLoginDataModel.InstituteID || 0);
  }

  private getRoleId(): number {
    return Number(this.sSOLoginDataModel.RoleID || 0);
  }

  async loadAllDashboardData(): Promise<void> {
    // 1. Fetch TilesCount & role permission flags from SQL
    await this.loadTilesCount();

    // 2. Fetch data only for charts authorized by SQL flags
    const chartTasks: Promise<any>[] = [];

    if (this.canView.monthlyIssued) {
      chartTasks.push(this.loadMonthlyChartData());
    }
    if (this.canView.requestStatus) {
      chartTasks.push(this.loadStatusMixData());
    }
    if (this.canView.categoryDonut) {
      chartTasks.push(this.loadCategoryDistribution());
    }
    if (this.canView.equipmentDonut) {
      chartTasks.push(this.loadEquipmentDistribution());
    }
    if (this.canView.categoryEquipmentBar) {
      chartTasks.push(this.loadCategoryEquipmentBarData());
    }

    await Promise.all(chartTasks);

    this.cdr.detectChanges();
    this.renderAllCharts();
  }

  async loadCategoryList(): Promise<void> {
    try {
      this.loaderService.requestStarted();
      const request = new InventoryDashDynamicDataModel();
      request.Action = 'CategoryLIST';
      request.CategoryId = 0;
      request.EquipmentId = 0;
      request.RoleID = this.getRoleId();
      request.InstituteID = this.getInstituteId();

      const response: any = await this.tradeEquipmentsMappingService.GetInventoryDynamicDashData(request);
      if (response && (response.State === 1 || response.State === 'Success' || response.State === true || response.state === 1)) {
        const rawList = response.Data?.CategoryList || response.Data || [];
        this.categories = rawList.map((c: any) => ({
          ItemCategoryID: Number(c.ItemCategoryID || 0),
          CategoryName: c.CategoryName || c.ItemCategoryName || ''
        })).filter((c: Category) => !!c.CategoryName);
      } else {
        this.categories = [];
      }
    } catch (ex) {
      console.error('Error loading categories:', ex);
      this.categories = [];
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async loadTilesCount(): Promise<void> {
    try {
      this.loaderService.requestStarted();
      const roleId = this.getRoleId();

      const request = new InventoryDashDynamicDataModel();
      request.Action = 'TilesCount';
      request.CategoryId = this.selectedCategoryId;
      request.EquipmentId = 0;
      request.RoleID = roleId;
      request.InstituteID = this.getInstituteId();
debugger
      const response: any = await this.tradeEquipmentsMappingService.GetInventoryDynamicDashData(request);
      if (response && (response.State === 1 || response.State === 'Success' || response.State === true || response.state === 1)) {
        const list = response.Data?.TilesCount || response.Data || [];
        const row = Array.isArray(list) ? (list[0] || {}) : list;

        this.kpi = {
          categoryScope: this.selectedCategoryName,
          categories: Number(row.CategoriesCount || row.categoriesCount || 0),
          items: Number(row.ItemsCount || row.itemsCount || 0),
          requests: Number(row.TotalRequests || row.totalRequests || 0),
          units_requested: Number(row.UnitsRequested || row.unitsRequested || 0),
          approved: Number(row.TotalApproved || row.totalApproved || 0),
          rejected: Number(row.TotalRejected || row.totalRejected || 0)
        };

        const checkFlag = (val1: any, val2: any): boolean => {
          const val = val1 !== undefined ? val1 : val2;
          return Number(val) === 1 || val === true || String(val).toLowerCase() === 'true';
        };

        const sqlReturnedFlags = row.canViewKpiTiles !== undefined || row.CanViewKpiTiles !== undefined;

        if (sqlReturnedFlags) {
          this.canView = {
            kpiTiles: checkFlag(row.canViewKpiTiles, row.CanViewKpiTiles),
            categoryEquipmentBar: checkFlag(row.canViewCategoryEquipmentBar, row.CanViewCategoryEquipmentBar),
            categoryDonut: checkFlag(row.canViewCategoryDonut, row.CanViewCategoryDonut),
            equipmentDonut: checkFlag(row.canViewEquipmentDonut, row.CanViewEquipmentDonut),
            monthlyIssued: checkFlag(row.canViewMonthlyIssued, row.CanViewMonthlyIssued),
            requestStatus: checkFlag(row.canViewRequestStatus, row.CanViewRequestStatus),
            topRequestedItems: checkFlag(row.canViewTopRequestedItems, row.CanViewTopRequestedItems)
          };

          // Safe fallback for configured allowed roles if flags were not populated
          const allFlagsZero = !Object.values(this.canView).some(v => v === true);
          if (allFlagsZero && [7, 13, 17].includes(roleId)) {
            this.canView = {
              kpiTiles: true,
              categoryEquipmentBar: true,
              categoryDonut: true,
              equipmentDonut: true,
              monthlyIssued: true,
              requestStatus: true,
              topRequestedItems: true
            };
          }
        } else {
          const isAllowed = [7, 13, 17].includes(roleId);
          this.canView = {
            kpiTiles: isAllowed,
            categoryEquipmentBar: isAllowed,
            categoryDonut: isAllowed,
            equipmentDonut: isAllowed,
            monthlyIssued: isAllowed,
            requestStatus: isAllowed,
            topRequestedItems: isAllowed
          };
        }
      } else {
        this.resetPermissionsToFalse();
      }
    } catch (ex) {
      console.error('Error loading tiles count and flags:', ex);
      this.resetPermissionsToFalse();
    } finally {
      this.loaderService.requestEnded();
    }
  }

  private resetPermissionsToFalse(): void {
    this.canView = {
      kpiTiles: false,
      categoryEquipmentBar: false,
      categoryDonut: false,
      equipmentDonut: false,
      monthlyIssued: false,
      requestStatus: false,
      topRequestedItems: false
    };
  }

  async loadMonthlyChartData(): Promise<void> {
    try {
      this.loaderService.requestStarted();
      const request = new InventoryDashDynamicDataModel();
      request.Action = 'MonthlyRequestsChart';
      request.CategoryId = this.selectedCategoryId;
      request.EquipmentId = 0;
      request.RoleID = this.getRoleId();
      request.InstituteID = this.getInstituteId();

      const response: any = await this.tradeEquipmentsMappingService.GetInventoryDynamicDashData(request);
      if (response && (response.State === 1 || response.State === 'Success' || response.State === true || response.state === 1)) {
        const list = response.Data?.MonthlyRequests || response.Data || [];
        this.monthlyData = list.map((m: any) => ({
          MonthNumber: Number(m.MonthNumber || 0),
          MonthName: (m.MonthName || '').trim(),
          TotalIssued: Number(m.TotalIssued || 0)
        }));
      } else {
        this.monthlyData = [];
      }
    } catch (ex) {
      console.error('Error loading monthly chart data:', ex);
      this.monthlyData = [];
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async loadStatusMixData(): Promise<void> {
    try {
      this.loaderService.requestStarted();
      const request = new InventoryDashDynamicDataModel();
      request.Action = 'RequestStatusMixChart';
      request.CategoryId = this.selectedCategoryId;
      request.EquipmentId = 0;
      request.RoleID = this.getRoleId();
      request.InstituteID = this.getInstituteId();

      const response: any = await this.tradeEquipmentsMappingService.GetInventoryDynamicDashData(request);
      if (response && (response.State === 1 || response.State === 'Success' || response.State === true || response.state === 1)) {
        const list = response.Data?.RequestStatusMix || response.Data || [];
        this.statusMixData = list.map((s: any) => ({
          StatusName: (s.StatusName || '').trim(),
          TotalCount: Number(s.TotalCount || 0)
        }));
      } else {
        this.statusMixData = [];
      }
    } catch (ex) {
      console.error('Error loading request status data:', ex);
      this.statusMixData = [];
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async loadCategoryDistribution(): Promise<void> {
    try {
      this.loaderService.requestStarted();
      const request = new InventoryDashDynamicDataModel();
      request.Action = 'CategoryDistributionChart';
      request.CategoryId = this.selectedCategoryId;
      request.EquipmentId = 0;
      request.RoleID = this.getRoleId();
      request.InstituteID = this.getInstituteId();

      const response: any = await this.tradeEquipmentsMappingService.GetInventoryDynamicDashData(request);
      if (response && (response.State === 1 || response.State === 'Success' || response.State === true || response.state === 1)) {
        const list = response.Data?.CategoryDistribution || response.Data || [];
        this.categoryDonutData = list.map((item: any) => ({
          Label: item.Label || item.CategoryName || 'Other',
          TotalCount: Number(item.TotalCount || 0)
        }));
      } else {
        this.categoryDonutData = [];
      }
    } catch (ex) {
      console.error('Error loading category distribution:', ex);
      this.categoryDonutData = [];
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async loadEquipmentDistribution(): Promise<void> {
    try {
      this.loaderService.requestStarted();
      const request = new InventoryDashDynamicDataModel();
      request.Action = 'EquipmentDistributionChart';
      request.CategoryId = this.selectedCategoryId;
      request.EquipmentId = 0;
      request.RoleID = this.getRoleId();
      request.InstituteID = this.getInstituteId();

      const response: any = await this.tradeEquipmentsMappingService.GetInventoryDynamicDashData(request);
      if (response && (response.State === 1 || response.State === 'Success' || response.State === true || response.state === 1)) {
        const list = response.Data?.EquipmentDistribution || response.Data || [];
        this.equipmentDonutData = list.map((item: any) => ({
          Label: item.Label || item.Name || 'Other',
          TotalCount: Number(item.TotalCount || 0)
        }));
      } else {
        this.equipmentDonutData = [];
      }
    } catch (ex) {
      console.error('Error loading equipment distribution:', ex);
      this.equipmentDonutData = [];
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async loadCategoryEquipmentBarData(): Promise<void> {
    try {
      this.loaderService.requestStarted();
      const request = new InventoryDashDynamicDataModel();
      request.Action = 'CategoryEquipmentBarChart';
      request.CategoryId = this.selectedCategoryId;
      request.EquipmentId = 0;
      request.RoleID = this.getRoleId();
      request.InstituteID = this.getInstituteId();

      const response: any = await this.tradeEquipmentsMappingService.GetInventoryDynamicDashData(request);
      if (response && (response.State === 1 || response.State === 'Success' || response.State === true || response.state === 1)) {
        const list = response.Data?.CategoryEquipmentBar || response.Data || [];
        this.categoryEquipmentBarData = list.map((item: any) => ({
          CategoryName: item.CategoryName || '',
          EquipmentCount: Number(item.EquipmentCount || 0)
        }));
      } else {
        this.categoryEquipmentBarData = [];
      }
    } catch (ex) {
      console.error('Error loading category equipment bar data:', ex);
      this.categoryEquipmentBarData = [];
    } finally {
      this.loaderService.requestEnded();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.renderAllCharts();
    }, 120);
  }

  async onCategoryChange(): Promise<void> {
    const selected = this.categories.find(c => c.ItemCategoryID === Number(this.selectedCategoryId));
    this.selectedCategoryName = selected ? selected.CategoryName : 'All categories';

    await this.loadAllDashboardData();
  }

  async resetFilters(): Promise<void> {
    this.selectedCategoryId = 0;
    this.selectedCategoryName = 'All categories';

    await this.loadAllDashboardData();
  }

  formatNumber(val: number): string {
    return d3.format(',')(val || 0);
  }

  private renderAllCharts(): void {
    this.renderD3Charts();
    setTimeout(() => {
      if (this.canView.categoryDonut || this.canView.equipmentDonut) {
        this.initChartJsDonuts();
      }
      if (this.canView.categoryEquipmentBar) {
        this.renderCategoryEquipmentBarChart();
      }
    }, 0);
  }

  private renderD3Charts(): void {
    if (this.canView.monthlyIssued) {
      this.renderMonthlyChart();
    }
    if (this.canView.requestStatus) {
      this.renderStatusMixChart();
    }
    if (this.canView.topRequestedItems) {
      this.renderTopItemsChart();
    }
  }

  private renderCategoryEquipmentBarChart(): void {
    const canvas = this.categoryEquipmentBarCanvas?.nativeElement;
    if (!canvas) return;

    if (this.categoryEquipmentBarInstance) {
      this.categoryEquipmentBarInstance.destroy();
      this.categoryEquipmentBarInstance = null;
    }

    const data = this.categoryEquipmentBarData;
    if (!data || data.length === 0) return;

    const labels = data.map(d => d.CategoryName);
    const counts = data.map(d => d.EquipmentCount);
    const maxVal = Math.max(...counts, 5);

    this.categoryEquipmentBarInstance = new Chart<'bar'>(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Equipment Count',
          data: counts,
          backgroundColor: '#028090',
          borderRadius: 8,
          borderSkipped: 'bottom',
          barThickness: 18,
          maxBarThickness: 24
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#1d2330',
            bodyColor: '#5f6878',
            borderColor: '#dde1e7',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (ctx) => ` Equipment Count: ${ctx.raw}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: 11,
                family: '"Segoe UI", system-ui, sans-serif'
              },
              color: '#5f6878'
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: maxVal + 2,
            title: {
              display: true,
              text: 'Number of Equipments',
              color: '#5f6878',
              font: { size: 12 }
            },
            grid: { color: '#f0f2f5' },
            ticks: {
              stepSize: maxVal > 20 ? 5 : 2,
              color: '#5f6878'
            }
          }
        }
      }
    });
  }

  private initChartJsDonuts(): void {
    if (this.canView.categoryDonut) {
      this.buildChartJsDonut('category', this.categoryDonutCanvas?.nativeElement, this.categoryDonutData);
    }
    if (this.canView.equipmentDonut) {
      this.buildChartJsDonut('equipment', this.equipmentDonutCanvas?.nativeElement, this.equipmentDonutData);
    }
  }

  private buildChartJsDonut(type: 'category' | 'equipment', canvas: HTMLCanvasElement | undefined, data: DonutItem[]): void {
    if (!canvas) return;

    if (type === 'category' && this.categoryChartInstance) {
      this.categoryChartInstance.destroy();
      this.categoryChartInstance = null;
    }
    if (type === 'equipment' && this.equipmentChartInstance) {
      this.equipmentChartInstance.destroy();
      this.equipmentChartInstance = null;
    }

    if (!data || data.length === 0) return;

    const labels = data.map(d => d.Label);
    const counts = data.map(d => d.TotalCount);
    const total = counts.reduce((a, b) => a + b, 0);

    const centerTextPlugin: Plugin<'doughnut'> = {
      id: `centerText_${type}`,
      beforeDraw(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const { width, height, top, left } = chartArea;
        ctx.save();
        
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        ctx.font = '700 1.5rem "Segoe UI", system-ui, sans-serif';
        ctx.fillStyle = '#1d2330';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(total > 0 ? '100%' : '0%', centerX, centerY);

        ctx.restore();
      }
    };

    const newChart = new Chart<'doughnut'>(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: this.donutColors.slice(0, data.length),
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            align: 'center',
            labels: {
              boxWidth: 14,
              boxHeight: 14,
              usePointStyle: false,
              padding: 14,
              font: {
                size: 13,
                family: '"Segoe UI", system-ui, sans-serif'
              },
              generateLabels: (chart) => {
                const dataset = chart.data.datasets[0];
                return chart.data.labels!.map((label, i) => {
                  const val = dataset.data[i] as number;
                  const pct = total > 0 ? ((val / total) * 100).toFixed(2) : '0';
                  return {
                    text: `${label} (${pct}%)`,
                    fillStyle: (dataset.backgroundColor as string[])[i],
                    strokeStyle: '#ffffff',
                    lineWidth: 1,
                    index: i,
                    hidden: !chart.isDatasetVisible(0)
                  };
                });
              }
            }
          },
          tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#1d2330',
            bodyColor: '#5f6878',
            borderColor: '#dde1e7',
            borderWidth: 1,
            padding: 10,
            boxPadding: 4,
            usePointStyle: true,
            callbacks: {
              label: (ctx) => {
                const val = ctx.raw as number;
                const pct = total > 0 ? ((val / total) * 100).toFixed(2) : '0';
                return ` ${ctx.label}: ${val} (${pct}%)`;
              }
            }
          }
        }
      },
      plugins: [centerTextPlugin]
    });

    if (type === 'category') this.categoryChartInstance = newChart;
    if (type === 'equipment') this.equipmentChartInstance = newChart;
  }

  private renderMonthlyChart(): void {
    const el = this.chartMonthlyRef?.nativeElement;
    if (!el) return;
    el.replaceChildren();

    const data = this.monthlyData;
    if (!data || data.length === 0) {
      el.innerHTML = `<div class="ia-fail">No monthly issued items data found.</div>`;
      return;
    }

    const w = el.clientWidth;
    if (!w) return;
    const h = 220;
    const margin = { top: 22, right: 12, bottom: 26, left: 12 };

    const svg = d3.select(el).append('svg')
      .attr('width', '100%')
      .attr('height', h)
      .attr('viewBox', `0 0 ${w} ${h}`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.MonthName))
      .range([margin.left, w - margin.right])
      .padding(0.35);

    const maxVal = d3.max(data, d => d.TotalIssued) || 1;
    const y = d3.scaleLinear().domain([0, maxVal]).range([h - margin.bottom, margin.top]).nice();

    svg.append('line')
      .attr('x1', margin.left).attr('x2', w - margin.right)
      .attr('y1', h - margin.bottom).attr('y2', h - margin.bottom)
      .attr('stroke', 'var(--cds-chart-axis)');

    const bw = Math.min(32, x.bandwidth());
    const g = svg.selectAll('.bar-group').data(data).join('g').attr('class', 'bar-group');

    g.append('rect')
      .attr('x', d => x(d.MonthName) || 0)
      .attr('width', x.bandwidth())
      .attr('y', margin.top)
      .attr('height', h - margin.top - margin.bottom)
      .attr('fill', 'transparent');

    g.append('rect')
      .attr('x', d => (x(d.MonthName) || 0) + (x.bandwidth() - bw) / 2)
      .attr('width', bw)
      .attr('y', d => y(d.TotalIssued))
      .attr('height', d => Math.max(0, y(0) - y(d.TotalIssued)))
      .attr('rx', 4)
      .attr('fill', this.colors[0]);

    g.append('text')
      .attr('x', d => (x(d.MonthName) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.TotalIssued) - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', 'var(--color-fg)')
      .text(d => this.formatNumber(d.TotalIssued));

    g.append('text')
      .attr('x', d => (x(d.MonthName) || 0) + x.bandwidth() / 2)
      .attr('y', h - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', 'var(--color-fg-muted)')
      .text(d => d.MonthName.length > 3 ? d.MonthName.substring(0, 3) : d.MonthName);

    g.on('mousemove', (event, d) => {
      this.showTooltip(el, event, d.MonthName, [`Issued: ${this.formatNumber(d.TotalIssued)} items`]);
    }).on('mouseleave', () => this.hideTooltip(el));
  }

  private renderStatusMixChart(): void {
    const el = this.chartStatusRef?.nativeElement;
    if (!el) return;

    const fixedStatuses = ['Issued', 'Approved', 'Request', 'Rejected'];
    const rows = fixedStatuses.map(status => {
      const match = this.statusMixData.find(s => s.StatusName.toLowerCase() === status.toLowerCase());
      const count = match ? match.TotalCount : 0;
      return {
        label: status,
        valueText: this.formatNumber(count),
        segs: [{ v: count, color: this.statusColors[status] || this.colors[0] }],
        tip: [`${this.formatNumber(count)} items in ${status}`]
      };
    });

    this.drawHorizontalBars(el, rows);
  }

  private renderTopItemsChart(): void {
    const el = this.chartTopRef?.nativeElement;
    if (!el) return;
    const cat = this.selectedCategoryId === 0 ? '' : this.selectedCategoryName;
    const filteredRequests = this.requests.filter(r => !cat || r.category === cat);
    
    const itemMap = new Map<string, number>();
    filteredRequests.forEach(r => {
      itemMap.set(r.item, (itemMap.get(r.item) || 0) + Number(r.quantity));
    });

    const rows = Array.from(itemMap.entries()).map(([itemName, units]) => {
      return {
        label: itemName,
        valueText: this.formatNumber(units),
        units,
        segs: [{ v: units, color: this.colors[0] }],
        tip: [`${this.formatNumber(units)} units requested`]
      };
    }).sort((a, b) => b.units - a.units);

    this.drawHorizontalBars(el, rows);
  }

  private drawHorizontalBars(box: HTMLElement, rows: any[]): void {
    box.replaceChildren();
    const w = box.clientWidth;
    if (!w) return;

    const barH = 22;
    const gap = 10;
    const top = 2;
    const h = top + rows.length * (barH + gap);
    box.style.minHeight = `${h}px`;

    const svg = d3.select(box).append('svg')
      .attr('width', '100%')
      .attr('height', h)
      .attr('viewBox', `0 0 ${w} ${h}`);

    const left = Math.min(this.measureTextWidth(svg, rows.map(r => r.label)) + 12, w * 0.4);
    const right = this.measureTextWidth(svg, rows.map(r => r.valueText)) + 12;
    const maxVal = d3.max(rows, (r: any) => Math.max(d3.sum(r.segs, (s: any) => s.v), r.marker ?? 0)) || 1;
    const x = d3.scaleLinear().domain([0, maxVal]).range([0, Math.max(10, w - left - right)]);

    const self = this;
    const g = svg.selectAll('.row-group')
      .data(rows)
      .join('g')
      .attr('class', 'row-group')
      .attr('transform', (_, i) => `translate(0, ${top + i * (barH + gap)})`)
      .style('cursor', d => d.onClick ? 'pointer' : 'default');

    g.append('rect')
      .attr('x', 0)
      .attr('width', w)
      .attr('height', barH + gap)
      .attr('y', -gap / 2)
      .attr('fill', 'transparent');

    g.append('text')
      .attr('x', left - 8)
      .attr('y', barH / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('fill', 'var(--color-fg)')
      .text(d => d.label);

    g.each(function( d: any) {
      let x0 = 0;
      d.segs.forEach((s: any) => {
        if (s.v > 0) {
          d3.select(this).append('rect')
            .attr('x', left + x(x0))
            .attr('y', 0)
            .attr('height', barH)
            .attr('width', Math.max(2, x(s.v) - (d.segs.length > 1 ? 1 : 0)))
            .attr('rx', d.segs.length > 1 ? 2 : 4)
            .attr('fill', s.color);
        }
        x0 += s.v;
      });

      if (d.marker != null) {
        d3.select(this).append('line')
          .attr('x1', left + x(d.marker))
          .attr('x2', left + x(d.marker))
          .attr('y1', -3)
          .attr('y2', barH + 3)
          .attr('stroke', 'var(--cds-chart-reference)')
          .attr('stroke-width', 2);
      }

      d3.select(this).append('text')
        .attr('x', left + x(x0) + 6)
        .attr('y', barH / 2)
        .attr('dy', '0.35em')
        .attr('font-size', '12px')
        .attr('fill', 'var(--color-fg-muted)')
        .text((d: any) => d.valueText);
    });

    g.on('mousemove', (event, d) => self.showTooltip(box, event, d.label, d.tip))
     .on('mouseleave', () => self.hideTooltip(box));
  }

  private measureTextWidth(svg: any, labels: string[]): number {
    const tempGroup = svg.append('g');
    let max = 0;
    labels.forEach(l => {
      const textNode = tempGroup.append('text').attr('font-size', '12px').text(l);
      max = Math.max(max, textNode.node().getComputedTextLength());
    });
    tempGroup.remove();
    return max;
  }

  private showTooltip(box: HTMLElement, event: MouseEvent, header: string, lines: string[]): void {
    let tip = box.querySelector('.ia-tip') as HTMLDivElement;
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'ia-tip';
      box.appendChild(tip);
    }
    tip.hidden = false;
    tip.innerHTML = `<div class="ia-tip-head">${header}</div>` + lines.map(l => `<div>${l}</div>`).join('');

    const [mx, my] = d3.pointer(event, box);
    const boxWidth = box.clientWidth;
    const tipWidth = tip.offsetWidth;

    tip.style.left = `${Math.max(0, Math.min(mx + 12, boxWidth - tipWidth))}px`;
    tip.style.top = `${Math.max(0, my - tip.offsetHeight - 8)}px`;
  }

  private hideTooltip(box: HTMLElement): void {
    const tip = box.querySelector('.ia-tip') as HTMLDivElement;
    if (tip) tip.hidden = true;
  }
}