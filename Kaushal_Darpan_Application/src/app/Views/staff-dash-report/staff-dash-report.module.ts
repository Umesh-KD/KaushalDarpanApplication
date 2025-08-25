import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaffDashReportComponent } from './staff-dash-report.component';
import { StaffDashboardRoutingModule } from '../staff-dashboard/staff-dashboard.routing.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { StaffDashReportRoutingModule } from './staff-dash-report.routing.module';
import { NgModule } from '@angular/core';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    StaffDashReportComponent
  ],
  imports: [
    CommonModule,
    StaffDashReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class StaffDashReportMasterModule { }
