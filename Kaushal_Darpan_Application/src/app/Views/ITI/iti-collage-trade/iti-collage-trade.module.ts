import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITICollageTradeRoutingModule } from './iti-collage-trade-routing.module';
import { ITICollageTradeComponent } from './iti-collage-trade.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ITICollageTradeComponent
  ],
  imports: [
    CommonModule,
    ITICollageTradeRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ITICollageTradeModule { }
