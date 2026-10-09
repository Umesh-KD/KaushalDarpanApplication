import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { BterDynamicReportComponent } from './bter-dynamic-report.component';
import { BterDynamicReportRoutingModule } from './bter-dynamic-report.routing.module';
import { DataTableModule } from '../../../Common/data-table/data-table.module';

@NgModule({
  declarations: [
    BterDynamicReportComponent
  ],
  imports: [
    CommonModule,
    BterDynamicReportRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,DataTableModule
  ]
})
export class BterDynamicReportModule { }
