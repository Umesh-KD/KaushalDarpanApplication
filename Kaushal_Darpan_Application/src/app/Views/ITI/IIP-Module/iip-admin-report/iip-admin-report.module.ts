import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITIIIPAdminReportComponent } from './iip-admin-report.component';
import { ITIIIPAdminReportRoutingModule } from './iip-admin-report-routing.module';

@NgModule({
  declarations: [
    ITIIIPAdminReportComponent
  ],
  imports: [
    CommonModule,
    ITIIIPAdminReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ITIIIPAdminReportModule { }
