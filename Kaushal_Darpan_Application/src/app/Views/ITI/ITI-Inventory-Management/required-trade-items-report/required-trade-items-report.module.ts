import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { RequiredTradeItemsReportRoutingModule } from './required-trade-items-report-routing.module';
import { RequiredTradeItemsReportComponent } from './required-trade-items-report.component';

@NgModule({
  declarations: [
    RequiredTradeItemsReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    RequiredTradeItemsReportRoutingModule
  ]
})
export class RequiredTradeItemsReportModule { }
