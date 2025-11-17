import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { BudgetUCHeadComponent } from './budget-uc-head.component';
import { BudgetUCHeadRoutingModule } from './budget-uc-head-routing.module';


@NgModule({
  declarations: [
    BudgetUCHeadComponent
  ],
  imports: [
    CommonModule,
    BudgetUCHeadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class BudgetUCHeadModule { }
