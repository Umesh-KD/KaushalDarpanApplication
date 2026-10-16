import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostelManagementDashboardRoutingModule } from './hostel-management-dashboard-routing.module';
import { HostelManagementDashboardComponent } from './hostel-management-dashboard.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HostelManagementDashboardComponent
  ],
  imports: [
    CommonModule,
    HostelManagementDashboardRoutingModule,
    FormsModule,
    LoaderModule,
    BaseChartDirective
  ]
})
export class HostelManagementDashboardModule { }
