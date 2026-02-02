import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { MinRequiredTradeItemsRoutingModule } from './min-required-trade-items-routing.module';
import { MinRequiredTradeItemsComponent } from './min-required-trade-items.component';

@NgModule({
  declarations: [
    MinRequiredTradeItemsComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    MinRequiredTradeItemsRoutingModule
  ]
})
export class MinRequiredTradeItemsModule { }
