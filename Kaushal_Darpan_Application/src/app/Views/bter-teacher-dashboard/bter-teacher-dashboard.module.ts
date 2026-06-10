import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BterTeacherDashboardRoutingModule } from './bter-teacher-dashboard-routing.module';
import { BterTeacherDashboardComponent } from './bter-teacher-dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BterTeacherDashboardComponent
  ],
  imports: [
    CommonModule,
    BterTeacherDashboardRoutingModule,
    FormsModule,
    HighchartsChartModule
  ]
})
export class BterTeacherDashboardModule { }
