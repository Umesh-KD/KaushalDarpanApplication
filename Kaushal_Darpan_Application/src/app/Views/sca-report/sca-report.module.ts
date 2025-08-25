import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScaReportRoutingModule } from './sca-report-routing.module';
import { ScaReportComponent } from './sca-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ScaReportComponent
  ],
  imports: [
    CommonModule,
    ScaReportRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class ScaReportModule { }
