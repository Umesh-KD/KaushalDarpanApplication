import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeatIntakesListRoutingModule } from './seat-intakes-list-routing.module';
import { SeatIntakesListComponent } from './seat-intakes-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    SeatIntakesListComponent
  ],
  imports: [
    CommonModule,
    SeatIntakesListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class SeatIntakesListModule { }
