import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { AddMinRequiredTradeItemsComponent } from './add-min-required-trade-items.component';
import { AddMinRequiredTradeItemsRoutingModule } from './add-min-required-trade-items-routing.module';

@NgModule({
  declarations: [
    AddMinRequiredTradeItemsComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    AddMinRequiredTradeItemsRoutingModule
  ]
})
export class AddMinRequiredTradeItemsModule { }
