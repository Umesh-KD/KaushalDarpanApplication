import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmissionDashboardRoutingModule } from './admission-dashboard-routing.module';
import { AdmissionDashboardComponent } from './admission-dashboard.component';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';


@NgModule({
  declarations: [
    AdmissionDashboardComponent
  ],
  imports: [
    CommonModule,
    AdmissionDashboardRoutingModule,
    FormsModule,
    HighchartsChartModule
  ]
})
export class AdmissionDashboardModule { }
