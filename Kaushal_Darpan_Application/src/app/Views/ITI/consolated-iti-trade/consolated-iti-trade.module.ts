import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsolatedItiTradeRoutingModule } from './consolated-iti-trade-routing.module';
import { ConsolatedItiTradeComponent } from './consolated-iti-trade.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ConsolatedItiTradeComponent
  ],
  imports: [
    CommonModule,
    ConsolatedItiTradeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    NgSelectModule
  ]
})
export class ConsolatedItiTradeModule { }
