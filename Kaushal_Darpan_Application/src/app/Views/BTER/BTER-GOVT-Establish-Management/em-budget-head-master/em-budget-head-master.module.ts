import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { EMBudgetHeadMasterComponent } from './em-budget-head-master.component';
import { EMBudgetHeadMasterRoutingModule } from './em-budget-head-master-routing.module';


@NgModule({
  declarations: [
    EMBudgetHeadMasterComponent
  ],
  imports: [
    CommonModule,
    EMBudgetHeadMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class EMBudgetHeadMasterModule { }
