import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OptionalFormatReportComponent } from './optional-format-report.component';
import { OptionalFormatReportRoutingModule } from './optional-format-report-routing.module';


@NgModule({
  declarations: [
    OptionalFormatReportComponent
  ],
  imports: [
    CommonModule,
    OptionalFormatReportRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class OptionalFormatReportModule { }
