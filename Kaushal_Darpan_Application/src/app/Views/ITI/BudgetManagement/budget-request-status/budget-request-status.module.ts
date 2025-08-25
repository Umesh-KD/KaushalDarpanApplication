import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetRequestStatusRoutingModule } from './budget-request-status-routing.module';
import { BudgetRequestStatusComponent } from './budget-request-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    BudgetRequestStatusComponent
  ],
  imports: [
    CommonModule,
    BudgetRequestStatusRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class BudgetRequestStatusModule { }
