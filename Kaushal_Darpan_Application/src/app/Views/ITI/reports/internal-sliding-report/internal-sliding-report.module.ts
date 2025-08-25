import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalSlidingReportRoutingModule } from './internal-sliding-report-routing.module';
import { InternalSlidingReportComponent } from './internal-sliding-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    InternalSlidingReportComponent
  ],
  imports: [
    CommonModule,
    InternalSlidingReportRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class InternalSlidingReportModule { }
