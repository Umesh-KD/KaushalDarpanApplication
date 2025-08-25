import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveListRoutingModule } from './leave-list-routing.module';
import { LeaveListComponent } from './leave-list.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    LeaveListComponent
  ],
  imports: [
    CommonModule,
    LeaveListRoutingModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class LeaveListModule { }
