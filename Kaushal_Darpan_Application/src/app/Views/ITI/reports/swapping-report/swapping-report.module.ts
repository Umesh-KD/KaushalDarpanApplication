import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwappingReportRoutingModule } from './swapping-report-routing.module';
import { SwappingReportComponent } from './swapping-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    SwappingReportComponent
  ],
  imports: [
    CommonModule,
    SwappingReportRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class SwappingReportModule { }
