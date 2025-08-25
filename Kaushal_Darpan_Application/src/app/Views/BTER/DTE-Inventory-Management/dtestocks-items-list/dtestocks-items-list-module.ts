import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { DteStocksItemsListComponent } from './dtestocks-items-list.component';
import { DteStocksItemsListRoutingModule } from './dtestocks-items-list.routing.module';

@NgModule({
  declarations: [
    DteStocksItemsListComponent
  ],
  imports: [
    CommonModule,
    DteStocksItemsListRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DteStocksItemsListModule { }
