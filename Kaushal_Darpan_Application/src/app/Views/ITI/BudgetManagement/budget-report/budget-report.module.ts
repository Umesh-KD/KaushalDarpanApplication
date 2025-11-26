import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetReportRoutingModule } from './budget-report-routing.module';
import { BudgetReportComponent } from './budget-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    BudgetReportComponent
  ],
  imports: [
    CommonModule,
    BudgetReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class BudgetReportModule { }
