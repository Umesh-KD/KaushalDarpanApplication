import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITIAllotmentReportRoutingModule } from './iti-allotment-report-routing.module';
import { ITIAllotmentReportComponent } from './iti-allotment-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ITIAllotmentReportComponent
  ],
  imports: [
    CommonModule,
    ITIAllotmentReportRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ITIAllotmentReportModule { }
