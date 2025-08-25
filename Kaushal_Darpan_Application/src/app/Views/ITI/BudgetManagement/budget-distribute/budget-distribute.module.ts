import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetDistributeRoutingModule } from './budget-distribute-routing.module';
import { BudgetDistributeComponent } from './budget-distribute.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    BudgetDistributeComponent
  ],
  imports: [
    CommonModule,
    BudgetDistributeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class BudgetDistributeModule { }
