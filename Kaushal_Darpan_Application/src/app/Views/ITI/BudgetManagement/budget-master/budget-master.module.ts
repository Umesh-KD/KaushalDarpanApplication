import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { BudgetMasterComponent } from './budget-master.component';
import { BudgetMasterRoutingModule } from './budget-master-routing.module';


@NgModule({
  declarations: [
    BudgetMasterComponent
  ],
  imports: [
    CommonModule,
    BudgetMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class BudgetMasterModule { }
