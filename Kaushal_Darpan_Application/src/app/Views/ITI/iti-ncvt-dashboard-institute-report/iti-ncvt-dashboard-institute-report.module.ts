import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITINcvtDashboardInstituteReportRoutingModule } from './iti-ncvt-dashboard-institute-report-routing.module';
import { ITINcvtDashboardInstituteReportComponent } from './iti-ncvt-dashboard-institute-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    ITINcvtDashboardInstituteReportComponent
  ],
  imports: [
    CommonModule,
    ITINcvtDashboardInstituteReportRoutingModule,
     FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule,
  ]
})
export class ITINcvtDashboardInstituteReportModule { }
