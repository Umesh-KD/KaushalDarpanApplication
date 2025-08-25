import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListItiTradeRoutingModule } from './list-iti-trade-routing.module';
import { ListItiTradeComponent } from './list-iti-trade.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
@NgModule({
  declarations: [
    ListItiTradeComponent
  ],
  imports: [
    CommonModule,
    ListItiTradeRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ListItiTradeModule { }
