import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { AnalyticDashboardComponent } from './analytic-dashboard.component';
import { AnalyticDashboardRoutingModule } from './analytic-dashboard-routing.module';
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
  declarations: [
    AnalyticDashboardComponent
  ],
  imports: [
    CommonModule,
    AnalyticDashboardRoutingModule,
    LoaderModule,
    BaseChartDirective
  ], exports: [AnalyticDashboardComponent] 
})
export class AnalyticDashboardModule { }
