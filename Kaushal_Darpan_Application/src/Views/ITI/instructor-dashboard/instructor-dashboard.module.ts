import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorDashboardRoutingModule } from './instructor-dashboard-routing.module';
import { InstructorDashboardComponent } from './InstructorDashboardComponent';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';


@NgModule({
  declarations: [
    InstructorDashboardComponent
  ],
  imports: [
    CommonModule,
    InstructorDashboardRoutingModule,
    FormsModule,
    HighchartsChartModule
  ],
  exports: [InstructorDashboardComponent]
})
export class InstructorDashboardModule { }
