import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeatDataListRoutingModule } from './seat-datalist-routing.module';
import { SeatDataListComponent } from './seat-datalist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    SeatDataListComponent
  ],
  imports: [
    CommonModule,
    SeatDataListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class SeatDataListModule { }
