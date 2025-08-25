import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollegeBudgetListRoutingModule } from './college-budget-list-routing.module';
import { CollegeBudgetListComponent } from './college-budget-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    CollegeBudgetListComponent
  ],
  imports: [
    CommonModule,
    CollegeBudgetListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class CollegeBudgetListModule { }
