import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrollmentCancellationReportRoutingModule } from './enrollment-cancellation-report-routing.module';
import { EnrollmentCancellationReportComponent } from './enrollment-cancellation-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    EnrollmentCancellationReportComponent
  ],
  imports: [
    CommonModule,
    EnrollmentCancellationReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
  ]
})
export class EnrollmentCancellationReportModule { }
