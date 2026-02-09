import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveBalanceRoutingModule } from './leave-balance-routing.module';
import { LeaveBalanceComponent } from './leave-balance.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    LeaveBalanceComponent
  ],
  imports: [
    CommonModule,
    LeaveBalanceRoutingModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class LeaveBalanceModule { }
