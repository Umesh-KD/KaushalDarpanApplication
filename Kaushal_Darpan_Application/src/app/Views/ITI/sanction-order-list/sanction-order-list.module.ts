import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanctionOrderListRoutingModule } from './sanction-order-list-routing.module';
import { SanctionOrderListComponent } from './sanction-order-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    SanctionOrderListComponent
  ],
  imports: [
    CommonModule,
    SanctionOrderListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class SanctionOrderListModule { }
