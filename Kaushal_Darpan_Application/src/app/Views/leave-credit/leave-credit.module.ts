import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveCreditRoutingModule } from './leave-credit-routing.module';
import { LeaveCreditComponent } from './leave-credit.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    LeaveCreditComponent
  ],
  imports: [
    CommonModule,
    LeaveCreditRoutingModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class LeaveCreditModule { }
