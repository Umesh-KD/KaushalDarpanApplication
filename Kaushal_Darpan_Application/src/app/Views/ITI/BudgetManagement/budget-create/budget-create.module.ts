import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { BudgetCreateComponent } from './budget-create.component';
import { BudgetCreateRoutingModule } from './budget-create-routing.module';


@NgModule({
  declarations: [
    BudgetCreateComponent
  ],
  imports: [
    CommonModule,
    BudgetCreateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class BudgetCreateModule { }
