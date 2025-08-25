import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlankReportRoutingModule } from './blank-report-routing.module';
import { BlankReportComponent } from './blank-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    BlankReportComponent
  ],
  imports: [
    CommonModule,
    BlankReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
  ]
})
export class BlankReportModule { }
